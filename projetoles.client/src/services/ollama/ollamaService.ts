interface OllamaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface OllamaChatRequest {
  model: string;
  messages: OllamaMessage[];
  stream: boolean;
  temperature?: number;
}

interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: "assistant";
    content: string;
  };
  done: boolean;
}

const OLLAMA_BASE_URL = "http://localhost:11434";

export const ollamaService = {
  async chat(messages: OllamaMessage[], model = "llama3"): Promise<string> {
    const payload: OllamaChatRequest = {
      model,
      messages,
      stream: false,
      temperature: 0.7,
    };

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.statusText}`);
      }

      const data = (await response.json()) as OllamaChatResponse;
      return data.message.content;
    } catch (error) {
      console.error("Ollama service error:", error);
      throw new Error(
        "Não consegui falar com o assistente. Certifique-se de que Ollama está rodando em http://localhost:11434",
      );
    }
  },
};
