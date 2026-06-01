import styled, { css } from "styled-components";

export const ChatShell = styled.div`
  width: 100%;
  min-height: calc(100vh - 180px);
  padding: 12px 0 24px;
  background: linear-gradient(180deg, var(--color-bg), var(--color-surface));
`;

export const ChatCard = styled.section`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 220px);
  border: 1px solid var(--color-border);
  border-radius: 28px;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: 0 18px 40px rgba(17, 24, 39, 0.06);
`;

export const ChatHeader = styled.header`
  padding: 24px 24px 18px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

export const ChatTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.35rem, 2vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const HeaderDescription = styled.p`
  margin: 8px 0 0;
  max-width: 70ch;
  color: var(--color-muted);
  line-height: 1.6;
`;

type BadgeProps = {
  $mode: "groq" | "local";
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: ${({ $mode }) =>
    $mode === "groq"
      ? "linear-gradient(135deg, var(--color-primary-soft), rgba(34,197,94,0.08))"
      : "var(--color-surface)"};
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
`;

export const ChatIntro = styled.div`
  margin-top: 18px;
`;

export const EmptyState = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
`;

export const EmptyStateText = styled.p`
  margin: 0;
  color: var(--color-text);
  line-height: 1.6;
`;

export const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
`;

export const QuickButton = styled.button`
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    background 0.16s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary-soft);
    outline-offset: 2px;
  }
`;

export const MessageList = styled.div`
  flex: 1;
  min-height: 420px;
  max-height: 54vh;
  overflow-y: auto;
  padding: 22px 22px 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

type MessageRowProps = {
  $role: "user" | "assistant";
};

export const MessageRow = styled.div<MessageRowProps>`
  display: flex;
  justify-content: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
`;

const bubbleBase = css`
  max-width: min(720px, 100%);
  padding: 14px 16px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.14);
  box-shadow: 0 16px 40px rgba(2, 8, 23, 0.18);
`;

export const AssistantBubble = styled.div`
  ${bubbleBase}
  background: var(--color-surface);
  color: var(--color-text);
`;

export const UserBubble = styled.div`
  ${bubbleBase}
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-primary-soft);
`;

export const MessageText = styled.p`
  margin: 0;
  line-height: 1.65;
  white-space: pre-wrap;
`;

export const MessageMeta = styled.div`
  margin-top: 10px;
  color: var(--color-muted);
  font-size: 0.8rem;
`;

export const ScrollAnchor = styled.div`
  height: 1px;
`;

export const ComposerWrap = styled.div`
  padding: 18px 22px 22px;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
`;

export const ChatComposer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChatField = styled.textarea`
  width: 100%;
  resize: none;
  border-radius: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 16px 18px;
  font-size: 1rem;
  line-height: 1.6;
  outline: none;
  min-height: 112px;

  &::placeholder {
    color: rgba(107, 114, 128, 0.45);
  }

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px var(--color-primary-soft);
  }
`;

export const ComposerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

export const ComposerHint = styled.span<{ $tone?: "error" }>`
  color: ${({ $tone }) => ($tone === "error" ? "#fda4af" : "var(--color-muted)")};
  font-size: 0.875rem;
`;

export const ComposerActions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

export const ComposerButton = styled.button`
  min-width: 124px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-primary-soft);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
  transition:
    transform 0.16s ease,
    opacity 0.16s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;
