import { useEffect, useRef, useState } from "react";
import { authService } from "../../services/auth/authService";
import { ollamaService } from "../../services/ollama/ollamaService";
import { productContextService } from "../../services/products/productContextService";
import { drugInteractionService } from "../../services/interaction/drugInteractionService";
import {
  WidgetButton,
  WidgetWrapper,
  ModalOverlay,
  ModalContainer,
  ModalCard,
  ModalHeader,
  ModalClose,
  ModalShell,
  ChatMessages,
  MessageItem,
  UserMessage,
  AssistantMessage,
  ChatInput,
  ChatInputForm,
  InputField,
  SendButton,
  ErrorMessage,
  LoadingDot,
} from "./style";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const SYSTEM_PROMPT = `Você é um assistente farmacêutico da PharmaPro.

REGRAS OBRIGATÓRIAS:
🛡️ SEGURANÇA:
- NUNCA recomende medicamentos para risco de vida (suicídio, automutilação, etc)
- NUNCA use xingamentos ou linguagem ofensiva
- NUNCA faça diagnósticos médicos
- NUNCA substitua orientação profissional - sempre diga "Consulte um profissional"

⚡ RESPOSTAS:
- MUITO CURTAS (máx 2-3 linhas)
- DIRETAS e OBJETIVAS
- SEM explicações longas
- Cite nome e preço de produtos quando recomendar
- Use bullets apenas se for lista

📋 CONTEXTO:
Use as categorias e produtos listados abaixo para responder perguntas.
- Se for sobre interação entre medicamentos, responda apenas com base nos dados cadastrados no sistema.
- Se não houver interação registrada, responda: "Nenhum medicamento vendido pela Pharma Lais possui interferência registrada com o medicamento citado."`;

const createId = () => Math.random().toString(36).slice(2, 11);

export const IAChatWidget = () => {
  const canUseIa = authService.isAuthenticated();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [productContext, setProductContext] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Carregar contexto de produtos ao abrir o modal
  useEffect(() => {
    if (open && !productContext) {
      const loadContext = async () => {
        const context = await productContextService.getProductsContext();
        setProductContext(context);
      };
      void loadContext();
    }
  }, [open, productContext]);

  // Scroll automático para mensagens novas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const submitMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setError("");
    const userMsg: Message = {
      id: createId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Preparar contexto completo para o Ollama
      const conversationHistory = messages.map((msg) => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      }));

      const interactionAnswer =
        await drugInteractionService.getInteractionAnswer(text);
      if (interactionAnswer) {
        const assistantMsg: Message = {
          id: createId(),
          role: "assistant",
          content: interactionAnswer,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
        return;
      }

      const messagesForOllama = [
        {
          role: "system" as const,
          content: `${SYSTEM_PROMPT}\n\n${productContext}`,
        },
        ...conversationHistory,
        {
          role: "user" as const,
          content: text,
        },
      ];

      const response = await ollamaService.chat(messagesForOllama);

      const assistantMsg: Message = {
        id: createId(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erro ao comunicar com o assistente. Verifique se Ollama está rodando.";
      setError(errorMsg);

      // Adicionar mensagem de erro ao chat
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content:
            "Desculpe, tive um problema ao processar sua mensagem. " + errorMsg,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitMessage(input);
    }
  };

  if (!canUseIa) return null;

  return (
    <WidgetWrapper>
      <WidgetButton
        type="button"
        data-cy="ia-widget-button"
        aria-label="Abrir assistente de IA"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        title="Clique para abrir o assistente da farmácia"
      >
        💊
      </WidgetButton>

      {open && (
        <>
          <ModalOverlay onClick={() => setOpen(false)} />
          <ModalContainer>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <div>
                  <h2
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    💊 Assistente da Farmácia
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      color: "rgba(107, 114, 128, 0.8)",
                      lineHeight: 1.5,
                    }}
                  >
                    Procure produtos, confira categorias, veja pedidos e
                    esclareça dúvidas sobre interações medicamentosas.
                  </p>
                </div>
                <ModalClose
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar chat"
                >
                  ✕
                </ModalClose>
              </ModalHeader>

              <ModalShell>
                <ChatMessages>
                  {messages.length === 0 && !loading && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "32px 20px",
                        color: "rgba(107, 114, 128, 0.7)",
                      }}
                    >
                      <p style={{ fontSize: "0.95rem", lineHeight: 1.6 }}>
                        👋 Olá! Sou seu assistente farmacêutico. Como posso
                        ajudar você hoje?
                      </p>
                      <p style={{ fontSize: "0.85rem", margin: "12px 0 0 0" }}>
                        Posso ajudar a buscar produtos, esclarecer dúvidas e
                        fornecer informações sobre interações medicamentosas.
                      </p>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <MessageItem key={msg.id} $role={msg.role}>
                      {msg.role === "user" ? (
                        <UserMessage>{msg.content}</UserMessage>
                      ) : (
                        <AssistantMessage>{msg.content}</AssistantMessage>
                      )}
                    </MessageItem>
                  ))}

                  {loading && (
                    <MessageItem $role="assistant">
                      <AssistantMessage>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                          }}
                        >
                          <span>Processando</span>
                          <LoadingDot />
                          <LoadingDot style={{ animationDelay: "0.2s" }} />
                          <LoadingDot style={{ animationDelay: "0.4s" }} />
                        </div>
                      </AssistantMessage>
                    </MessageItem>
                  )}

                  <div ref={messagesEndRef} />
                </ChatMessages>

                <ChatInput>
                  {error && <ErrorMessage>{error}</ErrorMessage>}

                  <ChatInputForm onSubmit={handleSubmit}>
                    <InputField
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua pergunta..."
                      rows={3}
                      data-cy="ia-chat-input"
                      disabled={loading}
                    />
                    <SendButton
                      type="submit"
                      disabled={loading || !input.trim()}
                    >
                      {loading ? "Enviando..." : "Enviar"}
                    </SendButton>
                  </ChatInputForm>
                </ChatInput>
              </ModalShell>
            </ModalCard>
          </ModalContainer>
        </>
      )}
    </WidgetWrapper>
  );
};
