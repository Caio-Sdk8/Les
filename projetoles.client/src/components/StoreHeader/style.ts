import styled from "styled-components";

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
`;

export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;

  @media (max-width: 860px) {
    height: auto;
    padding: 10px 12px;
    flex-wrap: wrap;
  }
`;

export const Logo = styled.button`
  border: none;
  background: transparent;
  color: var(--color-text);
  font-weight: 800;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 240px;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  padding: 0 16px;
  font-size: 14px;
  color: var(--color-text);
  background-color: #f9fafb;
  outline: none;

  &:focus {
    border-color: var(--color-primary);
    background-color: #fff;
  }
`;

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NavLink = styled.button`
  border: none;
  background: transparent;
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--color-text);
  }
`;

export const CartButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;
