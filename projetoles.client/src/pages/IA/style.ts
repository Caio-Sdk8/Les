import styled from "styled-components";

export const Container = styled.div`
  height: 74vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: white;
  border-top: 1px solid #ddd;
`;

export const InputAI = styled.input`
  width: 100%;
  height: 70px; /* 👈 maior */
  border-radius: 12px;
  border: 1px solid #ccc;
  padding: 0 20px;
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: purple;
  }
`;
