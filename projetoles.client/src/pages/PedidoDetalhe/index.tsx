import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/AppShell/AppShell";
import { authService } from "../../services/auth/authService";
import {
  type AfterSalesType,
  transactionService,
  type OrderDetail,
  type TransactionItem,
} from "../../services/transactions/transactionService";
import {
  ActionButton,
  AlertText,
  BackButton,
  Body,
  Card,
  Empty,
  Field,
  Grid,
  Header,
  ItemCard,
  ItemList,
  ItemMeta,
  ItemName,
  Label,
  Layout,
  SelectInput,
  StatusBadge,
  Subtitle,
  SummaryLine,
  SummaryTotal,
  Title,
  UploadInput,
  Value,
  ValueText,
} from "./style";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

function extractOrderCode(order: TransactionItem, fallbackUuid?: string) {
  const fromDescription = order.description?.split(" - ")?.[0]?.trim();
  if (fromDescription && fromDescription.startsWith("PED-")) return fromDescription;
  if (fallbackUuid) return `PEDIDO ${fallbackUuid.slice(0, 8).toUpperCase()}`;
  return "Pedido";
}

function statusLabel(status: string) {
  switch ((status ?? "").toUpperCase()) {
    case "AGUARDANDO_ANALISE_RECEITA":
      return "Aguardando análise da receita";
    case "AGUARDANDO_REENVIO_RECEITA":
      return "Aguardando novo envio da receita";
    case "TROCA_PENDENTE":
      return "Troca pendente";
    case "DEVOLUCAO_PENDENTE":
      return "Devolução pendente";
    case "TROCA_APROVADA":
      return "Troca aprovada";
    case "TROCA_REPROVADA":
      return "Troca reprovada";
    case "DEVOLUCAO_APROVADA":
      return "Devolução aprovada";
    case "DEVOLUCAO_REPROVADA":
      return "Devolução reprovada";
    case "EM_PROCESSAMENTO":
      return "Em processamento";
    case "APROVADA":
      return "Aprovada";
    case "REPROVADA":
      return "Reprovada";
    default:
      return status || "Não informado";
  }
}

export default function PedidoDetalhe() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [resubmissionError, setResubmissionError] = useState("");
  const [afterSalesError, setAfterSalesError] = useState("");
  const [afterSalesLoading, setAfterSalesLoading] = useState(false);
  const [afterSalesType, setAfterSalesType] = useState<AfterSalesType>("TROCA");
  const [afterSalesReason, setAfterSalesReason] = useState("");
  const [selectedAfterSalesItems, setSelectedAfterSalesItems] = useState<
    Record<string, { selected: boolean; quantity: number; max: number; name: string }>
  >({});
  const [resubmissionNote, setResubmissionNote] = useState("");
  const [prescriptionFileName, setPrescriptionFileName] = useState("");
  const [prescriptionFileContentType, setPrescriptionFileContentType] = useState("");
  const [prescriptionFileBase64, setPrescriptionFileBase64] = useState("");

  const isCustomer = authService.hasRole("Customer");
  const order = (location.state as { order?: TransactionItem } | null)?.order;
  const orderUuid = params.uuid ?? order?.uuid ?? "";

  const loadOrderDetail = async () => {
    if (!orderUuid) return;

    setIsLoading(true);
    try {
      const data = await transactionService.getOrderDetail(orderUuid);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadOrderDetail();
  }, [orderUuid]);

  useEffect(() => {
    if (!detail) {
      setSelectedAfterSalesItems({});
      return;
    }

    const next = detail.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.productUuid]: {
          selected: false,
          quantity: 1,
          max: item.quantity,
          name: item.productName,
        },
      }),
      {} as Record<string, { selected: boolean; quantity: number; max: number; name: string }>
    );

    setSelectedAfterSalesItems(next);
  }, [detail]);

  const orderCode = useMemo(() => {
    if (detail?.transactionCode) return detail.transactionCode;
    if (order) return extractOrderCode(order, orderUuid);
    return "Pedido";
  }, [detail, order, orderUuid]);

  const displayStatus = detail?.status ?? order?.status ?? "";
  const displayDate = detail?.createdAt ?? "Não informado";
  const displayTotal = detail?.total ?? order?.amount ?? 0;
  const displayDescription = detail?.description ?? order?.description ?? "Sem descrição do pedido.";
  const canResubmitPrescription =
    isCustomer &&
    detail?.status === "AGUARDANDO_REENVIO_RECEITA";
  const canCreateAfterSalesRequest =
    isCustomer &&
    detail &&
    detail.afterSalesRequests.filter((request) => request.status === "PENDENTE").length === 0;

  const selectedItemsForAfterSales = Object.entries(selectedAfterSalesItems)
    .filter(([, config]) => config.selected)
    .map(([productUuid, config]) => ({
      productUuid,
      quantity: config.quantity,
      max: config.max,
      name: config.name,
    }));

  const statusAfterSalesLabel = (status: string) => {
    switch ((status ?? "").toUpperCase()) {
      case "PENDENTE":
        return "Pendente";
      case "APROVADA":
        return "Aprovada";
      case "REPROVADA":
        return "Reprovada";
      default:
        return status || "Não informado";
    }
  };

  const typeAfterSalesLabel = (type: string) => {
    return type === "DEVOLUCAO" ? "Devolução" : "Troca";
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        reader.onerror = () => reject(new Error("Falha ao ler arquivo de receita."));
        reader.readAsDataURL(file);
      });

      setPrescriptionFileName(file.name);
      setPrescriptionFileContentType(file.type || "application/octet-stream");
      setPrescriptionFileBase64(base64);
      setResubmissionError("");
    } catch {
      setResubmissionError("Não foi possível ler o arquivo da receita.");
      setPrescriptionFileName("");
      setPrescriptionFileContentType("");
      setPrescriptionFileBase64("");
    }
  };

  const handleResubmitPrescription = async () => {
    if (!orderUuid) return;

    if (!prescriptionFileName || !prescriptionFileContentType || !prescriptionFileBase64) {
      setResubmissionError("Selecione um arquivo válido de receita para reenviar.");
      return;
    }

    setSubmitLoading(true);
    setResubmissionError("");

    try {
      await transactionService.resubmitPrescription(orderUuid, {
        prescriptionFileName,
        prescriptionFileContentType,
        prescriptionFileBase64,
        note: resubmissionNote,
      });

      setPrescriptionFileName("");
      setPrescriptionFileContentType("");
      setPrescriptionFileBase64("");
      setResubmissionNote("");
      await loadOrderDetail();
    } catch {
      setResubmissionError("Não foi possível reenviar a receita. Tente novamente.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateAfterSalesRequest = async () => {
    if (!orderUuid) return;

    if ((afterSalesReason ?? "").trim().length < 8) {
      setAfterSalesError("Descreva o motivo com pelo menos 8 caracteres.");
      return;
    }

    if (selectedItemsForAfterSales.length === 0) {
      setAfterSalesError("Selecione ao menos um item para troca/devolução.");
      return;
    }

    setAfterSalesError("");
    setAfterSalesLoading(true);

    try {
      await transactionService.createAfterSalesRequest(orderUuid, {
        type: afterSalesType,
        reason: afterSalesReason,
        items: selectedItemsForAfterSales.map((item) => ({
          productUuid: item.productUuid,
          quantity: item.quantity,
        })),
      });

      setAfterSalesReason("");
      await loadOrderDetail();
    } catch {
      setAfterSalesError("Não foi possível abrir solicitação de troca/devolução.");
    } finally {
      setAfterSalesLoading(false);
    }
  };

  const toggleAfterSalesItem = (productUuid: string, checked: boolean) => {
    setSelectedAfterSalesItems((current) => ({
      ...current,
      [productUuid]: {
        ...current[productUuid],
        selected: checked,
      },
    }));
  };

  const setAfterSalesItemQuantity = (productUuid: string, value: number) => {
    setSelectedAfterSalesItems((current) => {
      const currentItem = current[productUuid];
      if (!currentItem) return current;

      const normalized = Number.isNaN(value)
        ? 1
        : Math.max(1, Math.min(currentItem.max, Math.floor(value)));

      return {
        ...current,
        [productUuid]: {
          ...currentItem,
          quantity: normalized,
        },
      };
    });
  };

  if (!orderUuid) {
    return (
      <AppShell title="Detalhes do Pedido">
        <Empty>
          Não foi possível abrir os detalhes deste pedido. Volte para a listagem e abra novamente.
        </Empty>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell title="Detalhes do Pedido">
        <Empty>Carregando pedido...</Empty>
      </AppShell>
    );
  }

  if (!detail && !order) {
    return (
      <AppShell title="Detalhes do Pedido">
        <Empty>Não foi possível carregar este pedido.</Empty>
      </AppShell>
    );
  }

  return (
    <AppShell title="Detalhes do Pedido">
      <Layout>
        <Card>
          <Header>
            <Title>{orderCode}</Title>
            <Subtitle>Resumo simples do pedido selecionado.</Subtitle>
          </Header>

          <Body>
            <Grid>
              <Field>
                <Label>Código</Label>
                <Value>{orderCode}</Value>
              </Field>

              <Field>
                <Label>Status</Label>
                <StatusBadge $status={displayStatus}>{statusLabel(displayStatus)}</StatusBadge>
              </Field>

              <Field>
                <Label>Data</Label>
                <Value>{displayDate}</Value>
              </Field>

              <Field>
                <Label>Valor total</Label>
                <Value>{formatCurrency(displayTotal)}</Value>
              </Field>
            </Grid>

            <Field>
              <Label>Resumo</Label>
              <ValueText>{displayDescription}</ValueText>
            </Field>

            {detail && (
              <>
                <Field>
                  <Label>Itens do pedido</Label>
                  {detail.items.length === 0 && <ValueText>Nenhum item detalhado disponível.</ValueText>}

                  {detail.items.length > 0 && (
                    <ItemList>
                      {detail.items.map((item) => (
                        <ItemCard key={`${item.productUuid}-${item.productName}`}>
                          <ItemName>{item.productName}</ItemName>
                          <ItemMeta>
                            {item.quantity}x {formatCurrency(item.unitPrice)} • {item.categoryName}
                          </ItemMeta>
                          <ItemMeta>
                            Classificação: {item.prescriptionLabel} • Total item: {formatCurrency(item.totalPrice)}
                          </ItemMeta>
                        </ItemCard>
                      ))}
                    </ItemList>
                  )}
                </Field>

                <Field>
                  <Label>Pagamento e entrega</Label>
                  <ValueText>Pagamento: {detail.paymentType}</ValueText>
                  <ValueText>Endereço: {detail.addressLabel}</ValueText>
                  <ValueText>Cupom: {detail.couponCode || "sem"}</ValueText>
                </Field>
              </>
            )}
          </Body>
        </Card>

        <Card>
          <Header>
            <Title>Resumo financeiro</Title>
            <Subtitle>Valores consolidados do pedido.</Subtitle>
          </Header>

          <Body>
            {detail ? (
              <>
                <SummaryLine>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(detail.subtotal)}</strong>
                </SummaryLine>
                <SummaryLine>
                  <span>Frete</span>
                  <strong>{formatCurrency(detail.shipping)}</strong>
                </SummaryLine>
                <SummaryLine>
                  <span>Desconto</span>
                  <strong>{formatCurrency(detail.discount)}</strong>
                </SummaryLine>
                <SummaryTotal>
                  <span>Total</span>
                  <strong>{formatCurrency(detail.total)}</strong>
                </SummaryTotal>
              </>
            ) : (
              <SummaryTotal>
                <span>Total</span>
                <strong>{formatCurrency(displayTotal)}</strong>
              </SummaryTotal>
            )}

            <BackButton type="button" onClick={() => navigate("/pedidos")}>Voltar para pedidos</BackButton>
          </Body>
        </Card>

        {detail?.prescriptionFileName && (
          <Card>
            <Header>
              <Title>Receita</Title>
              <Subtitle>Informações da receita vinculada ao pedido.</Subtitle>
            </Header>

            <Body>
              <ValueText>Arquivo atual: {detail.prescriptionFileName}</ValueText>
              <ValueText>Status da receita: {detail.prescriptionStatus}</ValueText>
              {detail.prescriptionNote && <ValueText>Observação: {detail.prescriptionNote}</ValueText>}

              {canResubmitPrescription && (
                <>
                  <Field>
                    <Label>Novo arquivo de receita</Label>
                    <UploadInput type="file" accept="image/*,.pdf" onChange={handleFileUpload} />
                    {prescriptionFileName && <ValueText>Arquivo selecionado: {prescriptionFileName}</ValueText>}
                  </Field>

                  <Field>
                    <Label>Observação do cliente (opcional)</Label>
                    <UploadInput
                      as="textarea"
                      value={resubmissionNote}
                      onChange={(event) => setResubmissionNote(event.target.value)}
                    />
                  </Field>

                  {resubmissionError && <AlertText>{resubmissionError}</AlertText>}

                  <ActionButton type="button" onClick={handleResubmitPrescription} disabled={submitLoading}>
                    {submitLoading ? "Reenviando..." : "Reenviar receita"}
                  </ActionButton>
                </>
              )}
            </Body>
          </Card>
        )}

        {detail && (
          <Card>
            <Header>
              <Title>Troca e devolução</Title>
              <Subtitle>Fluxo de pós-venda com análise administrativa.</Subtitle>
            </Header>

            <Body>
              {canCreateAfterSalesRequest && (
                <>
                  <Field>
                    <Label>Tipo da solicitação</Label>
                    <SelectInput
                      value={afterSalesType}
                      onChange={(event) => setAfterSalesType(event.target.value as AfterSalesType)}
                    >
                      <option value="TROCA">Troca</option>
                      <option value="DEVOLUCAO">Devolução</option>
                    </SelectInput>
                  </Field>

                  <Field>
                    <Label>Itens da solicitação</Label>
                    <ItemList>
                      {detail.items.map((item) => {
                        const config = selectedAfterSalesItems[item.productUuid];
                        const isSelected = config?.selected ?? false;
                        const quantity = config?.quantity ?? 1;

                        return (
                          <ItemCard key={`after-sales-item-${item.productUuid}`}>
                            <ItemMeta style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(event) =>
                                  toggleAfterSalesItem(item.productUuid, event.target.checked)
                                }
                              />
                              <strong>{item.productName}</strong>
                            </ItemMeta>

                            <ItemMeta>
                              Comprado: {item.quantity} unidade(s) • Unitário: {formatCurrency(item.unitPrice)}
                            </ItemMeta>

                            {isSelected && (
                              <ItemMeta style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span>Quantidade solicitada:</span>
                                <input
                                  type="number"
                                  min={1}
                                  max={item.quantity}
                                  value={quantity}
                                  onChange={(event) =>
                                    setAfterSalesItemQuantity(item.productUuid, Number(event.target.value))
                                  }
                                  style={{
                                    width: "88px",
                                    height: "32px",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "8px",
                                    padding: "0 8px",
                                  }}
                                />
                              </ItemMeta>
                            )}
                          </ItemCard>
                        );
                      })}
                    </ItemList>
                  </Field>

                  <Field>
                    <Label>Motivo</Label>
                    <UploadInput
                      as="textarea"
                      value={afterSalesReason}
                      onChange={(event) => setAfterSalesReason(event.target.value)}
                    />
                  </Field>

                  {afterSalesError && <AlertText>{afterSalesError}</AlertText>}

                  <ActionButton
                    type="button"
                    onClick={handleCreateAfterSalesRequest}
                    disabled={afterSalesLoading}
                  >
                    {afterSalesLoading ? "Enviando..." : "Solicitar troca/devolução"}
                  </ActionButton>
                </>
              )}

              {!canCreateAfterSalesRequest && isCustomer && (
                <ValueText>Você já possui uma solicitação pendente para este pedido.</ValueText>
              )}

              <Field>
                <Label>Histórico</Label>
                {detail.afterSalesRequests.length === 0 && (
                  <ValueText>Nenhuma solicitação registrada para este pedido.</ValueText>
                )}

                {detail.afterSalesRequests.length > 0 && (
                  <ItemList>
                    {detail.afterSalesRequests.map((request) => (
                      <ItemCard key={request.requestUuid}>
                        <ItemName>
                          {typeAfterSalesLabel(request.type)} • {statusAfterSalesLabel(request.status)}
                        </ItemName>
                        <ItemMeta>Solicitado em {request.requestedAt}</ItemMeta>
                        <ItemMeta>Motivo: {request.reason}</ItemMeta>
                        {request.reviewNote && <ItemMeta>Análise: {request.reviewNote}</ItemMeta>}
                      </ItemCard>
                    ))}
                  </ItemList>
                )}
              </Field>
            </Body>
          </Card>
        )}
      </Layout>
    </AppShell>
  );
}
