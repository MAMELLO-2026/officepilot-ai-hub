import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState, InputCard, LoadingLines, ResultCard } from "@/components/ToolPanel";
import { Badge } from "@/components/ui/badge";
import { summarizeEmail, type EmailSummary } from "@/lib/mock-ai";

export const Route = createFileRoute("/email-summarizer")({
  head: () => ({
    meta: [
      { title: "Email Summarizer | OfficePilot AI" },
      {
        name: "description",
        content:
          "Paste a long email and get a bullet summary, extracted action items and an urgency rating in seconds.",
      },
      { property: "og:title", content: "AI Email Summarizer | OfficePilot AI" },
      {
        property: "og:description",
        content: "Turn long email threads into bullets, action items and an urgency read.",
      },
    ],
  }),
  component: EmailSummarizerPage,
});

const SAMPLE = `Subject: Q3 supplier contract - urgent review needed

Hi Mamello,

Following up on our call yesterday about the Northgate supplier contract. Legal came back with two changes: the payment window moves from 30 to 45 days, and the penalty clause on late delivery has been softened.

We need a decision today because their sales director leaves on Friday and the current pricing expires with him. Could you review the redlined pages 4 to 7 and confirm whether the 45 day terms work for our cash flow?

Also, please send me the updated delivery volumes for October so I can finish the forecast. Thandi will handle the signature routing once you approve.

Thanks,
Peter`;

const urgencyStyles: Record<EmailSummary["urgency"], string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-accent text-accent-foreground border-accent",
  Low: "bg-secondary text-secondary-foreground border-border",
};

function EmailSummarizerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailSummary | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setResult(await summarizeEmail(input));
    setLoading(false);
  };

  const asText = result
    ? [
        `Subject: ${result.subject}`,
        "",
        "Summary:",
        ...result.bullets.map((b) => `• ${b}`),
        "",
        "Action items:",
        ...result.actionItems.map((a) => `- ${a}`),
        "",
        `Urgency: ${result.urgency} — ${result.urgencyReason}`,
      ].join("\n")
    : "";

  return (
    <AppShell
      title="Email Summarizer"
      description="Paste a long email or thread. You'll get key points, the actions expected of you, and how fast you need to reply."
    >
      <div className="space-y-6">
        <InputCard
          label="Paste the email"
          placeholder="Paste the full email here, including the subject line if you have it…"
          value={input}
          onChange={setInput}
          onRun={run}
          onSample={() => setInput(SAMPLE)}
          loading={loading}
          runLabel="Summarize email"
        />

        <ResultCard
          title="Summary"
          action={result ? <CopyButton value={asText} label="Copy summary" /> : undefined}
        >
          {loading ? (
            <LoadingLines rows={5} />
          ) : !result ? (
            <EmptyState text="Your summary, action items and urgency rating will appear here." />
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-medium text-foreground">{result.subject}</p>
                <Badge variant="outline" className={urgencyStyles[result.urgency]}>
                  <AlertTriangle className="mr-1 size-3.5" />
                  {result.urgency} urgency
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Key points</h3>
                <ul className="mt-3 space-y-2">
                  {result.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">Action items</h3>
                <ul className="mt-3 space-y-2">
                  {result.actionItems.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                {result.urgencyReason}
              </div>
            </div>
          )}
        </ResultCard>
      </div>
    </AppShell>
  );
}
