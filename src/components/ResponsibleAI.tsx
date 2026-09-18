import { Info, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DISCLAIMER =
  "This content is AI generated and should be reviewed before sending. OfficePilot does not store sensitive data and aims to reduce bias.";

const TOOLTIP_TEXT =
  "Responsible AI: your text is used only to generate this result — it is never stored or shared. Every output is clearly labeled as AI generated and is designed to reduce bias, but you should always review it before sending.";

export function AIDisclaimer() {
  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
      {DISCLAIMER}
    </p>
  );
}

export function AIInfoTooltip({ className }: { className?: string }) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger
          asChild
          aria-label="How AI is used responsibly"
          className={className}
        >
          <span>
            <Info className="size-4 cursor-help text-muted-foreground/70 transition-colors hover:text-primary" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
          {TOOLTIP_TEXT}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
