import { ItemsContainer, NavItems } from "./style";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <ItemsContainer>
      <NavItems onClick={() => navigate("/clientes")}>Clientes</NavItems>
      <NavItems onClick={() => navigate("/loja")}>Loja</NavItems>
      <NavItems onClick={() => navigate("/carrinho")}>Carrinho</NavItems>
      <NavItems onClick={() => navigate("/IA")}>Recomendação</NavItems>
      <NavItems onClick={() => navigate("/grafico")}>Gráfico</NavItems>
      <NavItems onClick={() => navigate("/transacao")}>Transações</NavItems>
    </ItemsContainer>
  );
};
