# Kwickly Deployment Architecture & Context

This document outlines the planned deployment architecture for Kwickly to ensure a cost-effective, scalable, and real-time capable infrastructure.

## Tech Stack Overview
- **Frontend**: React, Vite, Tailwind CSS, Base UI
- **Backend**: Bun, ElysiaJS, Drizzle ORM
- **Database**: PostgreSQL (Neon Serverless)
- **Caching/PubSub**: Redis (Upstash)

## Deployment Strategy

### 1. Frontend Hosting
- **Provider:** Cloudflare Pages (Recommended over Vercel)
- **Why Cloudflare Pages?**
  - Vercel's free tier explicitly prohibits commercial/business projects.
  - Cloudflare Pages allows commercial applications on the free tier.
  - Excellent global CDN performance, free SSL, and unlimited bandwidth.
- **Workflow:** Auto-deploys via GitHub Integration on push to `main`.

### 2. Backend Hosting (Bun + WebSockets)
- **Provider:** Excloud (Virtual Private Servers)
- **Why Excloud?**
  - **WebSocket Support:** Serverless platforms (like Vercel Functions/AWS Lambda) drop WebSocket connections, which breaks Kwickly's real-time KDS and Chat.
  - **Cost-Effective:** A `t1a.small` (2 vCPU, 2 GiB RAM, NVMe, AMD EPYC) costs around ₹340/month, highly optimized for long-running Node/Bun servers.
- **Workflow:**
  - Dockerize the ElysiaJS backend.
  - Run via `docker compose`.
  - Use Nginx or Caddy as a reverse proxy for SSL (Let's Encrypt).
- **Latency Optimization:** The Excloud instance MUST be deployed in the same geographic region as the Neon Database (e.g., AWS `ap-south-1` Mumbai) to keep query latency < 5ms.

### 3. Database & Redis
- **Postgres Database:** Neon
- **Redis (Rate Limiting/Cache/Events):** Upstash
- **Why?** Both offer generous free tiers that scale to zero, keeping initial costs at $0.

### 4. CI/CD (GitHub Actions)
- **Constraint:** GitHub Organizations have a limit of 2,000 free minutes/month for private repos.
- **Optimization Strategy:**
  - **Self-Hosted Runner:** Install a GitHub Actions self-hosted runner on the Excloud backend instance. This bypasses the 2,000-minute limit entirely.
  - **Webhook Triggers:** Alternatively, use a tool like `Watchtower` on the VM to automatically pull the latest Docker image when pushed to the registry, completely bypassing heavy CI pipelines.

### 5. Future AI Integrations (n8n & Ollama)
- AI workloads like local LLMs (Ollama) require significant RAM and compute or GPUs.
- **Plan:** Provision a separate, dedicated GPU instance or `m1a` dedicated class instance on Excloud.
- Ensure the AI server communicates with the Backend server over an internal, private VPC network for security and speed. Do NOT run Ollama on the same VM as the API server to prevent resource exhaustion.
