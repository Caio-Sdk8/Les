import { useNavigate } from "react-router-dom";
import {
  AlertText,
  CartEmptyState,
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
  RemoveItemButton,
  SectionCard,
  SummaryCard,
  SummaryDivider,
  SummaryHeader,
  InteractionAlert,
  InteractionAlertTitle,
  InteractionList,
  InteractionMeta,
  RulePanel,
  RuleText,
  SummaryRow,
  SecondaryButton,
  TotalValue,
  TwoCardsGrid,
  UploadInput,
} from "./style";
import { useEffect, useMemo, useState } from "react";
import ModalCartao from "../../components/Modals/Cartão";
import ModalEndereco from "../../components/Modals/Endereco";
import QuantitySelector from "../../components/Quantidade/Quantidade";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  PrescriptionType,
  productService,
  type DrugInteractionAlert,
  type ProductSummary,
} from "../../services/catalog/productService";
import { cartService } from "../../services/cart/cartService";
import {
  transactionService,
  type CheckoutAddressOption,
  type CheckoutCardOption,
  type ExchangeCreditEntry,
} from "../../services/transactions/transactionService";
import { authService } from "../../services/auth/authService";

type CartLine = ProductSummary & { quantity: number };

export default function Carrinho() {
  const [modalCartao, setModalCartao] = useState(false);
  const [modalEndereco, setModalEndereco] = useState(false);
  const navigate = useNavigate();
  const userUuid = authService.getUser()?.uuid;
  const [catalog, setCatalog] = useState<ProductSummary[]>([]);
  const [availableAddresses, setAvailableAddresses] = useState<
    CheckoutAddressOption[]
  >([]);
  const [availableCards, setAvailableCards] = useState<CheckoutCardOption[]>(
    [],
  );
  const [exchangeCreditAvailable, setExchangeCreditAvailable] = useState(0);
  const [exchangeCreditEntries, setExchangeCreditEntries] = useState<
    ExchangeCreditEntry[]
  >([]);
  const [checkoutDataError, setCheckoutDataError] = useState("");
  const [cartUuids, setCartUuids] = useState(() => cartService.getItems());
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [interactionAlerts, setInteractionAlerts] = useState<
    DrugInteractionAlert[]
  >([]);
  const [interactionLoading, setInteractionLoading] = useState(false);
  const [interactionError, setInteractionError] = useState("");

  const [paymentType, setPaymentType] = useState("");
  const [addressId, setAddressId] = useState("");
  const [coupon, setCoupon] = useState("");
  const [singleCardId, setSingleCardId] = useState("");
  const [firstCardId, setFirstCardId] = useState("");
  const [secondCardId, setSecondCardId] = useState("");
  const [firstCardAmount, setFirstCardAmount] = useState(0);
  const [secondCardAmount, setSecondCardAmount] = useState(0);
  const [prescriptionFileName, setPrescriptionFileName] = useState("");
  const [prescriptionFileContentType, setPrescriptionFileContentType] =
    useState("");
  const [prescriptionFileBase64, setPrescriptionFileBase64] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadCheckoutData = async () => {
    try {
      setCheckoutDataError("");
      const [addresses, cards, exchangeCredit] = await Promise.all([
        transactionService.getMyCheckoutAddresses(),
        transactionService.getMyCheckoutCards(),
        transactionService.getMyExchangeCreditBalance(),
      ]);

      const activeAddresses = addresses.filter((address) => address.isActive);
      const activeCards = cards.filter((card) => card.isActive);

      setAvailableAddresses(activeAddresses);
      setAvailableCards(activeCards);
      setExchangeCreditAvailable(Math.max(0, Number(exchangeCredit.availableCredit ?? 0)));
      setExchangeCreditEntries(exchangeCredit.entries ?? []);

      if (!addressId && activeAddresses.length > 0) {
        setAddressId(activeAddresses[0].uuid);
      }

      const preferredCard = activeCards.find((card) => card.isPreferred);
      const fallbackCard = activeCards[0];
      const defaultCardId = (preferredCard ?? fallbackCard)?.uuid ?? "";

      if (!singleCardId && defaultCardId) {
        setSingleCardId(defaultCardId);
      }

      if (!firstCardId && defaultCardId) {
        setFirstCardId(defaultCardId);
      }

      if (!secondCardId && activeCards.length > 1) {
        const second = activeCards.find((card) => card.uuid !== defaultCardId);
        if (second) {
          setSecondCardId(second.uuid);
        }
      }
    } catch {
      setAvailableAddresses([]);
      setAvailableCards([]);
      setExchangeCreditAvailable(0);
      setExchangeCreditEntries([]);
      setCheckoutDataError(
        "Não foi possível carregar seus endereços e cartões cadastrados.",
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadCatalog = async () => {
      try {
        let page = 1;
        const pageSize = 100;
        const all: ProductSummary[] = [];

        while (true) {
          const result = await productService.getProducts({
            page,
            pageSize,
            isActive: true,
          });
          all.push(...result.items);
          if (!result.hasNextPage) break;
          page += 1;
        }

        if (!cancelled) setCatalog(all);
      } catch {
        if (!cancelled) setCatalog([]);
      }
    };

    loadCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (exchangeCreditAvailable <= 0 && coupon === "troca") {
      setCoupon("sem");
    }
  }, [exchangeCreditAvailable, coupon]);

  useEffect(() => {
    let cancelled = false;

    void loadCheckoutData();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const fromStorage = cartService.getItems();
    setCartUuids(fromStorage);
    setQuantities(
      fromStorage.reduce(
        (acc, item) => ({ ...acc, [item.productUuid]: item.quantity }),
        {} as Record<string, number>,
      ),
    );
  }, []);

  const cartProducts = useMemo<CartLine[]>(() => {
    if (catalog.length === 0 || cartUuids.length === 0) return [];

    const byUuid = new Map(catalog.map((product) => [product.uuid, product]));

    return cartUuids
      .map((item) => {
        const found = byUuid.get(item.productUuid);
        if (!found) return null;

        return {
          ...found,
          quantity: quantities[item.productUuid] ?? item.quantity,
        };
      })
      .filter((item): item is CartLine => item !== null);
  }, [catalog, cartUuids, quantities]);

  useEffect(() => {
    const uniqueUuids = Array.from(
      new Set(cartProducts.map((item) => item.uuid)),
    );

    if (uniqueUuids.length < 2) {
      setInteractionAlerts([]);
      setInteractionError("");
      return;
    }

    let cancelled = false;
    const run = async () => {
      setInteractionLoading(true);
      setInteractionError("");
      try {
        const result = await productService.checkDrugInteractions(uniqueUuids);
        if (!cancelled) setInteractionAlerts(result);
      } catch {
        if (!cancelled) {
          setInteractionAlerts([]);
          setInteractionError(
            "Não foi possível validar interações medicamentosas no momento.",
          );
        }
      } finally {
        if (!cancelled) setInteractionLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [cartProducts]);

  const handleSalvar = async () => {
    if (cartProducts.length === 0) return;

    const selectedAddress = availableAddresses.find(
      (address) => address.uuid === addressId,
    );
    const addressLabel = selectedAddress
      ? `${selectedAddress.label || `${selectedAddress.city}/${selectedAddress.state}`} - ${selectedAddress.zipCode}`
      : "Endereço selecionado no checkout";

    const singleCardLabel =
      paymentType === "credito1" && singleCardId
        ? formatCardLabel(singleCardId)
        : undefined;

    try {
      setIsSubmitting(true);

      await transactionService.checkout({
        items: cartProducts.map((product) => ({
          productUuid: product.uuid,
          quantity: quantities[product.uuid] ?? product.quantity,
        })),
        paymentType,
        addressLabel,
        addressUuid: addressId || undefined,
        couponCode: effectiveCoupon,
        singleCardLabel,
        singleCardUuid:
          paymentType === "credito1" ? singleCardId || undefined : undefined,
        splitPayment:
          paymentType === "credito2"
            ? {
                firstCardLabel: formatCardLabel(firstCardId),
                secondCardLabel: formatCardLabel(secondCardId),
                firstAmount: firstCardAmount,
                secondAmount: secondCardAmount,
                firstCardUuid: firstCardId || undefined,
                secondCardUuid: secondCardId || undefined,
              }
            : undefined,
        prescriptionFileName: prescriptionFileName || undefined,
        prescriptionFileContentType: prescriptionFileContentType || undefined,
        prescriptionFileBase64: prescriptionFileBase64 || undefined,
      });

      cartService.clear();
      setCartUuids([]);
      navigate("/loja");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuantity = (productUuid: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [productUuid]: value }));
    cartService.updateQuantity(productUuid, value);
    setCartUuids(cartService.getItems());
  };

  const removeFromCart = (productUuid: string) => {
    cartService.removeItem(productUuid);
    setCartUuids(cartService.getItems());
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[productUuid];
      return next;
    });
  };

  const subtotal = cartProducts.reduce(
    (total, product) =>
      total +
      product.salePrice * (quantities[product.uuid] ?? product.quantity),
    0,
  );
  const shipping = subtotal >= 80 ? 0 : 8.9;
  const normalizedCoupon = (coupon || "").trim().toLowerCase();
  const effectiveCoupon =
    normalizedCoupon === "" || normalizedCoupon === "sem"
      ? exchangeCreditAvailable > 0
        ? "troca"
        : "sem"
      : normalizedCoupon;

  const couponDiscount =
    effectiveCoupon === "semana10"
      ? subtotal * 0.1
      : effectiveCoupon === "fretegratis"
        ? shipping
        : effectiveCoupon === "troca"
          ? Math.min(exchangeCreditAvailable, subtotal + shipping)
          : 0;
  const total = subtotal + shipping - couponDiscount;
  const hasCoupon = effectiveCoupon !== "" && effectiveCoupon !== "sem";

  const splitSum = firstCardAmount + secondCardAmount;
  const isTwoCards = paymentType === "credito2";
  const isOneCard = paymentType === "credito1";
  const isPixOrDebit = paymentType === "pix" || paymentType === "debito";
  const requiresPrescriptionValidation = cartProducts.some(
    (product) =>
      product.prescriptionType === PrescriptionType.TarjaVermelha ||
      product.prescriptionType === PrescriptionType.TarjaPreta,
  );
  const prescriptionIsValid =
    !requiresPrescriptionValidation || prescriptionFileName.length > 0;
  const minCardAmount = hasCoupon ? 0.01 : 10;

  const twoCardsAreValid =
    firstCardId.length > 0 &&
    secondCardId.length > 0 &&
    firstCardId !== secondCardId &&
    firstCardAmount >= minCardAmount &&
    secondCardAmount >= minCardAmount &&
    Math.abs(splitSum - total) < 0.01;

  const oneCardIsValid =
    !isOneCard || (singleCardId.length > 0 && (hasCoupon || total >= 10));

  const checkoutIsValid =
    cartProducts.length > 0 &&
    addressId.length > 0 &&
    paymentType.length > 0 &&
    prescriptionIsValid &&
    (isPixOrDebit || oneCardIsValid || (isTwoCards && twoCardsAreValid));

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const exchangeCreditOptionLabel =
    exchangeCreditAvailable > 0
      ? `CREDITO TROCA (${formatCurrency(exchangeCreditAvailable)})`
      : "CREDITO TROCA";

  const exchangeCreditOriginsLabel = exchangeCreditEntries
    .slice(0, 3)
    .map((entry) => `${entry.transactionCode} (${formatCurrency(entry.remainingAmount)})`)
    .join(" • ");

  const splitHelperText =
    paymentType === "credito2" && Math.abs(splitSum - total) >= 0.01
      ? `A soma dos cartões deve ser ${formatCurrency(total)}.`
      : paymentType === "credito2" &&
          !hasCoupon &&
          (firstCardAmount < 10 || secondCardAmount < 10)
        ? "Sem cupom aplicado, cada cartão deve ter no mínimo R$ 10,00."
        : "";

  const formatCardLabel = (cardId: string) => {
    const selected = availableCards.find((card) => card.uuid === cardId);
    if (!selected) return "-";
    return `${selected.cardBrandName.toUpperCase()} ${selected.maskedCardNumber}`;
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

  const handlePrescriptionUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      setPrescriptionFileName("");
      setPrescriptionFileContentType("");
      setPrescriptionFileBase64("");
      return;
    }

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = String(reader.result ?? "");
          const payload = result.includes(",") ? result.split(",")[1] : "";
          resolve(payload);
        };
        reader.onerror = () =>
          reject(new Error("Falha ao ler arquivo de receita."));
        reader.readAsDataURL(file);
      });

      setPrescriptionFileName(file.name);
      setPrescriptionFileContentType(file.type || "application/octet-stream");
      setPrescriptionFileBase64(base64);
    } catch {
      setPrescriptionFileName("");
      setPrescriptionFileContentType("");
      setPrescriptionFileBase64("");
    }
  };

  return (
    <AppShell title="Carrinho">
      <HeroCard>
        <HeroTitle>Revise seus itens antes de finalizar</HeroTitle>
        <HeroDescription>
          Confira produtos, endereço de entrega e forma de pagamento em um fluxo
          mais rápido e organizado.
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
                  <option value="credito2">
                    Cartão de crédito (2 cartões)
                  </option>
                  <option value="debito">Cartão de débito</option>
                  <option value="pix">PIX</option>
                </FieldSelect>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Endereço</FieldLabel>
                <FieldSelect
                  value={addressId}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (value === "add-address") {
                      setModalEndereco(true);
                    } else {
                      setAddressId(value);
                    }
                  }}
                >
                  <option value="" disabled>
                    Selecione o endereço
                  </option>
                  <option value="add-address">Adicionar Endereço</option>
                  {availableAddresses.map((address) => (
                    <option key={address.uuid} value={address.uuid}>
                      {address.label || `${address.city} - ${address.state}`} •{" "}
                      {address.zipCode}
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
                  {exchangeCreditAvailable > 0 && (
                    <option value="troca">{exchangeCreditOptionLabel}</option>
                  )}
                  <option value="semana10">SEMANA10</option>
                  <option value="fretegratis">FRETEGRATIS</option>
                </FieldSelect>
                {exchangeCreditAvailable > 0 && (
                  <InlineHint>
                    Saldo de troca disponível: {formatCurrency(exchangeCreditAvailable)}.
                  </InlineHint>
                )}
                {exchangeCreditOriginsLabel && (
                  <InlineHint>
                    Origem do crédito: {exchangeCreditOriginsLabel}
                    {exchangeCreditEntries.length > 3 ? " ..." : ""}
                  </InlineHint>
                )}
                {effectiveCoupon === "troca" && (
                  <InlineHint>
                    Crédito de troca aplicado: até {formatCurrency(exchangeCreditAvailable)} no total.
                  </InlineHint>
                )}
                {coupon === "semana10" && (
                  <InlineHint>
                    RN0033: apenas um cupom promocional por compra.
                  </InlineHint>
                )}
              </FieldGroup>

              {isOneCard && (
                <FieldGroup>
                  <FieldLabel>Cartão cadastrado</FieldLabel>
                  <FieldSelect
                    value={singleCardId}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value === "add-card") {
                        setModalCartao(true);
                      } else {
                        setSingleCardId(value);
                      }
                    }}
                  >
                    <option value="" disabled>
                      Selecione um cartão
                    </option>
                    <option value="add-card">Adicionar Cartão</option>
                    {availableCards.map((card) => (
                      <option key={card.uuid} value={card.uuid}>
                        {card.cardBrandName.toUpperCase()}{" "}
                        {card.maskedCardNumber}
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
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "add-card") {
                          setModalCartao(true);
                        } else {
                          setFirstCardId(value);
                        }
                      }}
                    >
                      <option value="" disabled>
                        Selecione o primeiro cartão
                      </option>
                      <option value="add-card">Adicionar Cartão</option>
                      {availableCards.map((card) => (
                        <option key={card.uuid} value={card.uuid}>
                          {card.cardBrandName.toUpperCase()}{" "}
                          {card.maskedCardNumber}
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
                      value={
                        Number.isNaN(firstCardAmount) ? 0 : firstCardAmount
                      }
                      onChange={(event) =>
                        setSplitByFirstCard(Number(event.target.value))
                      }
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel>Cartão 2</FieldLabel>
                    <FieldSelect
                      value={secondCardId}
                      onChange={(event) => {
                        const value = event.target.value;
                        if (value === "add-card") {
                          setModalCartao(true);
                        } else {
                          setSecondCardId(value);
                        }
                      }}
                    >
                      <option value="" disabled>
                        Selecione o segundo cartão
                      </option>
                      <option value="add-card">Adicionar Cartão</option>
                      {availableCards.map((card) => (
                        <option key={card.uuid} value={card.uuid}>
                          {card.cardBrandName.toUpperCase()}{" "}
                          {card.maskedCardNumber}
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
                      value={
                        Number.isNaN(secondCardAmount) ? 0 : secondCardAmount
                      }
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

          {requiresPrescriptionValidation && (
            <SectionCard>
              <CartTitle>Envio de receita</CartTitle>

              <RulePanel>
                <RuleText>
                  Este pedido possui medicamento sob prescrição. Envie a receita
                  para análise farmacêutica após a finalização do pedido.
                </RuleText>

                <FieldGroup>
                  <FieldLabel>Upload da receita (imagem ou PDF)</FieldLabel>
                  <UploadInput
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                  />
                  {prescriptionFileName && (
                    <InlineHint>
                      Arquivo selecionado: {prescriptionFileName}
                    </InlineHint>
                  )}
                </FieldGroup>
              </RulePanel>
            </SectionCard>
          )}

          <SectionCard>
            <CartTitle>Produtos no carrinho</CartTitle>
            <CartItemsSection>
              {cartProducts.length === 0 && (
                <CartEmptyState>
                  Seu carrinho está vazio no momento. Volte para a loja e
                  adicione alguns produtos.
                </CartEmptyState>
              )}

              {cartProducts.map((product) => (
                <CartItem key={product.uuid}>
                  <ProductThumb>
                    <ProductImage
                      src={
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=320&h=320&fit=crop&q=80"
                      }
                      alt={product.name}
                    />
                  </ProductThumb>

                  <CartItemInfo>
                    <strong>{product.name}</strong>
                    <CartItemMeta>
                      {product.activePrinciple ||
                        "Princípio ativo não informado"}
                    </CartItemMeta>
                    <CartItemMeta>
                      {formatCurrency(product.salePrice)}
                    </CartItemMeta>
                  </CartItemInfo>

                  <QuantitySelector
                    key={`${product.uuid}-${quantities[product.uuid] ?? 1}`}
                    value={quantities[product.uuid] ?? 1}
                    min={1}
                    max={10}
                    onChange={(value) => updateQuantity(product.uuid, value)}
                  />

                  <RemoveItemButton
                    type="button"
                    onClick={() => removeFromCart(product.uuid)}
                  >
                    Remover
                  </RemoveItemButton>
                </CartItem>
              ))}
            </CartItemsSection>
          </SectionCard>

          <SectionCard>
            <CartTitle>Interações medicamentosas (automático)</CartTitle>

            {interactionLoading && (
              <AlertText>
                Validando interações entre os itens do carrinho...
              </AlertText>
            )}
            {interactionError && <AlertText>{interactionError}</AlertText>}

            {!interactionLoading &&
              !interactionError &&
              interactionAlerts.length === 0 &&
              cartProducts.length >= 2 && (
                <CartEmptyState>
                  Nenhuma interação medicamentosa relevante encontrada entre os
                  itens atuais.
                </CartEmptyState>
              )}

            {!interactionLoading && interactionAlerts.length > 0 && (
              <InteractionList>
                {interactionAlerts.map((alert, index) => (
                  <InteractionAlert
                    key={`${alert.productAUuid}-${alert.productBUuid}-${index}`}
                    $severity={alert.severityLevel}
                  >
                    <InteractionAlertTitle>
                      {alert.severityLevel >= 3
                        ? "ALTA"
                        : alert.severityLevel === 2
                          ? "MÉDIA"
                          : "BAIXA"}
                    </InteractionAlertTitle>
                    <InteractionMeta>
                      {alert.productAName} + {alert.productBName}
                    </InteractionMeta>
                    <InteractionMeta>{alert.description}</InteractionMeta>
                  </InteractionAlert>
                ))}
              </InteractionList>
            )}
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
            <span>
              {couponDiscount > 0 ? `- ${formatCurrency(couponDiscount)}` : "-"}
            </span>
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
                  {formatCardLabel(firstCardId)} •{" "}
                  {formatCurrency(firstCardAmount)}
                </InlineValue>
              </SummaryRow>
              <SummaryRow>
                <InlineHint>Cartão 2</InlineHint>
                <InlineValue>
                  {formatCardLabel(secondCardId)} •{" "}
                  {formatCurrency(secondCardAmount)}
                </InlineValue>
              </SummaryRow>
            </>
          )}

          {!checkoutIsValid && (
            <AlertText>
              Preencha pagamento e endereço para finalizar o pedido.
            </AlertText>
          )}

          {checkoutDataError && <AlertText>{checkoutDataError}</AlertText>}

          {isOneCard && !hasCoupon && total > 0 && total < 10 && (
            <AlertText>
              Sem cupom aplicado, compras no cartão único exigem valor mínimo de
              R$ 10,00.
            </AlertText>
          )}

          {requiresPrescriptionValidation && !prescriptionIsValid && (
            <AlertText>
              Anexe a receita para finalizar o pedido com medicamento sob
              prescrição.
            </AlertText>
          )}

          <SecondaryButton type="button" onClick={() => setModalCartao(true)}>
            Cadastrar cartão
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={handleSalvar}
            disabled={!checkoutIsValid || isSubmitting}
          >
            {isSubmitting ? "Finalizando..." : "Finalizar pedido"}
          </PrimaryButton>
        </SummaryCard>
      </CartLayout>

      {modalCartao && (
        <ModalCartao
          uuid={userUuid || ""}
          useMyEndpoint
          next={() => {
            loadCheckoutData();
            setModalCartao(false);
          }}
          title="Cadastro de cartão"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalCartao(false)}
        />
      )}

      {modalEndereco && (
        <ModalEndereco
          uuid={userUuid || ""}
          next={() => {
            loadCheckoutData();
            setModalEndereco(false);
          }}
          title="Cadastro de endereço"
          button="Cadastrar"
          button2="Cancelar"
          back={() => setModalEndereco(false)}
        />
      )}
    </AppShell>
  );
}
