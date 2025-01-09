export type Provider = "openai" | "anthropic" | "groq" | "cerebras" | "cohere" | "mistral" | "ollama";

export interface CerebrasMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CerebrasResponse {
  id: string;
  choices: {
    message: CerebrasMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
} 