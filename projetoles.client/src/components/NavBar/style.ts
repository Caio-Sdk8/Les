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

export const Badge = styled.span`
  margin-left: 8px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
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
