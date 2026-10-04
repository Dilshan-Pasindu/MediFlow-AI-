using MediFlow.Api.Data;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

using MediFlow.Api.Hubs;

// Load .env file into environment if present
LoadDotEnv(Path.Combine(Directory.GetCurrentDirectory(), ".env"));
LoadDotEnv(Path.Combine(Directory.GetCurrentDirectory(), "..", ".env"));

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// ─── Database ────────────────────────────────────────────────────────────────
var rawConn = builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=MedFlow-AI;Username=postgres;Password=postgres";

var connectionString = ParsePostgreSqlConnectionString(rawConn);
var forceInMemory = string.Equals(builder.Configuration["USE_IN_MEMORY_DB"], "true", StringComparison.OrdinalIgnoreCase);

bool postgresAvailable = false;
if (!forceInMemory)
{
    try
    {
        using var testConn = new Npgsql.NpgsqlConnection(connectionString);
        testConn.Open();
        postgresAvailable = true;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Warning] PostgreSQL connection failed ({ex.Message}). Falling back to In-Memory Database for seamless execution.");
        postgresAvailable = false;
    }
}

if (postgresAvailable)
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(
            connectionString,
            npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null);
                npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            }));
}
else
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("MediFlowDb"));
}

// ─── SignalR ──────────────────────────────────────────────────────────────────
builder.Services.AddSignalR();

// ─── Services ─────────────────────────────────────────────────────────────────
builder.Services.AddHttpClient();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<InventoryService>();
builder.Services.AddScoped<ISupabaseUserResolver, SupabaseUserResolver>();

// ─── AI Microservice HTTP Client (Member 3) ──────────────────────────────────────
var aiBaseUrl = builder.Configuration["AiService:BaseUrl"]
    ?? "http://localhost:8000";

builder.Services.AddHttpClient("AiService", client =>
{
    client.BaseAddress = new Uri(aiBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(60);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddScoped<IAiServiceClient, AiServiceClient>();
builder.Services.AddScoped<AiServiceClient>();

// ─── PayHere Sandbox HTTP Client & Service ────────────────────────────────────
builder.Services.AddHttpClient("PayHere", client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddScoped<PayHereService>();

// ─── Supabase & JWT Authentication ───────────────────────────────────────────
var signingKeys = new List<SecurityKey>();

var supabaseJwtSecret = builder.Configuration["SUPABASE_JWT_SECRET"]
    ?? builder.Configuration["Supabase:JwtSecret"];

if (!string.IsNullOrWhiteSpace(supabaseJwtSecret))
{
    signingKeys.Add(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(supabaseJwtSecret)));
}

var internalJwtKey = builder.Configuration["Jwt:Key"]
    ?? "MediFlowAI_SuperSecretKey_2026_ForDevelopment_Only_32chars!";

signingKeys.Add(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(internalJwtKey)));

var validIssuers = new List<string>();
if (!string.IsNullOrWhiteSpace(builder.Configuration["Jwt:Issuer"]))
    validIssuers.Add(builder.Configuration["Jwt:Issuer"]!);

var supabaseUrl = builder.Configuration["SUPABASE_URL"] ?? builder.Configuration["Supabase:Url"];
if (!string.IsNullOrWhiteSpace(supabaseUrl))
{
    var trimmedUrl = supabaseUrl.TrimEnd('/');
    validIssuers.Add($"{trimmedUrl}/auth/v1");
    validIssuers.Add(trimmedUrl);
}

var validAudiences = new List<string> { "authenticated" };
if (!string.IsNullOrWhiteSpace(builder.Configuration["Jwt:Audience"]))
    validAudiences.Add(builder.Configuration["Jwt:Audience"]!);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = validIssuers.Count > 0,
            ValidIssuers = validIssuers.Count > 0 ? validIssuers : null,
            ValidateAudience = true,
            ValidAudiences = validAudiences,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = signingKeys
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var db = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var resolver = context.HttpContext.RequestServices.GetRequiredService<ISupabaseUserResolver>();
                await resolver.ResolveAndPopulateClaimsAsync(context.Principal, db);
            }
        };
    });

builder.Services.AddAuthorization();

// ─── CORS ─────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// ─── Controllers & Serialization ──────────────────────────────────────────────
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// ─── Problem Details & Health Checks ───────────────────────────────────────────
builder.Services.AddProblemDetails();
builder.Services.AddHealthChecks();

// ─── Swagger / OpenAPI ────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MediFlow AI API",
        Version = "v1",
        Description = "Intelligent Channeling, E-Prescription & Pharmacy Management System"
    });

    // Add JWT support to Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Enter: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ─── Migrate & Seed Database ──────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        if (db.Database.IsRelational())
        {
            await db.Database.MigrateAsync();
        }
        await DatabaseSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database Warning] Migration/Seeding skipped or failed: {ex.Message}");
    }
}

// ─── Middleware Pipeline ───────────────────────────────────────────────────────
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MediFlow AI v1"));
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => Results.Ok(new
{
    service = "MediFlow Backend API",
    status = "running",
    docs = "/swagger"
})).AllowAnonymous();

app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = (context, report) =>
    {
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsJsonAsync(new
        {
            status = report.Status == Microsoft.Extensions.Diagnostics.HealthChecks.HealthStatus.Healthy ? "healthy" : "unhealthy"
        });
    }
}).AllowAnonymous();

app.MapControllers();
app.MapHub<ConsultationHub>("/hubs/consultation");

app.Run();

static string ParsePostgreSqlConnectionString(string raw)
{
    Npgsql.NpgsqlConnectionStringBuilder builder;
    if (!string.IsNullOrWhiteSpace(raw) && (raw.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || raw.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)))
    {
        try
        {
            var uri = new Uri(raw);
            var userInfo = uri.UserInfo.Split(':');
            builder = new Npgsql.NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port > 0 ? uri.Port : 5432,
                Username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "postgres",
                Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "",
                Database = uri.AbsolutePath.TrimStart('/'),
                SslMode = Npgsql.SslMode.Prefer,
            };
        }
        catch
        {
            builder = new Npgsql.NpgsqlConnectionStringBuilder(raw);
        }
    }
    else
    {
        try
        {
            builder = new Npgsql.NpgsqlConnectionStringBuilder(raw);
        }
        catch
        {
            return raw;
        }
    }

    // Harden against Supabase connection pooler idle socket termination & transient latency
    builder.KeepAlive = 15;
    builder.Timeout = 30;
    builder.CommandTimeout = 60;
    builder.Pooling = true;
    builder.ConnectionLifetime = 300;
    return builder.ConnectionString;
}

static void LoadDotEnv(string filePath)
{
    try
    {
        if (!File.Exists(filePath)) return;
        foreach (var line in File.ReadAllLines(filePath))
        {
            var trimmed = line.Trim();
            if (string.IsNullOrEmpty(trimmed) || trimmed.StartsWith('#')) continue;
            var idx = trimmed.IndexOf('=');
            if (idx <= 0) continue;
            var rawKey = trimmed[..idx].Trim();
            var val = trimmed[(idx + 1)..].Trim().Trim('"', '\'');
            Environment.SetEnvironmentVariable(rawKey, val);
            if (rawKey.Contains("__"))
            {
                Environment.SetEnvironmentVariable(rawKey.Replace("__", ":"), val);
            }
        }
    }
    catch
    {
        // Ignore file read exceptions
    }
}

public partial class Program { }
