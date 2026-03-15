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
  gap: 10px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  color: var(--color-text);
  min-width: 0;
`;

export const Arrows = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const ArrowButton = styled.button`
  width: 30px;
  height: 30px;
  min-width: 30px;
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
  flex-wrap: nowrap;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 6px;
  scroll-snap-type: x proximity;
  -ms-overflow-style: none;
  scrollbar-width: none;

  > * {
    scroll-snap-align: start;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;
