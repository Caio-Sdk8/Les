import { ItemsContainer, NavItems } from "./style";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/authService";

export const NavBar = () => {
  const navigate = useNavigate();
  const isStaff = authService.hasAnyRole("Admin", "Employee");
  const isAdmin = authService.hasRole("Admin");

  return (
    <ItemsContainer>
      <NavItems onClick={() => navigate("/clientes")}>Clientes</NavItems>
      <NavItems onClick={() => navigate("/loja")}>Loja</NavItems>
      <NavItems onClick={() => navigate("/carrinho")}>Carrinho</NavItems>
      <NavItems onClick={() => navigate("/IA")}>Recomendação</NavItems>
      <NavItems onClick={() => navigate("/grafico")}>Gráfico</NavItems>
      {isStaff && (
        <NavItems onClick={() => navigate("/estoque")}>Estoque</NavItems>
      )}
      <NavItems onClick={() => navigate("/transacao")}>Transações</NavItems>
      {isAdmin && (
        <NavItems onClick={() => navigate("/avaliacao-receitas")}>Receitas</NavItems>
      )}
    </ItemsContainer>
  );
};
