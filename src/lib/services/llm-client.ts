import OpenAI from "openai";
import type { ZodType } from "zod";
import { getServerEnv } from "@/lib/config/env";
import { AppError, ValidationError } from "@/lib/errors";

let client: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!client) {
    const env = getServerEnv();
    client = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL,
    });
  }
  return client;
}

export async function callLlmJson<T>({
  prompt,
  schema,
  schemaName,
}: {
  prompt: string;
  schema: ZodType<T>;
  schemaName: string;
}): Promise<T> {
  const openai = getOpenAIClient();
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const env = getServerEnv();
      const response = await openai.chat.completions.create({
        model: env.OPENAI_MODEL,
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You write polished hospitality website copy. Respond with valid JSON only, matching the requested schema exactly. No markdown fences.",
          },
          {
            role: "user",
            content:
              attempt === 0
                ? prompt
                : `${prompt}\n\nYour previous response was invalid for ${schemaName}. Return valid JSON only.`,
          },
        ],
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AppError("Empty response from language model");
      }

      const parsedJson = JSON.parse(content) as unknown;
      const parsed = schema.safeParse(parsedJson);
      if (!parsed.success) {
        throw new ValidationError(
          `Invalid ${schemaName} from language model: ${parsed.error.issues[0]?.message ?? "schema mismatch"}`,
        );
      }

      return parsed.data;
    } catch (error) {
      lastError = error;
      if (attempt === 1) break;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }
  throw new AppError("Language model request failed");
}
