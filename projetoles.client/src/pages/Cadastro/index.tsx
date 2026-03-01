import { useNavigate } from "react-router-dom";
import { Container } from "../../components/Header/style";
import {
  BodyData,
  ButtonDiv,
  DataContainer,
  DivLabel,
  DivSeparator,
  InputSing,
  InputWrapper,
  Label,
  Main,
  NextButton,
  SubTitle,
  SubtitleContainer,
} from "./style";

export default function Cadastro() {
  const navigate = useNavigate();

  const handleSalvar = () => {
    navigate("/clientes");
  };

  return (
    <Main>
      <Container>
        <SubtitleContainer>
          <SubTitle>Cadastro do Usuário</SubTitle>
        </SubtitleContainer>
      </Container>

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

          <SubTitle>Senha</SubTitle>

          <InputWrapper>
            <DivLabel>
              <Label>Senha</Label>
            </DivLabel>

            <InputSing placeholder="Digite a senha" type="password" />
          </InputWrapper>

          <SubTitle>Endereço de cobrança</SubTitle>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>CEP</Label>
              </DivLabel>

              <InputSing placeholder="Digite o CEP" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Rua</Label>
              </DivLabel>

              <InputSing placeholder="Digite a rua" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Número</Label>
              </DivLabel>

              <InputSing placeholder="Digite o número" />
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
                <Label>Estado</Label>
              </DivLabel>

              <InputSing placeholder="Digite o Estado" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Cidade</Label>
              </DivLabel>

              <InputSing placeholder="Digite a cidade" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Residência</Label>
              </DivLabel>

              <InputSing placeholder="Digite tipo de  residência" />
            </InputWrapper>
            <InputWrapper style={{ height: "auto" }}>
              <DivLabel>
                <Label>Tipo Logradouro</Label>
              </DivLabel>

              <InputSing placeholder="Digite tipo de  logradouro" />
            </InputWrapper>
          </DivSeparator>

          <InputWrapper style={{ height: "auto" }}>
            <DivLabel>
              <Label>Observações</Label>
            </DivLabel>

            <InputSing placeholder="Digite a Observação" />
          </InputWrapper>

          <SubTitle>Endereço de entrega</SubTitle>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>CEP</Label>
              </DivLabel>

              <InputSing placeholder="Digite o CEP" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Rua</Label>
              </DivLabel>

              <InputSing placeholder="Digite a rua" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Número</Label>
              </DivLabel>

              <InputSing placeholder="Digite o número" />
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
                <Label>Estado</Label>
              </DivLabel>

              <InputSing placeholder="Digite o Estado" />
            </InputWrapper>
            <InputWrapper>
              <DivLabel>
                <Label>Cidade</Label>
              </DivLabel>

              <InputSing placeholder="Digite a cidade" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Tipo de Residência</Label>
              </DivLabel>

              <InputSing placeholder="Digite tipo de  residência" />
            </InputWrapper>
            <InputWrapper style={{ height: "auto" }}>
              <DivLabel>
                <Label>Tipo Logradouro</Label>
              </DivLabel>

              <InputSing placeholder="Digite tipo de  logradouro" />
            </InputWrapper>
          </DivSeparator>

          <InputWrapper style={{ height: "auto" }}>
            <DivLabel>
              <Label>Observações</Label>
            </DivLabel>

            <InputSing placeholder="Digite a Observação" />
          </InputWrapper>

          <ButtonDiv>
            <NextButton onClick={handleSalvar}>Salvar</NextButton>
          </ButtonDiv>
        </BodyData>
      </DataContainer>
    </Main>
  );
}
