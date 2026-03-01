import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import ListagemCliente from "../pages/ListagemCliente";
import Edicao from "../pages/EditarCliente";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/clientes" element={<ListagemCliente />} />
        <Route path="/editarUsuario" element={<Edicao />} />
      </Routes>
    </BrowserRouter>
  );
}
