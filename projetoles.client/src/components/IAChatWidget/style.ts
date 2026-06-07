import styled, { keyframes } from "styled-components";

export const WidgetWrapper = styled.div`
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 1100;
`;

export const WidgetButton = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  color: var(--color-primary-soft);
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 54px rgba(15, 23, 42, 0.3);
  }

  &:focus-visible {
    outline: 3px solid rgba(34, 197, 94, 0.45);
    outline-offset: 4px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(2px);
  z-index: 1090;
`;

export const ModalContainer = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  padding: 24px;
  z-index: 1095;

  @media (max-width: 900px) {
    align-items: stretch;
    justify-content: center;
    padding: 12px;
  }
`;

export const ModalCard = styled.div`
  width: min(98vw, 920px);
  max-height: min(92vh, 820px);
  display: flex;
  flex-direction: column;
  border-radius: 28px;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: 0 32px 80px rgba(15, 23, 42, 0.24);

  @media (max-width: 900px) {
    width: 100%;
    max-height: 100vh;
    border-radius: 20px;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    var(--color-surface),
    rgba(34, 197, 94, 0.05)
  );
  border-bottom: 1px solid var(--color-border);
`;

export const ModalClose = styled.button`
  border: none;
  background: transparent;
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background 0.16s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(148, 163, 184, 0.12);
  }
`;

export const ModalShell = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(148, 163, 184, 0.5);
    }
  }
`;

interface MessageItemProps {
  $role: "user" | "assistant";
}

export const MessageItem = styled.div<MessageItemProps>`
  display: flex;
  justify-content: ${({ $role }) =>
    $role === "user" ? "flex-end" : "flex-start"};
  animation: slideIn 0.3s ease forwards;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const UserMessage = styled.div`
  max-width: 70%;
  padding: 14px 18px;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  color: var(--color-primary-soft);
  line-height: 1.6;
  word-wrap: break-word;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.12);

  @media (max-width: 720px) {
    max-width: 85%;
  }
`;

export const AssistantMessage = styled.div`
  max-width: 70%;
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: var(--color-text);
  line-height: 1.6;
  word-wrap: break-word;

  @media (max-width: 720px) {
    max-width: 85%;
  }
`;

export const ChatInput = styled.div`
  padding: 20px 24px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
`;

export const ChatInputForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

export const InputField = styled.textarea`
  flex: 1;
  resize: none;
  border-radius: 18px;
  border: 1px solid var(--color-border);
  background: rgba(148, 163, 184, 0.06);
  color: var(--color-text);
  padding: 14px 16px;
  font-size: 0.95rem;
  line-height: 1.5;
  outline: none;
  min-height: 48px;
  max-height: 120px;
  font-family: inherit;
  transition: all 0.16s ease;

  &::placeholder {
    color: rgba(107, 114, 128, 0.5);
  }

  &:focus {
    border-color: var(--color-primary);
    background: rgba(34, 197, 94, 0.06);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  min-width: 100px;
  height: 48px;
  border: none;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-primary-soft);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-primary-dark)
  );
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.12);
  transition: all 0.16s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.16);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const ErrorMessage = styled.div`
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
  color: #991b1b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
`;

export const LoadingDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: ${bounce} 1.4s infinite;
`;
