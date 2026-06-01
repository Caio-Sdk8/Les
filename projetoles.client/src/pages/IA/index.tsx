import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import { chatService, type ChatResponse } from "../../services/chat/chatService";
import {
  AssistantBubble,
  Badge,
  ChatCard,
  ChatComposer,
  ChatField,
  ChatHeader,
  ChatIntro,
  ChatShell,
  ChatTitle,
  ComposerActions,
  ComposerButton,
  ComposerFooter,
  ComposerHint,
  ComposerWrap,
  EmptyState,
  EmptyStateText,
  HeaderDescription,
  HeaderRow,
  MessageList,
  MessageMeta,
  MessageRow,
  MessageText,
  QuickActions,
  QuickButton,
  ScrollAnchor,
  UserBubble,
} from "./style";

type ChatRole = "user" | "assistant";

interface ChatItem {
  id: string;
  role: ChatRole;
  text: string;
  mode?: ChatResponse["mode"];
}

const STORAGE_KEY = "projetoles.chat.sessionId";

const WELCOME_MESSAGE: ChatItem = {
  id: "welcome",
  role: "assistant",
  text: "Sou o assistente da farmácia. Posso procurar produtos, listar categorias, verificar pedidos e checar interações medicamentosas. Não respondo sobre assuntos fora desse contexto.",
  mode: "local",
};

const QUICK_PROMPTS = [
  "Quais categorias existem na farmácia?",
  "Procure um produto para dor de cabeça",
  "Verifique interações entre dipirona e ibuprofeno",
  "Mostre meus pedidos recentes",
];

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
};

export default function IA() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatItem[]>([WELCOME_MESSAGE]);
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem(STORAGE_KEY);
    if (savedSessionId) {
      setSessionId(savedSessionId);
      return;
    }

    const newSessionId = createId();
    setSessionId(newSessionId);
    window.localStorage.setItem(STORAGE_KEY, newSessionId);
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const lastMode = useMemo(() => {
    const lastAssistant = [...messages].reverse().find((item) => item.role === "assistant");
    return lastAssistant?.mode ?? "local";
  }, [messages]);

  const submitMessage = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setError("");
    setLoading(true);

    const userMessage: ChatItem = {
      id: createId(),
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");

    try {
      const response = await chatService.sendMessage({
        message: trimmed,
        sessionId,
      });

      if (response.sessionId && response.sessionId !== sessionId) {
        setSessionId(response.sessionId);
        window.localStorage.setItem(STORAGE_KEY, response.sessionId);
      }

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          text: response.reply,
          mode: response.mode,
        },
      ]);
    } catch {
      setError("Não foi possível falar com o assistente agora. Tente novamente em instantes.");
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          text: "Tive um problema ao processar sua solicitação. Se quiser, tente novamente com mais detalhes.",
          mode: "local",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    void submitMessage(prompt);
  };

  const handleComposerKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitMessage(message);
    }
  };

  return (
    <AppShell title="Recomendação com IA">
      <ChatShell>
        <ChatCard>
          <ChatHeader>
            <HeaderRow>
              <div>
                <ChatTitle>Assistente da farmácia</ChatTitle>
                <HeaderDescription>
                  Encontre produtos, confira categorias, veja pedidos e valide interações sem sair da plataforma. O chat é restrito a assuntos da farmácia.
                </HeaderDescription>
              </div>

              <Badge $mode={lastMode}>{lastMode === "groq" ? "Groq ativo" : "Modo local"}</Badge>
            </HeaderRow>
            <QuickActions>
              {QUICK_PROMPTS.map((prompt) => (
                <QuickButton key={prompt} type="button" onClick={() => handleQuickPrompt(prompt)}>
                  {prompt}
                </QuickButton>
              ))}
            </QuickActions>
          </ChatHeader>

          <MessageList>
            {messages.map((item) => (
              <MessageRow key={item.id} $role={item.role}>
                {item.role === "assistant" ? (
                  <AssistantBubble>
                    <MessageText>{item.text}</MessageText>
                    <MessageMeta>
                      <span>{item.mode === "groq" ? "Resposta via Groq" : "Resposta local"}</span>
                    </MessageMeta>
                  </AssistantBubble>
                ) : (
                  <UserBubble>
                    <MessageText>{item.text}</MessageText>
                  </UserBubble>
                )}
              </MessageRow>
            ))}

            {loading && (
              <MessageRow $role="assistant">
                <AssistantBubble>
                  <MessageText>Pensando na melhor resposta...</MessageText>
                </AssistantBubble>
              </MessageRow>
            )}

            <ScrollAnchor ref={listEndRef} />
          </MessageList>

          <ComposerWrap>
            {error && <ComposerHint $tone="error">{error}</ComposerHint>}

            <ChatComposer
              onSubmit={(event) => {
                event.preventDefault();
                void submitMessage(message);
              }}
            >
              <ChatField
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleComposerKeyDown}
                placeholder="Digite sua pergunta sobre produtos, pedidos ou interações..."
                rows={3}
              />

              <ComposerFooter>
                <ComposerHint>
                  Enter envia a mensagem. Shift+Enter cria uma nova linha.
                </ComposerHint>

                <ComposerActions>
                  <ComposerButton type="submit" disabled={loading || !message.trim()}>
                    {loading ? "Enviando..." : "Enviar"}
                  </ComposerButton>
                </ComposerActions>
              </ComposerFooter>
            </ChatComposer>
          </ComposerWrap>
        </ChatCard>
      </ChatShell>
    </AppShell>
  );
}
