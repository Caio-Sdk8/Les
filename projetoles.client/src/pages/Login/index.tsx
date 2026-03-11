import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/LogoPharma.png";
import Cadeado from "../../assets/Senha.png";
import Email from "../../assets/Email.png";
import { authService } from "../../services/auth/authService";
import {
  Button,
  ContainerInput,
  Divider,
  ErrorMessage,
  FormSubtitle,
  FormTitle,
  FormWrapper,
  Icon,
  Input,
  Label,
  LeftHeadline,
  LeftPanel,
  LeftTagline,
  Main,
  RightPanel,
  SingButton,
  TogglePassword,
} from "./style";

const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit(e as unknown as React.FormEvent);
  };

  return (
    <Main>
      <LeftPanel>
        <LeftHeadline>Sua saúde,<br />na palma da mão.</LeftHeadline>
        <LeftTagline>
          Medicamentos, vitaminas e produtos de saúde com entrega rápida e
          segurança direto na sua porta.
        </LeftTagline>
      </LeftPanel>

      <RightPanel>
        <FormWrapper>
          <img
            src={Logo}
            alt="PharmaPro"
            style={{ width: 200, marginBottom: 24, alignSelf: "center" }}
          />
          <FormTitle>Bem-vindo de volta</FormTitle>
          <FormSubtitle>Entre para ver seus pedidos e continuar comprando</FormSubtitle>

          <Label htmlFor="email">E-mail</Label>
          <ContainerInput>
            <Icon src={Email} alt="" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
          </ContainerInput>

          <Label htmlFor="password">Senha</Label>
          <ContainerInput>
            <Icon src={Cadeado} alt="" style={{ width: 20, height: 20 }} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
            <TogglePassword
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff /> : <EyeOpen />}
            </TogglePassword>
          </ContainerInput>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <Divider>ou</Divider>

          <SingButton type="button" onClick={() => navigate("/cadastro")}>
            Criar conta
          </SingButton>
        </FormWrapper>
      </RightPanel>
    </Main>
  );
};

export default Login;
