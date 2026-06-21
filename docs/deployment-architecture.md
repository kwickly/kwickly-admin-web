# Kwickly Production Deployment Architecture

> This document serves as the master blueprint for Kwickly's deployment architecture, ensuring a cost-effective, scalable, and real-time capable infrastructure. It combines our initial MVP strategy with a long-term roadmap for enterprise scale.

---

## Overall Assessment & Tech Stack

| Layer            | Technology                        |
| ---------------- | --------------------------------- |
| Frontend         | React + Vite + Tailwind + Base UI |
| Backend          | Bun + ElysiaJS                    |
| ORM              | Drizzle ORM                       |
| Database         | Neon Serverless PostgreSQL        |
| Cache / PubSub   | Upstash Redis                     |
| Frontend Hosting | Cloudflare Pages                  |
| Backend Hosting  | Excloud VPS                       |
| Reverse Proxy    | Caddy                             |
| Containerization | Docker Compose                    |

---

## 1. Frontend Hosting: Cloudflare Pages
- **Why?** Vercel's free tier explicitly prohibits commercial/business projects. Cloudflare Pages allows commercial applications on the free tier.
- **Benefits:** Excellent global CDN performance, free SSL, and unlimited bandwidth.
- **Workflow:** Auto-deploys via GitHub Integration on push to `main`.

## 2. Backend Hosting: Excloud VPS
- **Why?** Serverless platforms drop WebSocket connections. Excloud provides highly performant AMD EPYC servers with NVMe storage. A `t1a.small` costs ~₹340/month, perfectly optimized for long-running Node/Bun servers.
- **Reverse Proxy:** Use **Caddy** instead of Nginx. It provides automatic HTTPS/SSL renewal, HTTP/3, and excellent WebSocket support with very little configuration.
- **Latency Optimization:** The Excloud instance MUST be deployed in the same geographic region as the Neon Database (e.g., AWS `ap-south-1` Mumbai) to keep query latency < 5ms.

## 3. Containerization Strategy
- **Phase 1 (MVP): Docker Compose.** Simple, stable, and easy to debug. Perfect for a single Excloud instance and < 30 restaurants.
- **Phase 2 (Scale): Docker Swarm.** When horizontal scaling is needed (multiple VMs behind a load balancer), use Swarm for rolling deployments and service discovery. Avoid Kubernetes unless absolutely necessary.

## 4. Background Workers & Message Queues
- The API server should **only** process HTTP/WebSocket requests.
- Move heavy processing (Invoices, Emails, Push Notifications, Analytics, Loyalty) into Background Workers (also written in Bun).
- Use **Upstash Redis Streams/Queues** for an event-driven architecture.

## 5. Object Storage: Cloudflare R2
- Never store uploaded files (Logos, menus, food photos, PDFs) inside the VPS.
- Use **Cloudflare R2**. S3-compatible, no egress fees, cheap storage, and excellent CDN integration.

## 6. Environment Separation
- Create completely isolated environments (Development -> Staging -> Production).
- Never share production databases, Redis instances, or environment variables.

## 7. AI Infrastructure
- Never run AI workloads on the API server. AI consumes large amounts of RAM and spikes CPU usage, causing API latency.
- **Architecture:** Provision a separate, dedicated GPU instance or `m1a` dedicated class instance on Excloud.
- Ensure the AI server (Ollama, Whisper, Vector DB) communicates with the Backend server over an internal, private VPC network for security and speed.

## 8. Multi-Tenant Design
- Design every service with tenant isolation from day one. Every table must include `tenantId`.
- Every request should resolve: Authenticated User -> Tenant -> Scoped Database Access.

## 9. CI/CD Strategy & Limitations
- **Constraint:** GitHub Organizations have a limit of 2,000 free minutes/month for private repos.
- **Optimization Strategy:**
  - Install a **Self-Hosted Runner** directly on your Excloud backend instance. Jobs run on self-hosted runners do not consume any of your 2,000 free GitHub minutes!
  - **Database Migration Pipeline:** Ensure migrations (`drizzle-kit generate` -> `drizzle-kit migrate`) happen safely during this CI/CD process.

## 10. Future Scaling Roadmap

### Phase 1 (0–20 Restaurants)
* Docker Compose
* Single Excloud VPS
* Neon (DB) + Upstash (Redis)
* Cloudflare Pages

### Phase 2 (20–100 Restaurants)
* Dedicated Worker Server
* Cloudflare R2 Object Storage
* Monitoring (Sentry for Errors, Prometheus/Grafana for Metrics)
* Centralized Logging

### Phase 3 (100–500 Restaurants)
* Multiple API Servers via Docker Swarm
* Load Balancer
* Dedicated Notification Server

### Phase 4 (500+ Restaurants)
* Dedicated Excloud AI Server
* Read Replicas
* Auto Scaling
