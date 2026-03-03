import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`;

export const QuantityButton = styled.button`
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--color-primary-strong);
    transform: scale(1.05);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const QuantityValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
`;
