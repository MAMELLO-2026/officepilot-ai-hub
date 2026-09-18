# OfficePilot AI — AI Productivity Hub

A modern, AI-powered workplace productivity hub for small business owners. One integrated dashboard — not multiple apps — with four everyday tools that generate **real AI responses** from whatever you paste in.

**Live app**: https://officepilot-ai-hub.lovable.app

---

## ✨ Features

| Tool | What it does |
| --- | --- |
| 🏠 **Dashboard Home** | Overview of all tools with quick access cards and stats |
| 📧 **Email Summarizer** | Paste a long email → summary bullets, action items, and an urgency rating |
| 🗒️ **Meeting Notes Parser** | Paste messy notes → a clean task table with Task, Owner, and Deadline |
| ✍️ **Professional Rewriter** | Paste a casual message + pick a tone (Formal / Friendly / Assertive) → polished professional email |
| 🎯 **Daily Priority Planner** | Paste a to-do list → an Eisenhower matrix (Do / Schedule / Delegate / Eliminate) |

Every tool includes:

- **Real AI generation** — results are written by an AI model based on your exact input, never canned examples
- **"AI is thinking…" loading state** — shown while the model works
- **Copy buttons** — one-click copy of any result
- **Responsible AI notices** — a disclaimer under every AI input, in the footer on every page, and an info (ⓘ) icon on each tool explaining how AI is used responsibly

> *Footer notice shown on every page: "Powered by AI — Always review AI output. Do not share confidential information."*
> *Input disclaimer: "This content is AI generated and should be reviewed before sending. OfficePilot does not store sensitive data and aims to reduce bias."*

---

## 🧠 How the AI works

All four tools call a real AI model through **Lovable's built-in AI integration** — no external AI accounts or API keys to manage:

1. Your text is sent from the page to a secure server function (`src/lib/ai.functions.ts`)
2. The server function calls the Lovable AI Gateway with a tool-specific prompt (for example, the Rewriter sends: *"Rewrite this text in [selected tone] tone. Tones are friendly, professional and assertive. Make each tone clearly different."*)
3. Structured results (bullets, task tables, matrix quadrants) are validated against a schema before being displayed; the Rewriter returns a finished email as text
4. The result renders in the same UI, with copy buttons and AI labels

Nothing you paste is stored by the app — text is used only to generate the result for that request.

---

## 🎨 Design

- Clean **white and blue theme** built with OKLCH color tokens
- **Sidebar navigation** on desktop, horizontal nav on mobile
- **Cards with soft shadows**, rounded corners, and a fully responsive layout
- Built with **Tailwind CSS v4** and shadcn/ui-style components

---

## 🛠️ Tech stack

- **React 19** + **TanStack Start v1** (full-stack React with file-based routing)
- **TanStack Router** for navigation and **TanStack Query** for data flow
- **Lovable AI Gateway** via the Vercel AI SDK for AI generation
- **Tailwind CSS v4** + **shadcn/ui** components
- **Vite 7** build tool, **TypeScript** throughout

---

## 🚀 Getting started

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Then open http://localhost:8080.

AI features work out of the box when run inside Lovable. To run locally outside Lovable, set a `LOVABLE_API_KEY` environment variable with your project's AI gateway key.

---

## 📁 Project structure

```
src/
├── components/            # AppShell (sidebar + footer), ToolPanel, CopyButton, ResponsibleAI
├── lib/
│   ├── ai.functions.ts    # Server functions: real AI calls for all four tools
│   ├── ai-gateway.server.ts # Lovable AI Gateway client helper
│   └── utils.ts           # Shared helpers
├── routes/
│   ├── __root.tsx            # App shell + global meta
│   ├── index.tsx             # Dashboard Home
│   ├── email-summarizer.tsx  # Email Summarizer
│   ├── meeting-notes.tsx     # Meeting Notes Parser
│   ├── rewriter.tsx          # Professional Rewriter
│   └── planner.tsx           # Daily Priority Planner
└── styles.css             # Theme tokens (blue palette, soft shadows)
```

---

## ⚠️ Responsible AI

OfficePilot is built with responsible AI principles:

- AI output is **always labelled** and should be **reviewed before sending**
- Your text is used **only to generate the result** — it is never stored or shared
- Every tool carries a clear disclaimer, and an ⓘ icon explains how AI is used responsibly

---

Built with [Lovable](https://lovable.dev). Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a2f950b-5fa6-45d4-9cd7-e97da9237cb2).
