import styled from "styled-components";

export const NavItems = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-muted);
  text-decoration: none;
  transition: 0.3s;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-pill);

  &:hover {
    color: var(--color-text);
    background-color: var(--color-primary-soft);
  }
`;

export const ItemsContainer = styled.div`
  width: auto;
  height: auto;
  display: flex;
  flex-direction: row;
  gap: 16px;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 860px) {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 0;
  }
`;
