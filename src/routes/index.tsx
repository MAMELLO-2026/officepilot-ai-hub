import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, ListChecks, Mail, PenLine, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | OfficePilot AI — AI Productivity Hub" },
      {
        name: "description",
        content:
          "Your AI productivity dashboard: email summaries, meeting task lists, professional rewrites and prioritized daily plans in one place.",
      },
      { property: "og:title", content: "OfficePilot AI Dashboard" },
      {
        property: "og:description",
        content: "Four AI tools for small business owners in one integrated hub.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email-summarizer",
    icon: Mail,
    title: "Email Summarizer",
    text: "Paste a long thread and get bullets, action items and an urgency read.",
  },
  {
    to: "/meeting-notes",
    icon: ListChecks,
    title: "Meeting Notes Parser",
    text: "Turn messy notes into a clean task, owner and deadline table.",
  },
  {
    to: "/rewriter",
    icon: PenLine,
    title: "Professional Rewriter",
    text: "Rewrite a casual message as a polished email in the tone you pick.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "Daily Priority Planner",
    text: "Sort your to-do list into an Eisenhower matrix you can act on.",
  },
] as const;

const stats = [
  { label: "Tools in your hub", value: "4" },
  { label: "Avg. minutes saved daily", value: "45" },
  { label: "Setup required", value: "None" },
];

function Dashboard() {
  return (
    <AppShell
      title="Good day — here's your workspace"
      description="Pick a tool below. Everything runs in one hub, so your inputs and results stay together."
    >
      <div className="space-y-8">
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
          <CardContent className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
                <Sparkles className="size-3.5" /> OfficePilot AI
              </span>
              <h2 className="text-2xl font-semibold tracking-tight">
                Less admin. More time on the business.
              </h2>
              <p className="text-sm opacity-90">
                Draft faster, capture every commitment from a meeting, and start each day knowing
                exactly what matters most.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {stats.map((s) => (
                <div key={s.label} className="min-w-20">
                  <p className="text-2xl font-semibold">{s.value}</p>
                  <p className="mt-1 text-xs opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to} className="group">
              <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 shadow-[var(--shadow-soft)]">
                <CardHeader className="flex flex-row items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <tool.icon className="size-5" />
                  </span>
                  <CardTitle className="text-base">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{tool.text}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    Open tool <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">How to get the most out of it</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
            <p>Paste raw text — no formatting needed. Each tool handles the mess for you.</p>
            <p>Use the copy button to drop results straight into your email or task tool.</p>
            <p>Always read the output before sending it to a client or team member.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
