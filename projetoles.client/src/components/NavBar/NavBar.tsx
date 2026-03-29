import { useEffect, useState } from "react";
import { Badge, ItemsContainer, NavItems } from "./style";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import { transactionService } from "../../services/transactions/transactionService";

export const NavBar = () => {
  const navigate = useNavigate();
  const isStaff = authService.hasAnyRole("Admin", "Employee");
  const isAdmin = authService.hasRole("Admin");
  const [pendingAfterSalesCount, setPendingAfterSalesCount] = useState(0);

  useEffect(() => {
    if (!isStaff) return;

    let cancelled = false;

    const loadPendingAfterSales = async () => {
      try {
        const items = await transactionService.getAfterSalesRequests({ status: "PENDENTE" });
        if (!cancelled) setPendingAfterSalesCount(items.length);
      } catch {
        if (!cancelled) setPendingAfterSalesCount(0);
      }
    };

    void loadPendingAfterSales();
    return () => {
      cancelled = true;
    };
  }, [isStaff]);

  return (
    <ItemsContainer>
      <NavItems onClick={() => navigate("/loja")}>Loja</NavItems>
      <NavItems onClick={() => navigate("/carrinho")}>Carrinho</NavItems>
      <NavItems onClick={() => navigate("/IA")}>Recomendação</NavItems>

      {isStaff && (
        <NavItems onClick={() => navigate("/clientes")}>Clientes</NavItems>
      )}

      {isStaff && (
        <NavItems onClick={() => navigate("/grafico")}>Gráfico</NavItems>
      )}

      {isStaff && (
        <NavItems onClick={() => navigate("/estoque")}>Estoque</NavItems>
      )}

      <NavItems onClick={() => navigate("/pedidos")}>Pedidos</NavItems>

      {isAdmin && (
        <NavItems onClick={() => navigate("/avaliacao-receitas")}>Receitas</NavItems>
      )}

      {isStaff && (
        <NavItems onClick={() => navigate("/avaliacao-trocas-devolucoes")}>Trocas/Devoluções
          {pendingAfterSalesCount > 0 && <Badge>{pendingAfterSalesCount}</Badge>}
        </NavItems>
      )}
    </ItemsContainer>
  );
};
