import styled from "styled-components";

export const EditButton = styled.button`
  width: 200px;
  height: 52px;
  margin-top: 48px;
  background-color: var(--color-primary);
  border: none;
  border-radius: 8px;
  color: white;
  border: 1px solid gray;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    background-color: var(--color-primary-hover);
  }
`;
