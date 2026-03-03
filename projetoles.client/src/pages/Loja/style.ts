import styled from "styled-components";

export const Main = styled.main`
  min-height: 100vh;
  width: 100%;
  background-color: var(--color-bg);
`;

export const PageContent = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 16px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const HeroBanner = styled.section`
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: linear-gradient(120deg, #e0f2fe 0%, #ecfeff 100%);
  padding: 18px;
`;

export const BannerTitle = styled.h1`
  margin: 0;
  font-size: 30px;
  color: var(--color-text);

  @media (max-width: 900px) {
    font-size: 24px;
  }
`;

export const BannerDescription = styled.p`
  margin: 8px 0 0;
  color: var(--color-muted);
  font-size: 14px;
  max-width: 760px;
`;

export const BannerButton = styled.button`
  margin-top: 12px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8fafc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
