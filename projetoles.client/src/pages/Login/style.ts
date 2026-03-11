import styled from "styled-components";

// ── Layout ─────────────────────────────────────────────────────────────────

export const Main = styled.main`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

export const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(
    160deg,
    var(--color-primary) 0%,
    var(--color-primary-hover) 55%,
    var(--color-primary-dark) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  gap: 28px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LeftHeadline = styled.h2`
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  max-width: 340px;
  line-height: 1.2;
  letter-spacing: -0.5px;
`;

export const LeftTagline = styled.p`
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  text-align: center;
  max-width: 320px;
  line-height: 1.75;
`;

export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 32px;
  background: var(--color-surface);

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    padding: 40px 24px;
  }
`;

// ── Form wrapper ────────────────────────────────────────────────────────────

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
`;

export const FormTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 6px;
  line-height: 1.2;
`;

export const FormSubtitle = styled.p`
  font-size: 0.9rem;
  color: var(--color-muted);
  margin-bottom: 32px;
`;

// ── Fields ──────────────────────────────────────────────────────────────────

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
  display: block;
`;

export const ContainerInput = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  height: var(--control-height);
  padding: 0 44px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  font-size: 0.9rem;
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: var(--color-primary);
    background: var(--color-surface);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }
`;

export const Icon = styled.img`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0.45;
  pointer-events: none;
`;

export const TogglePassword = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;

  &:hover {
    color: var(--color-primary);
  }

  &:focus {
    outline: none;
  }
`;

// ── Actions ─────────────────────────────────────────────────────────────────

export const Button = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 4px;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  letter-spacing: 0.3px;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  color: var(--color-muted);
  font-size: 0.8rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
`;

export const SingButton = styled.button`
  width: 100%;
  height: 46px;
  background: transparent;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-soft);
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 14px;
`;
