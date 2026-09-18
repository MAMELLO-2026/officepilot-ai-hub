import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState, InputCard, LoadingLines, ResultCard } from "@/components/ToolPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { planPrioritiesAi, type PlannedTask, type Quadrant } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Daily Priority Planner | OfficePilot AI" },
      {
        name: "description",
        content:
          "Paste your to-do list and get it sorted into an Eisenhower matrix: do now, schedule, delegate or drop.",
      },
      { property: "og:title", content: "AI Daily Priority Planner | OfficePilot AI" },
      {
        property: "og:description",
        content: "Your to-do list, sorted into an Eisenhower priority matrix.",
      },
    ],
  }),
  component: PlannerPage,
});

const SAMPLE = `call the client back about the urgent contract change
review the new supplier proposal
order more printer paper
schedule the team one-on-ones
file last month's invoices
reorganize the shared drive someday
prepare the payroll run for today
read industry newsletters`;

const quadrants: {
  key: Quadrant;
  title: string;
  subtitle: string;
  card: string;
  chip: string;
}[] = [
  {
    key: "do",
    title: "Do now",
    subtitle: "Urgent & important",
    card: "border-primary/30 bg-primary/5",
    chip: "bg-primary text-primary-foreground",
  },
  {
    key: "schedule",
    title: "Schedule",
    subtitle: "Important, not urgent",
    card: "border-accent bg-accent/40",
    chip: "bg-accent-foreground/90 text-primary-foreground",
  },
  {
    key: "delegate",
    title: "Delegate",
    subtitle: "Urgent, not important",
    card: "border-border bg-secondary/60",
    chip: "bg-secondary-foreground text-primary-foreground",
  },
  {
    key: "eliminate",
    title: "Eliminate",
    subtitle: "Neither urgent nor important",
    card: "border-dashed border-border bg-background",
    chip: "bg-muted-foreground text-primary-foreground",
  },
];

function PlannerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlannedTask[] | null>(null);

  const plannerFn = useServerFn(planPrioritiesAi);

  const run = async () => {
    setLoading(true);
    setPlan(null);
    try {
      setPlan(await plannerFn({ data: { text: input } }));
    } catch {
      toast.error("The AI could not sort that list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const asText = plan
    ? quadrants
        .map((q) => {
          const items = plan.filter((t) => t.quadrant === q.key);
          return [
            `${q.title.toUpperCase()} (${q.subtitle})`,
            ...(items.length ? items.map((t) => `- ${t.title}`) : ["- nothing here"]),
          ].join("\n");
        })
        .join("\n\n")
    : "";

  return (
    <AppShell
      title="Daily Priority Planner"
      description="List everything on your plate. It comes back sorted into an Eisenhower matrix so you know where to start."
    >
      <div className="space-y-6">
        <InputCard
          label="Your to-do list"
          placeholder="One task per line…"
          value={input}
          onChange={setInput}
          onRun={run}
          onSample={() => setInput(SAMPLE)}
          loading={loading}
          runLabel="Prioritize my day"
        />

        <ResultCard
          title="Eisenhower matrix"
          action={plan?.length ? <CopyButton value={asText} label="Copy plan" /> : undefined}
        >
          {loading ? (
            <LoadingLines rows={6} />
          ) : !plan ? (
            <EmptyState text="Your prioritized matrix will appear here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {quadrants.map((q) => {
                const items = plan.filter((t) => t.quadrant === q.key);
                return (
                  <Card key={q.key} className={`border ${q.card} shadow-none`}>
                    <CardHeader className="gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-sm font-semibold">{q.title}</CardTitle>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${q.chip}`}
                        >
                          {items.length}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{q.subtitle}</p>
                    </CardHeader>
                    <CardContent>
                      {items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nothing here — good.</p>
                      ) : (
                        <ul className="space-y-3">
                          {items.map((t, i) => (
                            <li key={i} className="rounded-lg bg-card p-3 shadow-[var(--shadow-soft)]">
                              <p className="text-sm font-medium text-foreground">{t.title}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{t.note}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ResultCard>
      </div>
    </AppShell>
  );
}
