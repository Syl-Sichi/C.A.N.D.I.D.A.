# C.A.N.D.I.D.A.
**Cognitive Adaptive Neural Digital Intelligence & Decision Assistant**

> Jarvis-class cognitive system — anticipates, acts, remembers, orchestrates.

![Phase](https://img.shields.io/badge/Phase-2%20Scaffold-00f2ff?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Agent%20Core%20%7C%20Zustand-121217?style=flat-square)

## Vision

Not a chatbot dashboard. A continuous cognitive layer with:

- **Agent loop** — Perceive → Reason → Plan → Act → Observe → Remember → Respond
- **Memory tiers** — Working · Episodic · Semantic · Procedural
- **Omni-Link** — Uniform interface for LLM, GitHub, search, browser, voice, IoT
- **Proactive feed** — Suggestions ranked by context, memory, and urgency

Full design: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Current Status

| Layer | Status |
|-------|--------|
| Command Center UI | ✅ Live |
| Neural Chat → `/api/chat` | ✅ Wired (mock provider) |
| Cognitive Memory (tiers + strength) | ✅ Live |
| Task & Routine Engine | ✅ Live |
| Proactive Feed | ✅ Live |
| Voice input UI | ✅ Placeholder (Phase 4 STT) |
| Agent types + provider registry | ✅ Scaffold |
| Real LLM / tools / vector memory | 🔜 Phase 2–3 |

## Tech Stack

- **Frontend:** Next.js 14 App Router, React 18, Tailwind, Framer Motion, Lucide
- **State:** Zustand
- **Agent core:** `lib/agent` (types, mock provider, `runChat`)
- **API:** `POST /api/chat`

## Quick Start

```bash
git clone https://github.com/Syl-Sichi/C.A.N.D.I.D.A..git
cd C.A.N.D.I.D.A.
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Chat hits the agent API. Provider is **mock** until you register OpenAI, Anthropic, or K.O.S.I.

## Project Structure

```
├── app/
│   ├── api/chat/route.ts    # Agent chat endpoint
│   ├── layout.tsx
│   ├── page.tsx             # Command Center
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── NeuralChat.tsx
│   ├── MemoryPanel.tsx
│   ├── TaskEngine.tsx
│   └── ProactiveFeed.tsx
├── lib/
│   ├── store.ts
│   └── agent/
│       ├── types.ts         # OmniLink, tools, LLM, memory contracts
│       ├── index.ts         # Provider registry + runChat
│       └── providers/mock.ts
├── docs/
│   └── ARCHITECTURE.md      # Jarvis north star
└── package.json
```

## Roadmap

1. **Phase 1** ✅ — Cockpit (UI, mock chat, memory, tasks)
2. **Phase 2** 🔄 — Brain (real LLM, working memory, tool-calling skeleton) — *in progress*
3. **Phase 3** — Nervous system (Omni-Links: GitHub, search, …)
4. **Phase 4** — Autonomy (background agents, voice, routines)
5. **Phase 5** — Jarvis (multi-agent, ambient, full tool mesh)

## Design Language

- Background `#0a0a0c` · Panels `#121217` · Accent `#00f2ff`
- High-density, low-noise — built for cognitive flow

---

Built for cognitive augmentation. Not just another chatbot.
