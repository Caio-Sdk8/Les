import styled from "styled-components";

export const CategoriesBar = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  overflow-x: auto;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  border: 1px solid
    ${({ $active }) => ($active ? "var(--color-primary)" : "var(--color-border)")};
    background-color: ${({ $active }) =>
      $active ? "var(--color-primary-soft)" : "#fff"};
    color: var(--color-text);
    border-radius: var(--radius-md);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
`;

export const CategoryIcon = styled.span`
  font-size: 16px;
`;

export const CategoryName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`;
