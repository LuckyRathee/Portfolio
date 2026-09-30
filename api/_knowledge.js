// Everything the "Ask my AI" assistant knows about Lucky. Update this when your resume or projects change.
export default `# Lucky Rathee — portfolio knowledge base

## Profile
- Name: Lucky Rathee
- Role: AI Engineer (AI & Automation Engineer)
- Location: Bahadurgarh, Haryana, India. Works remotely.
- Email: lucky.dev2311@gmail.com
- Phone: +91 7988452163
- GitHub: https://github.com/LuckyRathee
- LinkedIn: https://www.linkedin.com/in/lucky-rathee
- Availability: open to full-time AI engineering roles AND freelance projects.
- Summary: AI & Automation Engineer specializing in agentic AI workflows, RAG architectures and resilient data pipelines. Experienced in orchestrating multi-agent LLM systems, headless browser automation and high-throughput B2B operations.

## Education
- Chandigarh University — B.E. Computer Science, July 2026.

## Experience
### AI Engineering Intern & Contributor — NimitAI (Remote), August 2026 – Present
- Conducted an 80-file Supabase backend audit and QA testing across a 147-case test workbook to verify data integrity and platform reliability.
- Automated GTM lead-generation pipelines by deploying an agentic AI system, cutting manual prospecting effort and standardizing lead qualification.
- Standardized engineering workflows by generating structured GitHub issues for bug triage, feature tracking and technical-debt resolution.

### Freelance AI Engineer & Automation Architect — Independent Contractor (Remote), May 2026 – Present
- Engineered an automated lead dispatch system with Google Sheets and Apps Script, orchestrating quota distribution and real-time manager synchronization.
- Architected self-hosted n8n automation pipelines on Google Cloud Run and AWS EC2 via Docker Compose, with a Caddy reverse proxy for custom domain routing.
- Designed and deployed a Telegram-based freelancer-ops voice assistant using n8n for task management, communication and admin work.

## Projects
### Autonomous B2B Prospecting & Agentic Web Engine (Sep 2026)
Stack: Python, Playwright, Hermes Agent, LLM orchestration, TDD, Vercel MCP, Tailscale, React, Vite, Tailwind, GitHub Actions.
- AI outreach engine built on Hermes Agent with a 27-skill design system: scrapes and qualifies leads, then generates demo websites from real business data.
- Pipeline of 25 modules: Google Maps scraping, contact enrichment, deduplication, qualification, AI demo direction and generation, automated demo QA, deployment, then email and WhatsApp outreach behind an approval step, plus CRM state tracking and follow-up scheduling.
- Deployment validation via Vercel MCP and outreach-readiness reporting with audit trails.
- 15+ REST API endpoints, CORS-configured HTTPS endpoints via Tailscale Funnel, supports 4 concurrent users.
- 13 test suites, 14 design documents, GitHub Actions CI, a React + Vite dashboard and a mobile companion app.
- Internal system: no public repo; walkthrough available on request.

### ULTRON v1 — Agentic OS & Desktop Automation (Jul 2026)
Stack: Python, MCP, multi-agent systems, speech-to-text.
- Voice-operated, plugin-based agentic framework with hierarchical multi-agent delegation that dynamically spawns sub-agents for multi-step tasks.
- Integrated Model Context Protocol (MCP) clients and plugin modules for runtime tool discovery, context ingestion and dynamic skill execution across frontier LLMs.
- Local desktop actuation pipelines for deterministic OS-level automation, process control and system tasks via low-latency speech parsing.
- Private repository; demo available on request.

### Mehfil — Ambient Cultural Audio-Visual Platform (2026) — team project
Live: https://mehfil-app-ten.vercel.app/
Stack: React, Vite, Supabase Realtime, Spotify Web Playback SDK, Framer Motion, AWS, Vercel.
- Synchronized streaming radio with six themed stations (Chai Sutta, Weedy Valley, Theth Desi, Bus Driver, Saloon, Old Night Drives): everyone tuned in hears the same track at the same second.
- Supabase Realtime for live cross-client synchronization of shared audio-visual state.
- Team of three: Harshit Saharan (database, backend infra & AWS), Pankaj (music SDK integration & audio performance), and Lucky (AI orchestration and LLM-assisted architecture).

### Self-Hosted n8n Automation Infrastructure (2026)
Stack: n8n, Docker Compose, Google Cloud Run, AWS EC2, Caddy.
- Self-hosted n8n for freelance clients with automatic HTTPS and custom domains via Caddy.
- Runs on an on-demand EC2 instance started only when workflows need to run, keeping hosting costs near zero when idle.

### Telegram Voice Ops Assistant (2026)
Stack: n8n, Telegram Bot API, LLMs, speech-to-text.
- Telegram voice assistant for freelancer operations: task management, communication and admin via voice commands.

## Research
### "Architectural Design of 6G-Based Ultra-Low-Latency Communication for Remote Medical Services" — accepted at STAI 2026
- Proposes a multi-layer 6G architecture for mission-critical remote healthcare (telemedicine, patient monitoring, robot-assisted remote surgery) combining terahertz communication, intelligent reflecting surfaces, distributed edge computing, distributed AI, reinforcement-learning network orchestration, network slicing, lightweight cryptography, edge intrusion detection and blockchain logging.
- Simulation results: 0.38 ms average end-to-end latency (vs 1.20 ms for 5G-URLLC and 2.60 ms for conventional edge); under 0.5 ms for critical services; packet delivery above 99.999%; 99.9997% reliability with 1,000 devices; 18.4 Gbps throughput (+42% vs mmWave 5G); 31% less packet loss; 27% better spectrum efficiency; 54% less cloud offloading; 29% lower energy use; 0.21 ms edge AI inference; 3.6% security overhead.
- Limitations noted by the paper: results are from simulation; real-world terahertz/IRS deployment, mobility handovers and the security-vs-latency trade-off remain open.

## Skills
- AI & LLM systems: agentic AI, AI orchestration, MCP, RAG, LangChain, Hermes, Claude, Gemini, Groq, pgvector
- Automation & scraping: Playwright, Chromium, n8n, Make.com, Apify, web scraping
- Languages: Python, TypeScript, JavaScript, SQL, C++
- Backend & web: FastAPI, Node.js, Next.js, React, Supabase, Tailwind, MongoDB
- Cloud & DevOps: Docker, Docker Compose, AWS EC2, Google Cloud Run, Caddy, APIs
- Domain focus: agentic AI systems, desktop OS automation, RAG & vector retrieval, deterministic data pipelines, reliable web scraping, fast API integration
`;
