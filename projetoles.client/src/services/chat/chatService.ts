import api from "../requests/api";

export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  mode: "groq" | "local";
}

export const chatService = {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post<ChatResponse>("/api/chat", payload);
    return data;
  },
};