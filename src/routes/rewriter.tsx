import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState, InputCard, LoadingLines, ResultCard } from "@/components/ToolPanel";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { rewriteMessageAi, type Tone } from "@/lib/ai.functions";

export const Route = createFileRoute("/rewriter")({
  head: () => ({
    meta: [
      { title: "Professional Rewriter | OfficePilot AI" },
      {
        name: "description",
        content:
          "Turn a casual note into a polished, send-ready business email in a formal, friendly or assertive tone.",
      },
      { property: "og:title", content: "AI Professional Rewriter | OfficePilot AI" },
      {
        property: "og:description",
        content: "Casual message in, professional email out — in the tone you choose.",
      },
    ],
  }),
  component: RewriterPage,
});

const SAMPLE = `hey, just checking in on that invoice we sent 3 weeks ago. still no payment and it's holding up our own orders. can you sort it out this week? thanks`;

const tones: Tone[] = ["Formal", "Friendly", "Assertive"];

const toneHelp: Record<Tone, string> = {
  Formal: "Best for clients, legal and first contact.",
  Friendly: "Warm and approachable for regular contacts.",
  Assertive: "Clear and firm when you need a decision.",
};

function RewriterPage() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const rewrite = useServerFn(rewriteMessageAi);

  const run = async () => {
    setLoading(true);
    setOutput(null);
    try {
      setOutput(await rewrite({ data: { text: input, tone } }));
    } catch {
      toast.error("The AI could not rewrite that message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Professional Rewriter"
      description="Write it however you like. Choose a tone and get back an email that's ready to send."
    >
      <div className="space-y-6">
        <InputCard
          label="Your casual message"
          placeholder="Type or paste your rough message…"
          value={input}
          onChange={setInput}
          onRun={run}
          onSample={() => setInput(SAMPLE)}
          loading={loading}
          runLabel="Rewrite professionally"
          extra={
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger id="tone" className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{toneHelp[tone]}</p>
            </div>
          }
        />

        <ResultCard
          title={`Professional email — ${tone}`}
          action={output ? <CopyButton value={output} label="Copy email" /> : undefined}
        >
          {loading ? (
            <LoadingLines rows={6} />
          ) : !output ? (
            <EmptyState text="Your rewritten, send-ready email will appear here." />
          ) : (
            <pre className="whitespace-pre-wrap rounded-xl bg-secondary/60 p-5 font-sans text-sm leading-relaxed text-foreground">
              {output}
            </pre>
          )}
        </ResultCard>
      </div>
    </AppShell>
  );
}
