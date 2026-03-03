import { styled } from "styled-components";

export const DivPagination = styled.div`
  width: 100%;
  padding-right: 10px;

  display: flex;
  justify-content: end;
  align-items: center;
`;

export const PaginationContainer = styled.div`
  padding: 5px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: end;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 5px 0;

  @media (width <= 567px) {
    justify-content: center;
  }
`;

export const ButtonsContainer = styled.div`
  align-items: center;
  padding-right: 12px;
  display: flex;
  gap: 1rem;
`;

export const PageButton = styled.button`
  padding-bottom: 2px;
  width: 10px;
  height: 16px;
  border-radius: 0.3125rem;
  border: none;
  background: transparent;
  padding: 0;
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
  }
`;

export const Pages = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $isActive }) => ($isActive ? "transparent" : "transparent")};

  width: 24px;
  height: 24px;
  border-radius: var(--radius-sm);
  background-color: ${({ $isActive }) =>
    $isActive ? "var(--color-primary)" : "transparent"};
  cursor: pointer;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? "var(--color-primary)" : "var(--color-border)"};
  margin: 0;

  font-size: 16px;
  font-family: var(--font-openSans), sans-serif;
  font-weight: ${({ $isActive }) => ($isActive ? "700" : "400")};
  color: ${({ $isActive }) => ($isActive ? "white" : "var(--color-text)")};
`;

export const Text = styled.p`
  padding-left: 12px;
  font-family: var(--font-openSans), sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: var(--color-text);
`;

export const Icon = styled.img`
  width: 10px;
  height: 16px;
  cursor: pointer;
`;
