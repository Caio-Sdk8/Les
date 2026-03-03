import styled from "styled-components";

export const Section = styled.section`
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
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CarouselTrack = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 999px;
  }
`;
