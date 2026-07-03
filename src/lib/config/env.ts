import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  OPENAI_API_KEY: z
    .string()
    .min(1, "OPENAI_API_KEY is required (OpenCode Go API key from OpenCode Zen)"),
  OPENAI_BASE_URL: z
    .string()
    .url()
    .default("https://opencode.ai/zen/go/v1"),
  OPENAI_MODEL: z.string().default("deepseek-v4-flash"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_MAP_TILE_URL: z.string().optional(),
  NEXT_PUBLIC_MAP_TILE_ATTRIBUTION: z.string().optional(),
  NEXT_PUBLIC_MAP_FALLBACK_TILE_URL: z.string().optional(),
  NEXT_PUBLIC_MAP_FALLBACK_TILE_ATTRIBUTION: z.string().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

let serverEnvCache: ServerEnv | null = null;
let clientEnvCache: ClientEnv | null = null;

function loadServerEnv(): ServerEnv {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment:\n${message}`);
  }
  return parsed.data;
}

function loadClientEnv(): ClientEnv {
  const parsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_MAP_TILE_URL: process.env.NEXT_PUBLIC_MAP_TILE_URL,
    NEXT_PUBLIC_MAP_TILE_ATTRIBUTION:
      process.env.NEXT_PUBLIC_MAP_TILE_ATTRIBUTION,
    NEXT_PUBLIC_MAP_FALLBACK_TILE_URL:
      process.env.NEXT_PUBLIC_MAP_FALLBACK_TILE_URL,
    NEXT_PUBLIC_MAP_FALLBACK_TILE_ATTRIBUTION:
      process.env.NEXT_PUBLIC_MAP_FALLBACK_TILE_ATTRIBUTION,
  });
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid client environment:\n${message}`);
  }
  return parsed.data;
}

/** Server-only config. Import only from server code; validated on first access. */
export function getServerEnv(): ServerEnv {
  if (!serverEnvCache) {
    serverEnvCache = loadServerEnv();
  }
  return serverEnvCache;
}

/** Browser-safe config. */
export function getClientEnv(): ClientEnv {
  if (!clientEnvCache) {
    clientEnvCache = loadClientEnv();
  }
  return clientEnvCache;
}
