import styled from "styled-components";

export const AppMain = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-bg);
`;

export const HeaderBar = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
`;

export const HeaderInner = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  min-height: 68px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  color: var(--color-text);
  font-size: 22px;
  font-weight: 800;
`;

export const AppContent = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 16px 28px;
`;
