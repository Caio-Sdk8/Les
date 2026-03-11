import styled from "styled-components";

export const Title = styled.h1`
  color: var(--color-text);
  font-family: var(--font-raleway), sans-serif;
  width: 450px;
  font-size: 20px;
  margin-top: 20px;
`;

interface Props {
  preferido: boolean;
}

export const ButtonPrefer = styled.button<Props>`
  width: 120px;
  height: 30px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 12px;
  transition: 0.5s all ease;

  background-color: ${({ preferido }) => (preferido ? "#6A0DAD33" : "#E5E5E5")};

  color: ${({ preferido }) => (preferido ? "#6A0DAD" : "#6B6B6B")};

  &:hover {
    scale: 0.95;
  }
`;
