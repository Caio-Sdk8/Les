import { useLocation, useNavigate } from "react-router-dom";
import {
  BodyData,
  ButtonDiv,
  DataContainer,
  DivLabel,
  DivSeparator,
  InputSing,
  InputWrapper,
  Label,
  NextButton,
} from "../Cadastro/style";
import { useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import EnderecoTable from "../../components/Tables/EnderecoTable";

export default function EdicaoEndereco() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state as {
    addressNickname?: string;
    addressCity?: string;
  } | null) ?? { addressNickname: "", addressCity: "" };

  const nickname = state.addressNickname?.trim();
  const city = state.addressCity?.trim();

  const pageTitle = nickname
    ? `Edição de Endereço - ${nickname}`
    : city
      ? `Edição de Endereço - ${city}`
      : "Edição de Endereço";

  const handleSalvar = () => {
    navigate("/editarUsuario");
  };

  return (
    <AppShell title={pageTitle}>
      <DataContainer>
        <BodyData>
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Tipo de residência</Label>
              </DivLabel>

              <InputSing placeholder="Selecione o tipo de residência" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Logradouro</Label>
              </DivLabel>

              <InputSing placeholder="Selecione o tipo de logradouro" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Número</Label>
              </DivLabel>

              <InputSing placeholder="Digite o número da casa" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Bairro</Label>
              </DivLabel>

              <InputSing placeholder="Digite o Bairro" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Cidade</Label>
              </DivLabel>

              <InputSing placeholder="Digite o nome da cidade" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Estado</Label>
              </DivLabel>

              <InputSing placeholder="Digite o estado" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>País</Label>
              </DivLabel>

              <InputSing placeholder="Digite o País" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Observações</Label>
              </DivLabel>

              <InputSing placeholder="Digite as observações do endereço" />
            </InputWrapper>
          </DivSeparator>

          <EnderecoTable />

          <ButtonDiv>
            <NextButton onClick={handleSalvar}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>
    </AppShell>
  );
}
