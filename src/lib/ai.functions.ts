import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type Tone = "Formal" | "Friendly" | "Assertive";
export type Quadrant = "do" | "schedule" | "delegate" | "eliminate";

export type EmailSummary = {
  subject: string;
  bullets: string[];
  actionItems: string[];
  urgency: "High" | "Medium" | "Low";
  urgencyReason: string;
};

export type MeetingTask = { task: string; owner: string; deadline: string };
export type PlannedTask = { title: string; note: string; quadrant: Quadrant };

const emailSchema = z.object({
  subject: z.string(),
  bullets: z.array(z.string()),
  actionItems: z.array(z.string()),
  urgency: z.enum(["High", "Medium", "Low"]),
  urgencyReason: z.string(),
});

const tasksSchema = z.object({
  tasks: z.array(
    z.object({
      task: z.string(),
      owner: z.string(),
      deadline: z.string(),
    }),
  ),
});

const planSchema = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      note: z.string(),
      quadrant: z.enum(["do", "schedule", "delegate", "eliminate"]),
    }),
  ),
});

async function runAi<T>(args: {
  system: string;
  prompt: string;
  schema?: z.ZodType<T>;
}): Promise<T | string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured for this project.");

  const { createOpenAI } = await import("@ai-sdk/openai");
  const { streamText, Output, NoObjectGeneratedError } = await import("ai");
  const { createLovableAiGatewayRunIdFetch } = await import("./ai-gateway.server");

  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const lovable = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: key,
    headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const providerOptions = {
    openai: {
      forceReasoning: true,
      reasoningEffort: "low",
      reasoningSummary: "auto",
      store: false,
      include: ["reasoning.encrypted_content"],
    },
  } as const;

  try {
    if (args.schema) {
      const result = streamText({
        model: lovable.responses("openai/gpt-6-astra"),
        system: args.system,
        prompt: args.prompt,
        output: Output.object({ schema: args.schema }),
        providerOptions,
      });
      return (await result.output) as T;
    }
    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: args.system,
      prompt: args.prompt,
      providerOptions,
    });
    return (await result.text) as unknown as T;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      try {
        return JSON.parse(error.text) as T;
      } catch {
        /* fall through */
      }
    }
    throw error;
  }
}

export const summarizeEmailAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ text: z.string().min(5) }).parse(input))
  .handler(async ({ data }) => {
    const out = (await runAi({
      system:
        "You are an executive assistant. Summarize business emails accurately, only using information present in the email. Write concise, plain-language bullets (max 5), list the concrete actions expected of the reader, and rate urgency.",
      prompt: `Summarize this email.\n\nProvide: a short subject line, up to 5 key-point bullets, the action items expected of the reader, an urgency rating of High, Medium or Low, and one sentence explaining the urgency rating.\n\nEMAIL:\n${data.text}`,
      schema: emailSchema,
    })) as EmailSummary;
    return out;
  });

export const parseMeetingNotesAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ text: z.string().min(5) }).parse(input))
  .handler(async ({ data }) => {
    const out = (await runAi({
      system:
        'You extract action items from messy meeting notes. Only include real commitments or tasks. Use the person named in the notes as the owner; if nobody is named use "Unassigned". Use the deadline stated in the notes; if none is stated use "No deadline".',
      prompt: `Extract every task from these meeting notes as task, owner and deadline.\n\nNOTES:\n${data.text}`,
      schema: tasksSchema,
    })) as { tasks: MeetingTask[] };
    return out.tasks ?? [];
  });

export const rewriteMessageAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        text: z.string().min(5),
        tone: z.enum(["Formal", "Friendly", "Assertive"]),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const tone = data.tone === "Formal" ? "professional" : data.tone.toLowerCase();
    const text = (await runAi({
      system:
        "You are a business writing assistant. Return only the finished email text, ready to send, with a greeting and a sign-off. No commentary, no markdown fences.",
      prompt: `Rewrite this text in ${tone} tone. Tones are friendly, professional and assertive. Make each tone clearly different.\n\nTEXT:\n${data.text}`,
    })) as string;
    return text.trim();
  });

export const planPrioritiesAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ text: z.string().min(5) }).parse(input))
  .handler(async ({ data }) => {
    const out = (await runAi({
      system:
        "You are a productivity coach who sorts tasks into the Eisenhower matrix. Quadrants: do (urgent and important), schedule (important, not urgent), delegate (urgent, not important), eliminate (neither). Keep each task's wording close to the user's, and add one short sentence explaining the placement.",
      prompt: `Sort every item in this to-do list into an Eisenhower quadrant.\n\nLIST:\n${data.text}`,
      schema: planSchema,
    })) as { tasks: PlannedTask[] };
    return out.tasks ?? [];
  });
