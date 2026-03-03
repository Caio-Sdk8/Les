import styled from "styled-components";

export const HighlightsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const HighlightCard = styled.article`
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background-color: var(--color-surface);
  padding: 12px;
`;

export const ItemTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  color: var(--color-text);
`;

export const ItemText = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-muted);
`;
