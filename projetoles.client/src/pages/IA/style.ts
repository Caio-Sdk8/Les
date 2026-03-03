import styled from "styled-components";

export const Container = styled.div`
  height: 74vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  color: var(--color-text);
`;

export const InputContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 12px;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
`;

export const InputAI = styled.input`
  width: 100%;
  height: var(--control-height);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 0 14px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #6a006a;
    box-shadow: 0 0 0 3px rgba(106, 0, 106, 0.1);
    background-color: #fff;
  }
`;
