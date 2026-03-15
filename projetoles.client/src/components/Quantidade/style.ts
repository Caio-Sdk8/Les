import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

export const QuantityButton = styled.button`
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background-color: var(--color-primary-soft);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const QuantityValue = styled.span`
  height: 34px;
  min-width: 40px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`;
