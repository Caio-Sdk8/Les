import { useState } from "react";
import {
  Button,
  Container,
  Field,
  FormContainer,
  Input,
  Label,
  SubTitle,
} from "./style";
import { Form, useNavigate } from "react-router-dom";
import { Title } from "chart.js";
import { Main } from "../Cadastro/style";

const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/loja");
  };

  return (
    <Main>
      <Container>
        <FormContainer>
          <Form>
            <SubTitle>Área do Administrador</SubTitle>

            <Label>E-mail</Label>
            <Input type="email" placeholder="Digite seu e-mail" />

            <Field>
              <Label>Senha</Label>
              <Input type={"password"} placeholder="Digite a senha" />
            </Field>

            <Button type="submit" onClick={handleSubmit}>
              Entrar
            </Button>
          </Form>
        </FormContainer>
      </Container>
    </Main>
  );
};

export default LoginForm;
