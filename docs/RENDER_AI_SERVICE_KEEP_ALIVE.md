# Render AI Service Health Check & Keep-Alive Workflow

This guide explains the automated health-check workflow implemented for the MediFlow Python FastAPI AI microservice deployed on Render.

---

## 1. Purpose of the Workflow

When deployed on Render's free tier, web services automatically spin down (sleep) after 15 minutes of inactivity. When a subsequent user request arrives (such as running an AI medication safety screening, clinical decision support, or specialist recommendation), the sleeping service must undergo a cold start (typically taking 30–50 seconds), which can cause HTTP timeouts and temporary service unavailability.

The GitHub Actions workflow [keep-ai-alive.yml](file:///.github/workflows/keep-ai-alive.yml) runs a scheduled lightweight health probe against the deployed AI service every 14 minutes, keeping the container warm during active testing cycles and alerting maintainers if the service fails.

---

## 2. Location of the Workflow File

The workflow definition is located at:
```text
.github/workflows/keep-ai-alive.yml
```

---

## 3. Configuring the GitHub Repository Secret

To keep your deployment URL private and configurable across staging/production environments, the workflow reads the base URL from a GitHub Actions secret.

### Steps to Configure:

1. Navigate to your repository on GitHub: `https://github.com/<owner>/<repo>`.
2. Click **Settings** (top navigation bar).
3. In the left sidebar, expand **Secrets and variables** and select **Actions**.
4. Click **New repository secret**.
5. Set the fields:
   - **Name:** `AI_SERVICE_URL`
   - **Secret:** The base URL of your deployed Render AI service **without a trailing slash**, for example:
     ```text
     https://your-service-name.onrender.com
     ```
6. Click **Add secret**.

> [!NOTE]
> Do NOT commit your Render service URL to Git or embed it directly into workflow files. The workflow automatically strips any accidental trailing slash when building the `${BASE_URL}/health` endpoint.

---

## 4. How to Run the Workflow Manually

In addition to the scheduled cron trigger (`*/14 * * * *`), the workflow supports on-demand execution via `workflow_dispatch`:

1. On GitHub, navigate to the **Actions** tab of your repository.
2. In the left sidebar under *Workflows*, select **AI Service Health Check (Keep-Alive)**.
3. Click the **Run workflow** dropdown on the right.
4. Select the target branch (`main` or your current branch) and click **Run workflow**.

---

## 5. How to Inspect Execution Logs

1. Go to **Actions** > **AI Service Health Check (Keep-Alive)**.
2. Click on the latest workflow run.
3. Click on the **Ping AI Service Health** job.
4. Expand the **Send Health Probe** step.
5. You will see the timestamp and execution output:
   ```text
   Pinging AI microservice health endpoint...
   Health check succeeded: {"status":"healthy"}
   ```
   If `AI_SERVICE_URL` is missing or the endpoint returns a non-200 HTTP code, the step will fail with a clear diagnostic message.

---

## 6. How to Verify the `/health` Endpoint

The health endpoint is defined in [ai/main.py](file:///ai/main.py):
```python
@app.get("/health", tags=["Health"])
async def health_check():
    """Returns service health status."""
    return {"status": "healthy"}
```

This endpoint is intentionally lightweight:
- It returns HTTP `200 OK` with JSON `{"status": "healthy"}`.
- It does **not** load Gemini LLM models, vector embeddings, or execute database queries.
- It executes in sub-millisecond time and consumes negligible RAM/CPU.

You can verify it manually from your terminal:
```bash
# Using your deployed Render URL:
curl -i https://your-service-name.onrender.com/health

# Or locally:
curl -i http://localhost:8000/health
```

Expected output:
```http
HTTP/1.1 200 OK
content-type: application/json

{"status":"healthy"}
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
