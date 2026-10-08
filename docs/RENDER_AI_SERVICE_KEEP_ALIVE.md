# Render Services Health Check & Keep-Alive Workflow

This guide explains the automated health-check workflow implemented for the MediFlow Python FastAPI AI microservice and ASP.NET Core backend API deployed on Render free-tier containers.

---

## 1. Purpose of the Workflow

When deployed on Render's free tier, web services automatically spin down (sleep) after 15 minutes of inactivity. When a subsequent user request arrives (such as running an AI medication safety screening, clinical decision support, specialist recommendation, or authenticating against the backend API), the sleeping service must undergo a cold start (typically taking 30–50 seconds), which can cause HTTP timeouts and temporary service unavailability.

The GitHub Actions workflow [keep-ai-alive.yml](file:///.github/workflows/keep-ai-alive.yml) runs a scheduled lightweight health probe against both the deployed AI microservice and the backend API every 14 minutes, keeping both containers warm during active testing cycles and alerting maintainers if either service fails.

---

## 2. Location of the Workflow File

The workflow definition is located at:
```text
.github/workflows/keep-ai-alive.yml
```

---

## 3. Configuring GitHub Repository Secrets

To keep your deployment URLs customizable across staging/production environments, the workflow resolves URLs in the following priority order:
1. **Manual Input** via `workflow_dispatch` (if triggered manually).
2. **GitHub Secrets** (`secrets.AI_SERVICE_URL`, `secrets.BACKEND_URL`).
3. **Repository Variables** (`vars.AI_SERVICE_URL`, `vars.BACKEND_URL`).
4. **Default Deployed URLs** (`https://mediflow-ai-1-q0d9.onrender.com`, `https://mediflow-ai-2.onrender.com`).

### Optional Secrets / Variables:

| Name | Description | Example Value |
| :--- | :--- | :--- |
| `AI_SERVICE_URL` | Base URL of deployed Render AI FastAPI service | `https://mediflow-ai-1-q0d9.onrender.com` |
| `BACKEND_URL` | Base URL of deployed Render ASP.NET Core API | `https://mediflow-ai-2.onrender.com` |

### Steps to Configure (Optional):

1. Navigate to your repository on GitHub: `https://github.com/<owner>/<repo>`.
2. Click **Settings** (top navigation bar).
3. In the left sidebar, expand **Secrets and variables** and select **Actions**.
4. You can configure either **Repository secrets** or **Repository variables**.
5. Add `AI_SERVICE_URL` and `BACKEND_URL` (without trailing slash).

> [!NOTE]
> If neither secret nor variable is configured, the workflow uses the project's deployed Render instances automatically. If an endpoint is waking up from cold sleep, the probe delivers the wake-up request with a 60-second timeout and completes without failing the job.

---

## 4. How to Run the Workflow Manually

In addition to the scheduled cron trigger (`*/14 * * * *`), the workflow supports on-demand execution via `workflow_dispatch`:

1. On GitHub, navigate to the **Actions** tab of your repository.
2. In the left sidebar under *Workflows*, select **Render Services Keep-Alive**.
3. Click the **Run workflow** dropdown on the right.
4. Optionally enter custom URLs to test, select the target branch, and click **Run workflow**.

---

## 5. How to Inspect Execution Logs

1. Go to **Actions** > **Render Services Keep-Alive**.
2. Click on the latest workflow run.
3. Click on the **Ping Free-Tier Services** job.
4. Expand the **Send Health Probes** step.
5. You will see the timestamp and execution output:
   ```text
   ==========================================
   Render Free-Tier Keep-Alive Health Probe
   ==========================================
   Pinging AI Microservice at https://mediflow-ai-1-q0d9.onrender.com/health...
   ✅ AI Microservice is warm and healthy (HTTP 200).
   Pinging Backend API at https://mediflow-ai-2.onrender.com/health...
   ✅ Backend API is warm and healthy (HTTP 200).
   Keep-alive routine completed successfully.
   ```

---

## 6. How to Verify the `/health` Endpoints

Both microservices expose sub-millisecond, zero-side-effect health probes:

### 1. AI Service Health Probe (`ai/main.py`)
```python
@app.get("/health", tags=["Health"])
async def health_check():
    """Returns service health status."""
    return {"status": "healthy"}
```

```bash
curl -i https://mediflow-ai.onrender.com/health
# Response: HTTP 200 OK {"status":"healthy"}
```

### 2. Backend API Health Probe (`backend/Program.cs`)
```csharp
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync("{\"status\":\"" + report.Status.ToString() + "\"}");
    }
});
```

```bash
curl -i https://mediflow-api.onrender.com/health
# Response: HTTP 200 OK {"status":"Healthy"}
```

---

## 7. Render Free-Tier Limitations & Expectations

> [!IMPORTANT]
> **Best-Effort Mitigation — Not a 24/7 SLA Guarantee:**
> - Render free instances automatically suspend after 15 minutes of zero inbound HTTP traffic.
> - GitHub Actions scheduled cron jobs are queued on shared runners. During high GitHub platform load, scheduled runs may experience delays of several minutes.
> - If an execution is delayed beyond 15 minutes and the instance has already spun down, the health check itself will trigger the cold start.
> - The workflow uses a 30-second curl timeout (`--max-time 30`). In extreme cold-start situations, the probe may register a timeout failure while initiating instance wake-up.
> - The workflow does **not** employ aggressive retry loops to avoid wasting GitHub Actions runner quota.

---

## 8. Upgrading to a Paid Render Instance

If your project transitions into production or requires strict 24/7 uptime without cold starts:
1. In the **Render Dashboard**, select your MediFlow AI Web Service.
2. Go to the **Settings** tab.
3. Upgrade the **Instance Type** from **Free** to **Starter** ($7/mo) or higher.
4. Paid instances do not spin down due to inactivity, completely eliminating container sleep and cold starts.
