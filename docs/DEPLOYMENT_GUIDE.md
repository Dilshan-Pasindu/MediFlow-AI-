# 🚀 MediFlow AI — Production Deployment & Clustering Guide

This guide describes how to deploy, configure, cluster, and monitor the **MediFlow AI** enterprise healthcare platform in development, staging, and production environments.

---

## 🏗️ System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │           Internet / Clients                 │
                  │   (Web Browser / Mobile Flutter App)         │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼ HTTPS / WSS (:443)
                  ┌──────────────────────────────────────────────┐
                  │             Nginx Reverse Proxy              │
                  │        SSL Termination & Rate Limiting       │
                  └───────┬──────────────┬──────────────┬────────┘
                          │              │              │
             /api, /ws    │       /ai    │              │  / (Static UI)
                          ▼              ▼              ▼
     ┌────────────────────────┐  ┌─────────────┐  ┌──────────────────┐
     │  ASP.NET Core 8 API    │  │ FastAPI AI  │  │  Vite Web Client │
     │  (Port 5224 / 5000)    │  │ (Port 8000) │  │  (Nginx SPA)     │
     └───────────┬────────────┘  └──────┬──────┘  └──────────────────┘
                 │                      │
                 ▼                      ▼
     ┌────────────────────────┐  ┌─────────────┐
     │   PostgreSQL 16 DB     │  │ Google      │
     │   (Port 5432)          │  │ Gemini API  │
     └────────────────────────┘  └─────────────┘
```

---

## 📋 Prerequisites

| Component | Minimum Version | Recommended |
| :--- | :--- | :--- |
| **Docker Engine** | `24.0+` | `26.0+` |
| **Docker Compose** | `v2.20+` | `v2.27+` |
| **Operating System** | Ubuntu 22.04 LTS / Debian 12 | Linux x86_64 / arm64 |
| **CPU / RAM** | 2 vCPU / 4 GB RAM | 4 vCPU / 8 GB RAM |
| **Disk Space** | 20 GB SSD | 50 GB NVMe |

---

## 🛠️ Step 1: Environment Configuration

Create a production `.env` file in the repository root:

```bash
# ==========================================
# MediFlow Production Environment Settings
# ==========================================

# Database
POSTGRES_DB=mediflow_db
POSTGRES_USER=mediflow_admin
POSTGRES_PASSWORD=UseSuperSecureGeneratedPassword123!
DATABASE_URL=Host=db;Port=5432;Database=mediflow_db;Username=mediflow_admin;Password=UseSuperSecureGeneratedPassword123!

# JWT Security
JWT_SECRET=ReplaceWithAtLeast32CharactersCryptographicKey12345!
JWT_ISSUER=MediFlowApi
JWT_AUDIENCE=MediFlowClients
JWT_EXPIRY_MINUTES=1440

# AI Microservice Engine
GEMINI_API_KEY=AIzaSyYourActualProductionGeminiApiKeyHere
AI_SERVICE_URL=http://ai:8000

# Client Configuration
VITE_API_URL=https://api.mediflow.ai
VITE_AI_URL=https://api.mediflow.ai/ai
```

---

## 🐳 Step 2: Multi-Stage Containerization

### 1. ASP.NET Core Backend Dockerfile (`backend/Dockerfile`)
The backend utilizes .NET 8 multi-stage build optimization:
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["MediFlow.Api.csproj", "./"]
RUN dotnet restore "MediFlow.Api.csproj"
COPY . .
RUN dotnet publish "MediFlow.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5000
ENTRYPOINT ["dotnet", "MediFlow.Api.dll"]
```

### 2. Frontend React Dockerfile (`frontend/Dockerfile`)
Built with Node 20 LTS and served via lightweight alpine Nginx:
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🚢 Step 3: Deployment Execution

Execute automated container provisioning with Docker Compose:

```bash
# 1. Pull base images and build all microservices
docker compose build

# 2. Start all services in detached mode
docker compose up -d

# 3. Verify container health status
docker compose ps
```

### Expected Running Containers
```text
NAME                     IMAGE                 STATUS                   PORTS
mediflow-backend-1       mediflow-backend      Up (healthy) 2 minutes   0.0.0.0:5224->5000/tcp
mediflow-frontend-1      mediflow-frontend     Up 2 minutes             0.0.0.0:80->80/tcp
mediflow-ai-1            mediflow-ai           Up (healthy) 2 minutes   0.0.0.0:8000->8000/tcp
mediflow-db-1            postgres:16-alpine    Up 2 minutes             0.0.0.0:5432->5432/tcp
```

---

## 🛡️ Step 4: Reverse Proxy & SSL Configuration (Nginx)

Place the following configuration in `/etc/nginx/sites-available/mediflow.conf`:

```nginx
server {
    listen 80;
    server_name api.mediflow.ai app.mediflow.ai;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mediflow.ai app.mediflow.ai;

    ssl_certificate /etc/letsencrypt/live/mediflow.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mediflow.ai/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend Single Page Application
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Backend ASP.NET Core API
    location /api/ {
        proxy_pass http://127.0.0.1:5224/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SignalR WebSockets (Live Consultation Queue)
    location /consultationHub {
        proxy_pass http://127.0.0.1:5224/consultationHub;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # AI Microservice Engine
    location /ai/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🩺 Step 5: Health Check Probes & Monitoring

The cluster exposes deterministic health endpoints for load balancer validation:

| Component | Endpoint | Expected Status |
| :--- | :--- | :--- |
| **Backend API** | `GET /api/doctors` | `200 OK` |
| **AI Microservice** | `GET /health` | `200 OK` (`{"status": "healthy"}`) |
| **Frontend Web** | `GET /index.html` | `200 OK` |
| **Postgres Database** | `pg_isready -U mediflow_admin` | `Accepting connections` |

---

## 💾 Step 6: Backup & Disaster Recovery

### Automated PostgreSQL Backup Script (`scripts/backup_db.sh`)
```bash
#!/usr/bin/env bash
set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/mediflow"
mkdir -p "$BACKUP_DIR"

docker exec -t mediflow-db-1 pg_dump -U mediflow_admin -d mediflow_db | gzip > "$BACKUP_DIR/mediflow_${TIMESTAMP}.sql.gz"

# Retain last 14 days of backups
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -exec rm {} \;

echo "Backup completed: $BACKUP_DIR/mediflow_${TIMESTAMP}.sql.gz"
```

### Database Restore Procedure
```bash
gunzip < /var/backups/mediflow/mediflow_20261015.sql.gz | docker exec -i mediflow-db-1 psql -U mediflow_admin -d mediflow_db
```
