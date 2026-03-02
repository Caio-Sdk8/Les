import { DivTitle, Main, SubTitle, SubtitleContainer } from "../Cadastro/style";
import { NavBar } from "../../components/NavBar/NavBar";
import { ContainerPage } from "./sryle";
import ProdutosGrafico from "../../components/Grafico/Grafico";
import { useState } from "react";

export default function Grafico() {
  const [produtoSelecionado, setProdutoSelecionado] = useState("Dipirona");

  return (
    <Main>
      <DivTitle>
        <SubtitleContainer>
          <SubTitle>Gráfico</SubTitle>
        </SubtitleContainer>
        <NavBar />
      </DivTitle>
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
    </Main>
  );
}
