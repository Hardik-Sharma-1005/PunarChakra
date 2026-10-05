import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnvironment } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, publishableKey } = getSupabaseEnvironment();
    browserClient = createBrowserClient(url, publishableKey);
  }

  return browserClient;
}
