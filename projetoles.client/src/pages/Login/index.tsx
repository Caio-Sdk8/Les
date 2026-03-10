import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/LogoPharma.png";
import Cadeado from "../../assets/Senha.png";
import Email from "../../assets/Email.png";
import { authService } from "../../services/auth/authService";
import {
  Button,
  Container,
  ContainerInput,
  ErrorMessage,
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const roles = data.user.roles;

      if (roles.includes("Admin") || roles.includes("Employee")) {
        navigate("/clientes");
      } else {
        navigate("/loja");
      }
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/cadastro");
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
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </ContainerInput>

            <Label>Senha</Label>
            <ContainerInput>
              <Icon
                src={Cadeado}
                alt="cadeado"
                style={{ width: "26px", height: "26px" }}
              />
              <Input
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </ContainerInput>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <SingButton type="button" onClick={handleRegister}>
              Cadastrar
            </SingButton>
          </Form>
        </FormContainer>
      </Container>
    </Main>
  );
};

export default Login;
