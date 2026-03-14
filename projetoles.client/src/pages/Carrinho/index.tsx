import { useNavigate } from "react-router-dom";
import {
  AlertText,
  CartItem,
  CartItemInfo,
  CartItemMeta,
  CartItemsSection,
  CartLayout,
  CartTitle,
  CheckoutCard,
  FieldGroup,
  FieldLabel,
  FieldSelect,
  FormGrid,
  HeroCard,
  HeroDescription,
  HeroTitle,
  InlineHint,
  InlineValue,
  PaymentSplitCard,
  PrimaryButton,
  ProductImage,
  ProductThumb,
  SectionCard,
  SummaryCard,
  SummaryDivider,
  SummaryHeader,
  SummaryRow,
  SecondaryButton,
  TotalValue,
  TwoCardsGrid,
} from "./style";
import { useState } from "react";
import ModalCartao from "../../components/Modals/Cartão";
import produtos from "../../mock/produtos";
import QuantitySelector from "../../components/Quantidade/Quantidade";
import { AppShell } from "../../components/AppShell/AppShell";
import { cartoesMock } from "../../mock/cartao";
import { enderecosMock } from "../../mock/endereco";

export default function Carrinho() {
  const [modalCartao, setModalCartao] = useState(false);
  const navigate = useNavigate();
  const cartProducts = produtos.slice(0, 2);
  const availableCards = cartoesMock.slice(0, 4);
  const [quantities, setQuantities] = useState<Record<number, number>>(
    () =>
      cartProducts.reduce(
        (acc, product) => ({ ...acc, [product.id]: 1 }),
        {} as Record<number, number>
      )
  );
  const [paymentType, setPaymentType] = useState("");
  const [addressId, setAddressId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [singleCardId, setSingleCardId] = useState("");
  const [firstCardId, setFirstCardId] = useState("");
  const [secondCardId, setSecondCardId] = useState("");
  const [firstCardAmount, setFirstCardAmount] = useState(0);
  const [secondCardAmount, setSecondCardAmount] = useState(0);

  const handleSalvar = () => {
    navigate("/loja");
  };

  const updateQuantity = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const subtotal = cartProducts.reduce(
    (total, product) => total + product.valor * (quantities[product.id] ?? 1),
    0
  );
  const shipping = subtotal >= 80 ? 0 : 8.9;
  const couponDiscount = coupon === "semana10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - couponDiscount;

  const splitSum = firstCardAmount + secondCardAmount;
  const isTwoCards = paymentType === "credito2";
  const isOneCard = paymentType === "credito1";
  const isPixOrDebit = paymentType === "pix" || paymentType === "debito";

  const twoCardsAreValid =
    firstCardId.length > 0 &&
    secondCardId.length > 0 &&
    firstCardId !== secondCardId &&
    firstCardAmount > 0 &&
    secondCardAmount > 0 &&
    Math.abs(splitSum - total) < 0.01;

  const checkoutIsValid =
    addressId.length > 0 &&
    paymentType.length > 0 &&
    (isPixOrDebit ||
      (isOneCard && singleCardId.length > 0) ||
      (isTwoCards && twoCardsAreValid));

  const splitHelperText =
    paymentType === "credito2" && Math.abs(splitSum - total) >= 0.01
      ? `A soma dos cartões deve ser ${formatCurrency(total)}.`
      : "";

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatCardLabel = (cardId: string) => {
    const selected = availableCards.find((card) => String(card.id) === cardId);
    if (!selected) return "-";
    const cardFinal = String(1200 + selected.id).slice(-4);
    return `${selected.bandeira.toUpperCase()} •••• ${cardFinal}`;
  };

  const setSplitByFirstCard = (value: number) => {
    const normalized = Number.isNaN(value) ? 0 : Math.max(0, value);
    setFirstCardAmount(normalized);
    setSecondCardAmount(Math.max(0, Number((total - normalized).toFixed(2))));
  };

  const setSplitBySecondCard = (value: number) => {
    const normalized = Number.isNaN(value) ? 0 : Math.max(0, value);
    setSecondCardAmount(normalized);
    setFirstCardAmount(Math.max(0, Number((total - normalized).toFixed(2))));
  };

  return (
    <AppShell title="Carrinho">
      <HeroCard>
        <HeroTitle>Revise seus itens antes de finalizar</HeroTitle>
        <HeroDescription>
          Confira produtos, endereço de entrega e forma de pagamento em um
          fluxo mais rápido e organizado.
        </HeroDescription>
      </HeroCard>

      <CartLayout>
        <CheckoutCard>
          <SectionCard>
            <CartTitle>Dados do pedido</CartTitle>
            <FormGrid>
              <FieldGroup>
                <FieldLabel>Forma de pagamento</FieldLabel>
                <FieldSelect
                  value={paymentType}
                  onChange={(event) => {
                    const selected = event.target.value;
                    setPaymentType(selected);

                    if (selected === "credito2") {
                      const half = Number((total / 2).toFixed(2));
                      setFirstCardAmount(half);
                      setSecondCardAmount(Number((total - half).toFixed(2)));
                    }
                  }}
                >
                  <option value="" disabled>
                    Selecione a forma de pagamento
                  </option>
                  <option value="credito1">Cartão de crédito (1 cartão)</option>
                  <option value="credito2">Cartão de crédito (2 cartões)</option>
                  <option value="debito">Cartão de débito</option>
                  <option value="pix">PIX</option>
                </FieldSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Endereço</FieldLabel>
                <FieldSelect
                  value={addressId}
                  onChange={(event) => setAddressId(event.target.value)}
                >
                  <option value="" disabled>
                    Selecione o endereço
                  </option>
                  {enderecosMock.map((address) => (
                    <option key={address.id} value={String(address.id)}>
                      {address.apelido ?? `${address.cidade} - ${address.estado}`} • {" "}
                      {address.cep}
                    </option>
                  ))}
                </FieldSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Cupom</FieldLabel>
                <FieldSelect
                  value={coupon}
                  onChange={(event) => setCoupon(event.target.value)}
                >
                  <option value="" disabled>
                    Selecione um cupom
                  </option>
                  <option value="sem">Sem cupom</option>
                  <option value="semana10">SEMANA10</option>
                  <option value="fretegratis">FRETEGRATIS</option>
                </FieldSelect>
              </FieldGroup>

              {isOneCard && (
                <FieldGroup>
                  <FieldLabel>Cartão cadastrado</FieldLabel>
                  <FieldSelect
                    value={singleCardId}
                    onChange={(event) => setSingleCardId(event.target.value)}
                  >
                    <option value="" disabled>
                      Selecione um cartão
                    </option>
                    {availableCards.map((card) => (
                      <option key={card.id} value={String(card.id)}>
                        {card.bandeira.toUpperCase()} •••• {String(1200 + card.id).slice(-4)}
                      </option>
                    ))}
                  </FieldSelect>
                </FieldGroup>
              )}
            </FormGrid>

            {isTwoCards && (
              <PaymentSplitCard>
                <TwoCardsGrid>
                  <FieldGroup>
                    <FieldLabel>Cartão 1</FieldLabel>
                    <FieldSelect
                      value={firstCardId}
                      onChange={(event) => setFirstCardId(event.target.value)}
                    >
                      <option value="" disabled>
                        Selecione o primeiro cartão
                      </option>
                      {availableCards.map((card) => (
                        <option key={card.id} value={String(card.id)}>
                          {card.bandeira.toUpperCase()} •••• {String(1200 + card.id).slice(-4)}
                        </option>
                      ))}
                    </FieldSelect>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Valor no cartão 1</FieldLabel>
                    <FieldSelect
                      as="input"
                      type="number"
                      min={0}
                      step="0.01"
                      value={Number.isNaN(firstCardAmount) ? 0 : firstCardAmount}
                      onChange={(event) =>
                        setSplitByFirstCard(Number(event.target.value))
                      }
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Cartão 2</FieldLabel>
                    <FieldSelect
                      value={secondCardId}
                      onChange={(event) => setSecondCardId(event.target.value)}
                    >
                      <option value="" disabled>
                        Selecione o segundo cartão
                      </option>
                      {availableCards.map((card) => (
                        <option key={card.id} value={String(card.id)}>
                          {card.bandeira.toUpperCase()} •••• {String(1200 + card.id).slice(-4)}
                        </option>
                      ))}
                    </FieldSelect>
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Valor no cartão 2</FieldLabel>
                    <FieldSelect
                      as="input"
                      type="number"
                      min={0}
                      step="0.01"
                      value={Number.isNaN(secondCardAmount) ? 0 : secondCardAmount}
                      onChange={(event) =>
                        setSplitBySecondCard(Number(event.target.value))
                      }
                    />
                  </FieldGroup>
                </TwoCardsGrid>
                <InlineHint>
                  Regra de negócio: na opção com dois cartões, a soma dos
                  valores deve fechar exatamente o total do pedido.
                </InlineHint>
                {splitHelperText && <AlertText>{splitHelperText}</AlertText>}
              </PaymentSplitCard>
            )}
          </SectionCard>

          <SectionCard>
            <CartTitle>Produtos no carrinho</CartTitle>
            <CartItemsSection>
              {cartProducts.map((product) => (
                <CartItem key={product.id}>
                  <ProductThumb>
                    <ProductImage src={product.imagem} alt={product.nome} />
                  </ProductThumb>

                  <CartItemInfo>
                    <strong>{product.nome}</strong>
                    <CartItemMeta>{product.composicao}</CartItemMeta>
                    <CartItemMeta>{formatCurrency(product.valor)}</CartItemMeta>
                  </CartItemInfo>

                  <QuantitySelector
                    value={quantities[product.id] ?? 1}
                    min={1}
                    max={10}
                    onChange={(value) => updateQuantity(product.id, value)}
                  />
                </CartItem>
              ))}
            </CartItemsSection>
          </SectionCard>
        </CheckoutCard>

        <SummaryCard>
          <SummaryHeader>Resumo</SummaryHeader>
          <SummaryRow>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Entrega</span>
            <span>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Desconto</span>
            <span>{couponDiscount > 0 ? `- ${formatCurrency(couponDiscount)}` : "-"}</span>
          </SummaryRow>
          <SummaryDivider />
          <SummaryRow>
            <strong>Total</strong>
            <TotalValue>{formatCurrency(total)}</TotalValue>
          </SummaryRow>

          {isOneCard && singleCardId && (
            <SummaryRow>
              <InlineHint>Pagamento</InlineHint>
              <InlineValue>{formatCardLabel(singleCardId)}</InlineValue>
            </SummaryRow>
          )}

          {isTwoCards && (
            <>
              <SummaryRow>
                <InlineHint>Cartão 1</InlineHint>
                <InlineValue>
                  {formatCardLabel(firstCardId)} • {formatCurrency(firstCardAmount)}
                </InlineValue>
              </SummaryRow>
              <SummaryRow>
                <InlineHint>Cartão 2</InlineHint>
                <InlineValue>
                  {formatCardLabel(secondCardId)} • {formatCurrency(secondCardAmount)}
                </InlineValue>
              </SummaryRow>
            </>
          )}

          {!checkoutIsValid && (
            <AlertText>
              Preencha pagamento e endereço para finalizar o pedido.
            </AlertText>
          )}

          <SecondaryButton type="button" onClick={() => setModalCartao(true)}>
            Cadastrar cartão
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSalvar}
            disabled={!checkoutIsValid}
          >
            Finalizar pedido
          </PrimaryButton>
        </SummaryCard>
      </CartLayout>

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
