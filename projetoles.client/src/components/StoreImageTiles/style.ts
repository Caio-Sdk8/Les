import styled from "styled-components";

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  color: var(--color-text);
`;

export const Arrows = styled.div`
  display: flex;
  gap: 8px;
`;

export const ArrowButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  cursor: pointer;
`;

export const TileTrack = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
`;

export const Tile = styled.article`
  min-width: 220px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
`;

export const TileImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
`;

export const TileTitle = styled.h4`
  margin: 0;
  padding: 10px;
  font-size: 13px;
  color: var(--color-text);
`;
