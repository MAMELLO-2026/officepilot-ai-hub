import type { ReactNode } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function InputCard({
  label,
  placeholder,
  value,
  onChange,
  onRun,
  onSample,
  loading,
  runLabel,
  extra,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onRun: () => void;
  onSample: () => void;
  loading: boolean;
  runLabel: string;
  extra?: ReactNode;
}) {
  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-48 resize-y bg-secondary/50"
        />
        {extra}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onRun} disabled={loading || value.trim().length < 5} className="gap-2">
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            {loading ? "Working…" : runLabel}
          </Button>
          <Button variant="ghost" onClick={onSample} disabled={loading}>
            Load example
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ResultCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-base">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function LoadingLines({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded-full bg-secondary"
          style={{ width: `${95 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
