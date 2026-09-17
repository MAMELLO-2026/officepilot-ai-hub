/**
 * Mock AI engine. Deterministic, heuristic "analysis" of the user's input so
 * the app feels functional without a backend.
 */

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const URGENT_WORDS = [
  "urgent",
  "asap",
  "immediately",
  "today",
  "critical",
  "deadline",
  "eod",
  "escalate",
  "blocker",
  "overdue",
];
const SOON_WORDS = ["tomorrow", "this week", "soon", "friday", "monday", "review", "reminder"];
const ACTION_WORDS = [
  "please",
  "can you",
  "could you",
  "need",
  "send",
  "review",
  "confirm",
  "schedule",
  "update",
  "prepare",
  "follow up",
  "sign",
  "share",
  "call",
  "approve",
];

export type Urgency = "High" | "Medium" | "Low";

const sentences = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const clip = (s: string, n = 120) => (s.length > n ? `${s.slice(0, n).trim()}…` : s);

export type EmailSummary = {
  subject: string;
  bullets: string[];
  actionItems: string[];
  urgency: Urgency;
  urgencyReason: string;
};

export async function summarizeEmail(input: string): Promise<EmailSummary> {
  await delay(1400);
  const lower = input.toLowerCase();
  const all = sentences(input);
  const subjectMatch = input.match(/subject:\s*(.+)/i);

  const scored = all
    .map((s) => {
      const l = s.toLowerCase();
      let score = Math.min(s.length / 60, 2);
      if (URGENT_WORDS.some((w) => l.includes(w))) score += 3;
      if (ACTION_WORDS.some((w) => l.includes(w))) score += 2;
      if (/\d/.test(s)) score += 1;
      return { s, score };
    })
    .sort((a, b) => b.score - a.score);

  const bullets = scored.slice(0, 5).map((x) => clip(titleCase(x.s)));

  const actionItems = all
    .filter((s) => ACTION_WORDS.some((w) => s.toLowerCase().includes(w)))
    .slice(0, 5)
    .map((s) => clip(titleCase(s.replace(/^(hi|hello|hey)[^,]*,\s*/i, ""))));

  const urgency: Urgency = URGENT_WORDS.some((w) => lower.includes(w))
    ? "High"
    : SOON_WORDS.some((w) => lower.includes(w))
      ? "Medium"
      : "Low";

  const urgencyReason =
    urgency === "High"
      ? "Time-sensitive language detected — respond today."
      : urgency === "Medium"
        ? "A near-term date or review request was mentioned."
        : "No deadline signals found — handle in your normal queue.";

  return {
    subject: subjectMatch?.[1]?.trim() || clip(titleCase(all[0] ?? "Email summary"), 70),
    bullets: bullets.length ? bullets : ["The email is short — no key points to extract."],
    actionItems: actionItems.length ? actionItems : ["No explicit requests were found."],
    urgency,
    urgencyReason,
  };
}

export type MeetingTask = {
  task: string;
  owner: string;
  deadline: string;
};

const NAME_RE = /\b([A-Z][a-z]{2,})\b(?=\s+(?:will|to|is|should|owns|takes|can|needs|by))/;
const DATE_RE =
  /\b(today|tomorrow|tonight|eod|next week|this week|end of (?:week|month)|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?|sun(?:day)?|\d{1,2}(?:st|nd|rd|th)?\s+\w+|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\b/i;

export async function parseMeetingNotes(input: string): Promise<MeetingTask[]> {
  await delay(1500);
  const lines = input
    .split(/\n|(?<=[.;])\s+/)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((l) => l.length > 4);

  const tasks = lines.map((line) => {
    const owner = line.match(NAME_RE)?.[1] ?? line.match(/@(\w+)/)?.[1] ?? "Unassigned";
    const date = line.match(DATE_RE)?.[0];
    const task = clip(
      titleCase(
        line
          .replace(NAME_RE, "")
          .replace(/^\s*(will|to|is|should)\s+/i, "")
          .replace(/\s+/g, " ")
          .trim() || line,
      ),
      110,
    );
    return {
      task,
      owner: titleCase(owner),
      deadline: date ? titleCase(date) : "No date set",
    };
  });

  return tasks.slice(0, 12);
}

export type Tone = "Formal" | "Friendly" | "Assertive";

export async function rewriteMessage(input: string, tone: Tone): Promise<string> {
  await delay(1300);
  const body = sentences(input)
    .map((s) => titleCase(s.replace(/\b(gonna)\b/gi, "going to").replace(/\b(wanna)\b/gi, "want to")))
    .map((s) => (/[.!?]$/.test(s) ? s : `${s}.`));

  const core = body.join(" ") || "I wanted to follow up on the item below.";

  if (tone === "Formal") {
    return [
      "Subject: Follow-up on our discussion",
      "",
      "Dear colleague,",
      "",
      `I hope this message finds you well. ${core}`,
      "",
      "Please let me know if you require any further detail, and I will be glad to assist.",
      "",
      "Kind regards,",
      "[Your name]",
    ].join("\n");
  }

  if (tone === "Friendly") {
    return [
      "Subject: Quick follow-up",
      "",
      "Hi there,",
      "",
      `Hope your week is going well! ${core}`,
      "",
      "Happy to jump on a quick call if that's easier — just let me know what works.",
      "",
      "Thanks so much,",
      "[Your name]",
    ].join("\n");
  }

  return [
    "Subject: Action needed",
    "",
    "Hello,",
    "",
    core,
    "",
    "To keep this on track, please confirm by end of day so we can move forward without delay.",
    "",
    "Regards,",
    "[Your name]",
  ].join("\n");
}

export type Quadrant = "do" | "schedule" | "delegate" | "eliminate";
export type PlannedTask = { title: string; quadrant: Quadrant; note: string };

const IMPORTANT_WORDS = [
  "client",
  "invoice",
  "payroll",
  "revenue",
  "contract",
  "proposal",
  "tax",
  "hire",
  "strategy",
  "customer",
  "launch",
  "legal",
];
const DELEGATE_WORDS = ["book", "order", "schedule", "file", "print", "data entry", "format", "post", "upload"];
const LOW_WORDS = ["scroll", "browse", "reorganize", "tidy", "someday", "maybe", "read later", "newsletter"];

export async function planPriorities(input: string): Promise<PlannedTask[]> {
  await delay(1400);
  const items = input
    .split(/\n|,(?=\s*[a-z])/i)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter((l) => l.length > 2);

  return items.slice(0, 20).map((title) => {
    const l = title.toLowerCase();
    const urgent = URGENT_WORDS.some((w) => l.includes(w)) || /today|now|eod/.test(l);
    const important = IMPORTANT_WORDS.some((w) => l.includes(w));
    const delegable = DELEGATE_WORDS.some((w) => l.includes(w));
    const low = LOW_WORDS.some((w) => l.includes(w));

    let quadrant: Quadrant;
    let note: string;
    if (low && !urgent) {
      quadrant = "eliminate";
      note = "Low value — drop it or park it for a quiet week.";
    } else if (delegable && !important) {
      quadrant = "delegate";
      note = "Routine admin — hand to a teammate or assistant.";
    } else if (urgent && important) {
      quadrant = "do";
      note = "Time-critical and tied to the business — start here.";
    } else if (important) {
      quadrant = "schedule";
      note = "High value, no deadline pressure — block time this week.";
    } else if (urgent) {
      quadrant = "delegate";
      note = "Urgent but not strategic — delegate if you can.";
    } else {
      quadrant = "schedule";
      note = "Keep moving, but it can wait for a planned slot.";
    }
    return { title: titleCase(title), quadrant, note };
  });
}
