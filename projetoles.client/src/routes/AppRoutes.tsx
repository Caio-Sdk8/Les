import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import ListagemCliente from "../pages/ListagemCliente";
import Edicao from "../pages/EditarCliente";
import Transacao from "../pages/Transacao";
import Loja from "../pages/Loja/Loja";
import Carrinho from "../pages/Carrinho";
import Grafico from "../pages/Grafico";
import LoginForm from "../pages/Login/index";
import PrivateRoute from "../components/PrivateRoute";
import EdicaoEndereco from "../pages/EditarEndereco";
import Estoque from "../pages/Estoque";
import Produto from "../pages/Produto";
import AvaliacaoReceitas from "../pages/AvaliacaoReceitas";
import PedidoDetalhe from "../pages/PedidoDetalhe";
import AvaliacaoTrocasDevolucoes from "../pages/AvaliacaoTrocasDevolucoes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Área do cliente (somente Customer) */}
        <Route
          path="/loja"
          element={
            <PrivateRoute roles={["Customer"]}>
              <Loja />
            </PrivateRoute>
          }
        />
        <Route
          path="/produto/:uuid"
          element={
            <PrivateRoute roles={["Customer"]}>
              <Produto />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrinho"
          element={
            <PrivateRoute roles={["Customer"]}>
              <Carrinho />
            </PrivateRoute>
          }
        />
        {/* Área administrativa (Admin e Employee) */}
        <Route
          path="/clientes"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <ListagemCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarUsuario"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <Edicao />
            </PrivateRoute>
          }
        />
        <Route
          path="/editarEndereco"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <EdicaoEndereco />
            </PrivateRoute>
          }
        />
        <Route
          path="/grafico"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <Grafico />
            </PrivateRoute>
          }
        />

        {/* Estoque (Admin e Employee) */}
        <Route
          path="/estoque"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <Estoque />
            </PrivateRoute>
          }
        />

        {/* Pedidos */}
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Transacao />
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos/:uuid"
          element={
            <PrivateRoute>
              <PedidoDetalhe />
            </PrivateRoute>
          }
        />

        {/* Compatibilidade de rota antiga */}
        <Route
          path="/transacao"
          element={
            <PrivateRoute>
              <Transacao />
            </PrivateRoute>
          }
        />

        {/* Somente Admin */}
        <Route
          path="/avaliacao-receitas"
          element={
            <PrivateRoute roles={["Admin"]}>
              <AvaliacaoReceitas />
            </PrivateRoute>
          }
        />
        <Route
          path="/avaliacao-trocas-devolucoes"
          element={
            <PrivateRoute roles={["Admin", "Employee"]}>
              <AvaliacaoTrocasDevolucoes />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
