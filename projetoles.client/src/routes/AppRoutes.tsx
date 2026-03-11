import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import ListagemCliente from "../pages/ListagemCliente";
import Edicao from "../pages/EditarCliente";
import Transacao from "../pages/Transacao";
import Loja from "../pages/Loja/Loja";
import Carrinho from "../pages/Carrinho";
import IA from "../pages/IA";
import Grafico from "../pages/Grafico";
import LoginForm from "../pages/Login/index";
import PrivateRoute from "../components/PrivateRoute";
import EdicaoEndereco from "../pages/EditarEndereco";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Área do cliente (qualquer usuário autenticado) */}
        <Route
          path="/loja"
          element={
            <PrivateRoute>
              <Loja />
            </PrivateRoute>
          }
        />
        <Route
          path="/carrinho"
          element={
            <PrivateRoute>
              <Carrinho />
            </PrivateRoute>
          }
        />
        <Route
          path="/IA"
          element={
            <PrivateRoute>
              <IA />
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

        {/* Somente Admin */}
        <Route
          path="/transacao"
          element={
            <PrivateRoute roles={["Admin"]}>
              <Transacao />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
