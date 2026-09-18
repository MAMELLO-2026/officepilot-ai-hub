export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;

  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has("X-Lovable-AIG-Run-ID")) {
        headers.set("X-Lovable-AIG-Run-ID", runId);
      }
      const response = await fetch(input, { ...init, headers });
      const next = response.headers.get("X-Lovable-AIG-Run-ID")?.trim();
      if (!runId && next) runId = next;
      return response;
    },
    getRunId: () => runId,
  };
}
