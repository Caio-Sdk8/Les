import { styled } from "styled-components";

export const DivPagination = styled.div`
  width: 100%;
  padding-right: 10px;

  display: flex;
  justify-content: end;
  align-items: center;
`;

export const PaginationContainer = styled.div`
  padding: 8px 0;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 5px 0;

  @media (width <= 567px) {
    justify-content: center;
  }
`;

export const ButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PageButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const Pages = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  background-color: ${({ $isActive }) =>
    $isActive ? "var(--color-primary)" : "transparent"};
  cursor: pointer;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? "var(--color-primary)" : "var(--color-border)"};
  margin: 0;

  font-size: 14px;
  font-family: var(--font-openSans), sans-serif;
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "600")};
  color: ${({ $isActive }) => ($isActive ? "white" : "var(--color-text)")};

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background-color: var(--color-primary-soft);
  }
`;

export const Text = styled.p`
  font-family: var(--font-openSans), sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-text);
  margin: 0;
`;

export const Icon = styled.img`
  width: 12px;
  height: 12px;
  display: block;
`;
