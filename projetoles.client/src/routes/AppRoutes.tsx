import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cadastro from "../pages/Cadastro";
import ListagemCliente from "../pages/ListagemCliente";
import Edicao from "../pages/EditarCliente";
import Transacao from "../pages/Transacao";
import Loja from "../pages/Loja/Loja";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cadastro />} />
        <Route path="/clientes" element={<ListagemCliente />} />
        <Route path="/editarUsuario" element={<Edicao />} />
        <Route path="/transacao" element={<Transacao />} />
        <Route path="/loja" element={<Loja />} />
      </Routes>
    </BrowserRouter>
  );
}
