# C.A.N.D.I.D.A.
**Cognitive Adaptive Neural Digital Intelligence & Decision Assistant**

C.A.N.D.I.D.A. is a futuristic, modular AI dashboard designed to act as a central hub for cognitive augmentation, decision support, and digital automation.

![Phase](https://img.shields.io/badge/Phase-1%20Core%20Interface-00f2ff?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Tailwind%20%7C%20Zustand-121217?style=flat-square)

## 🚀 MVP Features (Phase 1 — Live)

- **Command Center Layout** — High-density dark UI with header, sidebar, primary panel, and dual right-rail.
- **Neural Chat Interface** — Adaptive conversation hub with typing indicators and mock context-aware replies.
- **Cognitive Memory Panel** — Visualization of stored knowledge, projects, insights, and routines.
- **Task & Routine Engine** — Interactive task list with status cycling, priority badges, and progress bar.
- **Context-Aware Workspace** — Placeholder ready for Phase 2 project intelligence surfaces.
- **Live System Status** — Clock, neural activity, integrity, and latency indicators.

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Tailwind CSS, custom candida theme |
| Motion | Framer Motion |
| Icons | Lucide React |
| State | Zustand |
| Deployment | Vercel (target) |

## 🗺 Architecture & Roadmap

### Phase 1: Core Interface ✅
- [x] Project scaffolding and theme
- [x] Command Center layout (Header + Sidebar + multi-panel)
- [x] Neural Chat with mock adaptive responses
- [x] Cognitive Memory panel
- [x] Task & Routine Engine
- [x] System status bar & live clock

### Phase 2: Intelligence Integration
- [ ] Connection to LLM providers (OpenAI / Anthropic / local)
- [ ] Local / vector memory storage
- [ ] Basic tool-calling framework
- [ ] Persistent chat history

### Phase 3: The "Omni-Link" System
- [ ] **Web Search** — Real-time information retrieval
- [ ] **GitHub Integration** — Codebase awareness and automation
- [ ] **Browser Control** — Autonomous web interaction
- [ ] **Smart-Home / IoT** — Device control via API

## 📁 Project Structure

```
C.A.N.D.I.D.A./
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx          # Command Center
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── NeuralChat.tsx
│   ├── MemoryPanel.tsx
│   └── TaskEngine.tsx
├── lib/
│   └── store.ts          # Zustand state
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🛠 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Syl-Sichi/C.A.N.D.I.D.A..git
   cd C.A.N.D.I.D.A.
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Language

- **Background**: `#0a0a0c`
- **Panels**: `#121217`
- **Accent**: `#00f2ff` (cyan neural glow)
- **Borders**: `#27272a`
- High-density, low-noise interface optimized for focus and cognitive flow.

---

Built for cognitive augmentation — not just another chatbot.
