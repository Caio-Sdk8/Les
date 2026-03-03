import { useNavigate } from "react-router-dom";
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
  SubTitle,
} from "../Cadastro/style";
import { useState } from "react";
import ModalCartao from "../../components/Modals/Cartão";
import { EditButton } from "../EditarCliente/style";
import { ImageWrapper } from "../Loja/style";
import produtos from "../../mock/produtos";
import { ProdDiv } from "./style";
import QuantitySelector from "../../components/Quantidade/Quantidade";
import { AppShell } from "../../components/AppShell/AppShell";

export default function Carrinho() {
  const [modalCartao, setModalCartao] = useState(false);
  const navigate = useNavigate();

  const handleSalvar = () => {
    navigate("/loja");
  };
  const [quantity, setQuantity] = useState(1);

  return (
    <AppShell title="Carrinho">

      <DataContainer>
        <BodyData>
          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Forma de Pagamento</Label>
              </DivLabel>

              <InputSing placeholder="Selecione a forma de pagamento" />
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Endereço</Label>
              </DivLabel>

              <InputSing placeholder="Selecione o endereço" />
            </InputWrapper>
          </DivSeparator>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Cupom</Label>
              </DivLabel>

              <InputSing placeholder="Selecione um cupom    " />
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>
                  Selecione ou cadastre um novo cartão no botão abaixo
                </Label>
              </DivLabel>

              <InputSing placeholder="Selecione a forma de pagamento" />
            </InputWrapper>
          </DivSeparator>

          <SubTitle>Produtos</SubTitle>
          <ProdDiv>
            <ImageWrapper>
              <img src={produtos[0].imagem} alt={produtos[0].nome} />
            </ImageWrapper>
            <QuantitySelector
              value={quantity}
              min={1}
              max={10}
              onChange={setQuantity}
            />
          </ProdDiv>
          <ButtonDiv>
            <EditButton onClick={() => setModalCartao(true)}>
              Cadastrar Cartão
            </EditButton>
            <NextButton onClick={handleSalvar}>Finalizar</NextButton>
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
    </AppShell>
  );
}
