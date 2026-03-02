import styled from "styled-components";

export const PubliContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: auto;
  gap: 20px;
`;

export const DivGlobalItens = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
`;

export const PubliItens = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 10px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;

  &:hover div {
    opacity: 1;
    pointer-events: all;
  }
`;

export const HoverIcons = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;

  display: flex;
  gap: 8px;

  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
`;

export const IconButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const IconBack = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.6);
  align-items: center;
  justify-content: center;
`;

export const PubliLabel = styled.p`
  width: 100%;
  height: auto;
  font-weight: 700;
  margin-bottom: 5px;
  color: black;
  font-family: var(--font-raleway);

  @media (max-width: 1065px) {
    width: 300px;
    font-size: 0.9rem;
    font-weight: 800;
  }
`;

export const DescriptionLabel = styled.p`
  width: 100%;
  height: auto;
  font-weight: 600;
  font-family: var(--font-raleway);
  margin-bottom: 10px;
  color: black;

  @media (max-width: 1065px) {
    width: 300px;
    font-size: 14px;
  }
`;

export const IconDiv = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: end;
  margin: 20px 0px;
`;
