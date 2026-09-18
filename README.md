# OfficePilot AI — AI Productivity Hub

A modern, AI-powered workplace productivity hub for small business owners. One integrated dashboard — not multiple apps — with four everyday tools powered by smart, deterministic mock AI responses.

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

- **Load example** buttons — see results instantly without typing
- **Loading states** — realistic simulated AI processing
- **Copy buttons** — one-click copy of any result
- **Responsible AI notices** — a disclaimer under every AI input, in the footer on every page, and an info (ⓘ) icon on each tool explaining how AI is used responsibly

> *Footer notice shown on every page: "Powered by AI — Always review AI output. Do not share confidential information."*
> *Input disclaimer: "This content is AI generated and should be reviewed before sending. OfficePilot does not store sensitive data and aims to reduce bias."*

---

## 🎨 Design

- Clean **white and blue theme** built with OKLCH color tokens
- **Sidebar navigation** on desktop, horizontal nav on mobile
- **Cards with soft shadows**, rounded corners, and a fully responsive layout
- Built with **Tailwind CSS v4** and shadcn/ui-style components

---

## 🧠 How the AI works

This app runs in **mock AI mode** — no external API calls, no data leaves your browser. Responses are generated locally with deterministic heuristics (keyword scoring, date parsing, tone templates), so the same input always produces the same output. It's perfect for demos, prototypes, and testing UX flows.

To connect a real AI provider later, swap the functions in `src/lib/mock-ai.ts` for live API calls — every route already handles loading and error states.

---

## 🛠️ Tech stack

- **React 19** + **TanStack Start v1** (full-stack React with file-based routing)
- **TanStack Router** for navigation
- **Tailwind CSS v4** + **shadcn/ui** components
- **Vite 7** build tool
- **TypeScript** throughout

---

## 🚀 Getting started

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

Then open http://localhost:8080.

---

## 📁 Project structure

```
src/
├── components/       # AppShell (sidebar + footer), ToolPanel, CopyButton, ResponsibleAI
├── lib/
│   ├── mock-ai.ts    # Local mock AI engine (summarize, parse, rewrite, prioritize)
│   └── utils.ts      # Shared helpers
├── routes/
│   ├── __root.tsx            # App shell + global meta
│   ├── index.tsx             # Dashboard Home
│   ├── email-summarizer.tsx  # Email Summarizer
│   ├── meeting-notes.tsx     # Meeting Notes Parser
│   ├── rewriter.tsx          # Professional Rewriter
│   └── planner.tsx           # Daily Priority Planner
└── styles.css        # Theme tokens (blue palette, soft shadows)
```

---

## ⚠️ Responsible AI

OfficePilot is built with responsible AI principles:

- AI output is **always labelled** and should be **reviewed before sending**
- **No sensitive data is stored** — nothing you paste leaves your browser
- The toolset is designed to **reduce bias** with transparent, rule-based logic

---

Built with [Lovable](https://lovable.dev). Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a2f950b-5fa6-45d4-9cd7-e97da9237cb2).
