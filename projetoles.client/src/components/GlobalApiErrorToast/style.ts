import styled from "styled-components";

export const ToastViewport = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(420px, calc(100vw - 32px));
  pointer-events: none;
`;

export const ToastCard = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
`;

export const ToastMessage = styled.span`
  font-size: 0.9rem;
  line-height: 1.35;
`;

export const ToastCloseButton = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  font-size: 1rem;
  line-height: 1;
  padding: 2px;
  min-width: auto;
`;
