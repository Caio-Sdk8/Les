import { useNavigate } from "react-router-dom";
import Logo from "../../assets/LogoPharma.png";
import Cadeado from "../../assets/Senha.png";
import Email from "../../assets/Email.png";
import {
  Button,
  Container,
  ContainerInput,
  Field,
  Form,
  FormContainer,
  Icon,
  Input,
  Label,
  Main,
  SingButton,
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
            <TitleForm>
              <img
                src={Logo}
                alt="Logo"
                style={{
                  width: "302px",
                  height: "158px",
                }}
              />
            </TitleForm>

            <SubTitle>Login</SubTitle>

            <Label>E-mail</Label>
            <ContainerInput>
              <Icon src={Email} alt="email" />
              <Input type="email" placeholder="Digite seu e-mail" />
            </ContainerInput>

            <Label>Senha</Label>
            <ContainerInput>
              <Icon
                src={Cadeado}
                alt="cadeado"
                style={{ width: "26px", height: "26px" }}
              />
              <Input type={"password"} placeholder="Digite a senha" />
            </ContainerInput>

            <Button type="submit" onClick={handleSubmit}>
              Entrar
            </Button>
            <SingButton type="submit" onClick={handleSubmit}>
              Cadastrar
            </SingButton>
          </Form>
        </FormContainer>
      </Container>
    </Main>
  );
};

export default Login;
