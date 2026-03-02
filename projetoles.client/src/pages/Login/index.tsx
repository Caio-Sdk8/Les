import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Field,
  Form,
  FormContainer,
  Input,
  Label,
  Main,
  SubTitle,
  TitleForm,
} from "./style";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/loja");
  };

  return (
    <Main>
      <Container>
        <FormContainer>
          <Form>
            <TitleForm>Pharma Laís</TitleForm>

            <SubTitle>Login</SubTitle>

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

export default Login;
