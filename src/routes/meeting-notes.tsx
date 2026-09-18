import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState, InputCard, LoadingLines, ResultCard } from "@/components/ToolPanel";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { parseMeetingNotesAi, type MeetingTask } from "@/lib/ai.functions";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Parser | OfficePilot AI" },
      {
        name: "description",
        content:
          "Paste messy meeting notes and get a clean table of tasks with owners and deadlines you can share with the team.",
      },
      { property: "og:title", content: "AI Meeting Notes Parser | OfficePilot AI" },
      {
        property: "og:description",
        content: "Messy notes in, task / owner / deadline table out.",
      },
    ],
  }),
  component: MeetingNotesPage,
});

const SAMPLE = `weekly ops catchup - quick notes
- Thandi will send the October stock count to the accountant by Friday
- pricing page copy still outdated, Peter to rewrite it this week
- Sipho needs to call Northgate about the late delivery today, it's urgent
- someone should book the annual audit slot, tomorrow if possible
- Lerato to prepare the payroll summary by 30/09
- team lunch idea, maybe next month`;

function MeetingNotesPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<MeetingTask[] | null>(null);

  const parse = useServerFn(parseMeetingNotesAi);

  const run = async () => {
    setLoading(true);
    setTasks(null);
    try {
      setTasks(await parse({ data: { text: input } }));
    } catch {
      toast.error("The AI could not read those notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const asText = tasks
    ? ["Task | Owner | Deadline", ...tasks.map((t) => `${t.task} | ${t.owner} | ${t.deadline}`)].join(
        "\n",
      )
    : "";

  return (
    <AppShell
      title="Meeting Notes Parser"
      description="Drop in your rough notes. Every commitment comes back as a task with an owner and a deadline."
    >
      <div className="space-y-6">
        <InputCard
          label="Paste your meeting notes"
          placeholder="Bullet points, half sentences, shorthand — paste it exactly as you typed it…"
          value={input}
          onChange={setInput}
          onRun={run}
          onSample={() => setInput(SAMPLE)}
          loading={loading}
          runLabel="Extract tasks"
        />

        <ResultCard
          title="Extracted tasks"
          action={tasks?.length ? <CopyButton value={asText} label="Copy table" /> : undefined}
        >
          {loading ? (
            <LoadingLines rows={5} />
          ) : !tasks ? (
            <EmptyState text="Your task table will appear here with owners and deadlines." />
          ) : tasks.length === 0 ? (
            <EmptyState text="No clear tasks were found in those notes." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/60">
                    <TableHead className="w-1/2">Task</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((t, i) => (
                    <TableRow key={i}>
                      <TableCell className="align-top text-sm text-foreground">{t.task}</TableCell>
                      <TableCell className="align-top">
                        <Badge
                          variant="outline"
                          className={
                            t.owner === "Unassigned"
                              ? "border-border bg-secondary text-muted-foreground"
                              : "border-accent bg-accent text-accent-foreground"
                          }
                        >
                          {t.owner}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {t.deadline}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </ResultCard>
      </div>
    </AppShell>
  );
}
