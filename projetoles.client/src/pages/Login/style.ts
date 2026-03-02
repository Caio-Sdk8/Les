import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 24px;
  background-color: purple;
`;

export const FormContainer = styled.form`
  background: white;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  color: white;
  gap: 122px;
`;

export const Title = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 0 24px;
  color: black;
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
  margin-top: 50px;
  width: 450px;
  font-weight: 700;
  font-size: 25px;
  color: purple;
  text-align: center;

  @media (max-width: 1065px) {
    width: 300px;
    font-size: 0.9rem;
  }
`;

export const Label = styled.p`
  display: flex;
  justify-content: start;
  width: 90%;
  font-size: 16px;
  font-weight: 400;
  font-family: var(--font-raleway), sans-serif;
  margin-top: 1rem;
  margin-bottom: 5px;
  color: black;

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const Input = styled.input`
  border: 1px solid gray;
  background: white;
  border-radius: 5px;

  padding: 0 45px 0 20px;
  width: 498px;
  min-height: 56px;
  margin-top: 8px;
  margin-bottom: 16px;

  font-size: 0.9rem;
  font-weight: 400;
  font-family: var(--font-openSans, sans-serif);
  color: black;
  outline: none;

  &::placeholder {
    color: gray;
  }

  @media (max-width: 1065px) {
    width: 300px;
  }
`;

export const Button = styled.button`
  width: 90%;
  height: 48px;
  margin: 44px 8px 10px 8px;
  background-color: purple;
  font-family: var(--font-openSans), sans-serif;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid purple;
    color: purple;
    background-color: transparent;
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
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  text-decoration: none;
  margin-top: 1rem;

  span {
    color: white;
  }

  label {
    font-size: 10pt;
    font-weight: 500;
    color: white;
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
    bottom: 30px;
    cursor: pointer;
  }
`;
export const Form = styled.div`
  min-height: 442px;
  height: auto;
  width: 546px;
  display: flex;
  flex-direction: column;
  border: 1px solid purple;
  background-color: #f5f5f5;
  border-radius: 16px;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 90px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`;

export const TitleForm = styled.h1`
  width: 100%;
  height: auto;
  font-size: 35px;
  font-weight: 800;
  color: purple;
  text-align: center;
`;
