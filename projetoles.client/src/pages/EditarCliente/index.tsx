import { useNavigate } from "react-router-dom";
import {
  BodyData,
  ButtonDiv,
  DataContainer,
  DivLabel,
  DivSeparator,
  DivTitle,
  InputSing,
  InputWrapper,
  Label,
  Main,
  NextButton,
  SubTitle,
  SubtitleContainer,
} from "../Cadastro/style";
import { EditButton } from "./style";
import { useState } from "react";
import ModalCartao from "../../components/Modals/Cartão";
import ModalEndereco from "../../components/Modals/Endereco";
import ModalSenha from "../../components/Modals/Senha";
import { NavBar } from "../../components/NavBar/NavBar";

export default function Edicao() {
  const [modalCartao, setModalCartao] = useState(false);
  const [modalEndereco, setModalEndereco] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const navigate = useNavigate();

  const handleSalvar = () => {
    navigate("/clientes");
  };

  return (
    <Main>
      <DivTitle>
        <SubtitleContainer>
          <SubTitle>Edição</SubTitle>
        </SubtitleContainer>
        <NavBar />
      </DivTitle>

      <DataContainer>
        <BodyData>
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Gênero</Label>
              </DivLabel>

              <InputSing placeholder="Digite o gênero" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Nome</Label>
              </DivLabel>

              <InputSing placeholder="Digite o nome" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Data de nascimento</Label>
              </DivLabel>

              <InputSing placeholder="00/00/0000" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>CPF</Label>
              </DivLabel>

              <InputSing placeholder="Digite o cpf" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Email</Label>
              </DivLabel>

              <InputSing placeholder="Digite o e-mail" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Telefone</Label>
              </DivLabel>

              <InputSing placeholder="Digite o telefone" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>DDD</Label>
              </DivLabel>

              <InputSing placeholder="Digite o DDD do telefone" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Telefone</Label>
              </DivLabel>

              <InputSing placeholder="Digite o tipo de telefone" />
            </InputWrapper>
          </DivSeparator>

          <ButtonDiv>
            <EditButton onClick={() => setModalSenha(true)}>
              Alterar Senha
            </EditButton>
            <EditButton onClick={() => setModalEndereco(true)}>
              Cadastrar Endereço
            </EditButton>
            <EditButton onClick={() => setModalCartao(true)}>
              Cadastrar Cartão
            </EditButton>
            <NextButton onClick={handleSalvar}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>

      {modalCartao && (
        <ModalCartao
          next={() => setModalCartao(false)}
          title="Cadastro de cartão"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalCartao(false)}
        />
      )}

      {modalSenha && (
        <ModalSenha
          next={() => setModalSenha(false)}
          title="Alterar Senha"
          button="Alterar"
          button2="Cancelar"
          back={() => setModalSenha(false)}
        />
      )}

      {modalEndereco && (
        <ModalEndereco
          next={() => setModalEndereco(false)}
          title="Cadastro de endereço"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalEndereco(false)}
          width="700px"
        />
      )}
    </Main>
  );
}
