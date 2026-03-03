import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 24px;
  background-color: var(--color-bg);
`;

export const FormContainer = styled.form`
  background: var(--color-bg);
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: var(--color-text);
  gap: 32px;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 0 24px;
  color: var(--color-text);
  font-family: var(--font-raleway), sans-serif;
  width: 450px;
  font-size: 32px;
  margin-bottom: 32px;

  @media (max-width: 1065px) {
    font-size: 1.4rem;
    width: 300px;
  }
`;

export const SubTitle = styled.p`
  margin-top: 20px;
  width: 100%;
  font-weight: 700;
  font-size: 24px;
  color: var(--color-primary);
  text-align: center;

  @media (max-width: 1065px) {
    width: 300px;
    font-size: 0.95rem;
  }
`;

export const Label = styled.p`
  display: flex;
  justify-content: start;
  width: 90%;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-raleway), sans-serif;
  margin-top: 0.6rem;
  margin-bottom: 5px;
  color: var(--color-muted);

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const Input = styled.input`
  border: 1px solid var(--color-border);
  background: white;
  border-radius: var(--radius-sm);

  padding: 0 14px;
  width: 498px;
  min-height: var(--control-height);
  margin-top: 8px;
  margin-bottom: 10px;

  font-size: 0.9rem;
  font-weight: 400;
  font-family: var(--font-openSans, sans-serif);
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: var(--color-primary);
  }

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const Button = styled.button`
  width: 90%;
  height: var(--control-height);
  margin: 20px 8px 10px 8px;
  background-color: var(--color-primary);
  font-family: var(--font-openSans), sans-serif;
  font-weight: 700;
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-strong);
  }
`;

export const ErrorMessage = styled.h3`
  width: 90%;
  font-size: 14px;
  font-family: var(--font-openSans), sans-serif;
  font-weight: 400;
  color: red;

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const RegisterText = styled.h3`
  width: 450px;
  font-size: 10pt;
  font-weight: 500;
  color: var(--color-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-decoration: none;
  margin-top: 1rem;

  span {
    color: var(--color-muted);
  }

  label {
    font-size: 10pt;
    font-weight: 500;
    color: var(--color-muted);
    user-select: none;
  }

  input {
    height: 15px;
    width: 15px;
  }

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const CheckboxLabel = styled.label``;

export const Field = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;

  .icon {
    position: absolute;
    right: 40px;
    bottom: 24px;
    cursor: pointer;
  }
`;

export const Form = styled.div`
  min-height: 442px;
  height: auto;
  width: 546px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 20px 15px;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
`;

export const TitleForm = styled.h1`
  width: 100%;
  height: auto;
  font-size: 30px;
  font-weight: 800;
  color: var(--color-primary);
  text-align: center;
`;
