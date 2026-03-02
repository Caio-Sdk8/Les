import {
  DivLabel,
  DivTitle,
  InputSing,
  InputWrapper,
  Label,
  Main,
  SubTitle,
  SubtitleContainer,
} from "../Cadastro/style";
import { NavBar } from "../../components/NavBar/NavBar";
import ProdutosPorCategoriaGrafico from "../../components/Grafico/Grafico";
import { ContainerPage } from "./sryle";

export default function Grafico() {
  return (
    <Main>
      <DivTitle>
        <SubtitleContainer>
          <SubTitle>Gráfico</SubTitle>
        </SubtitleContainer>
        <NavBar />
      </DivTitle>
      <ContainerPage>
        <InputWrapper>
          <DivLabel>
            <Label>Filtro</Label>
          </DivLabel>

          <InputSing placeholder="Pesquise aqui" />
        </InputWrapper>

        <ProdutosPorCategoriaGrafico />
      </ContainerPage>
    </Main>
  );
}
