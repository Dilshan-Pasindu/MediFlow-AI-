# ─── Build Stage ─────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies (layer caching)
COPY ["backend/MediFlow.Api.csproj", "backend/"]
RUN dotnet restore "backend/MediFlow.Api.csproj"

# Copy all source files and publish
COPY backend/ backend/
WORKDIR "/src/backend"
RUN dotnet publish "MediFlow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false --no-restore

# ─── Runtime Stage ───────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

# Run as non-root user for container security
USER $APP_UID

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000

ENTRYPOINT ["dotnet", "MediFlow.Api.dll"]
