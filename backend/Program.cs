using MediFlow.Api.Data;
using MediFlow.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

using MediFlow.Api.Hubs;

var builder = WebApplication.CreateBuilder(args);

// ─── Database ────────────────────────────────────────────────────────────────
var rawConn = builder.Configuration["DATABASE_URL"]
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Port=5432;Database=MedFlow-AI;Username=postgres;Password=postgres";

var connectionString = ParsePostgreSqlConnectionString(rawConn);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        npgsqlOptions => npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)));

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
    client.Timeout = TimeSpan.FromSeconds(15);
    client.DefaultRequestHeaders.Add("Accept", "application/json");
});

builder.Services.AddScoped<IAiServiceClient, AiServiceClient>();
builder.Services.AddScoped<AiServiceClient>();

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
    if (db.Database.IsRelational())
    {
        await db.Database.MigrateAsync();
    }
    await DatabaseSeeder.SeedAsync(db);
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
app.MapHealthChecks("/health");
app.MapControllers();
app.MapHub<ConsultationHub>("/hubs/consultation");

app.Run();

static string ParsePostgreSqlConnectionString(string raw)
{
    if (!string.IsNullOrWhiteSpace(raw) && (raw.StartsWith("postgres://") || raw.StartsWith("postgresql://")))
    {
        try
        {
            var uri = new Uri(raw);
            var userInfo = uri.UserInfo.Split(':');
            var npgsql = new Npgsql.NpgsqlConnectionStringBuilder
            {
                Host = uri.Host,
                Port = uri.Port > 0 ? uri.Port : 5432,
                Username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "postgres",
                Password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "",
                Database = uri.AbsolutePath.TrimStart('/'),
                SslMode = Npgsql.SslMode.Prefer
            };
            return npgsql.ConnectionString;
        }
        catch
        {
            return raw;
        }
    }
    return raw;
}

public partial class Program { }
