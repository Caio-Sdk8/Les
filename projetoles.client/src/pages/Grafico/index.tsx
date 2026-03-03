import { ContainerPage } from "./sryle";
import ProdutosGrafico from "../../components/Grafico/Grafico";
import { useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";

export default function Grafico() {
  const [produtoSelecionado, setProdutoSelecionado] = useState("Dipirona");

  return (
    <AppShell title="Gráfico">
      <ContainerPage>
        <select
          onChange={(e) => setProdutoSelecionado(e.target.value)}
          style={{ height: "50px", outline: "none" }}
        >
          <option value="Dipirona">Dipirona</option>
          <option value="Amoxicilina">Amoxicilina</option>
        </select>

        <ProdutosGrafico produtoSelecionado={produtoSelecionado} />
      </ContainerPage>
    </AppShell>
  );
}
