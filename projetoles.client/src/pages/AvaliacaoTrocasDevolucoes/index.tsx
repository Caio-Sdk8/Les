import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  transactionService,
  type AfterSalesRequest,
} from "../../services/transactions/transactionService";
import {
  ActionRow,
  Block,
  Body,
  Button,
  Card,
  Empty,
  FilterButton,
  FilterInput,
  Filters,
  FilterSelect,
  Header,
  Label,
  ReviewLayout,
  Row,
  Status,
  Subtitle,
  Table,
  TextArea,
  Title,
  Value,
  ValueText,
} from "./style";

function typeLabel(type: string) {
  return type === "DEVOLUCAO" ? "Devolução" : "Troca";
}

function compensationTypeLabel(type?: string | null) {
  if (!type) return "Compensação";
  if (type === "CREDITO_TROCA") return "Crédito de troca";
  if (type === "ESTORNO") return "Estorno";
  return type;
}

export default function AvaliacaoTrocasDevolucoes() {
  const [requests, setRequests] = useState<AfterSalesRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [decisionNote, setDecisionNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [requestedFrom, setRequestedFrom] = useState("");
  const [requestedTo, setRequestedTo] = useState("");

  const loadRequests = async () => {
    const items = await transactionService.getAfterSalesRequests({
      status: statusFilter || undefined,
      type: typeFilter || undefined,
      requestedFrom: requestedFrom || undefined,
      requestedTo: requestedTo || undefined,
    });
    setRequests(items);
    if (items.length > 0) {
      setSelectedId((current) => (items.some((item) => item.requestUuid === current) ? current : items[0].requestUuid));
    } else {
      setSelectedId("");
    }
  };

  useEffect(() => {
    void loadRequests();
  }, []);

  const selectedRequest = useMemo(
    () => requests.find((item) => item.requestUuid === selectedId) ?? null,
    [requests, selectedId]
  );

  const updateLocalRequest = (requestUuid: string, updater: (item: AfterSalesRequest) => AfterSalesRequest) => {
    setRequests((current) => current.map((item) => (item.requestUuid === requestUuid ? updater(item) : item)));
  };

  const handleApprove = async () => {
    if (!selectedRequest || selectedRequest.status !== "PENDENTE") return;

    await transactionService.approveAfterSalesRequest(
      selectedRequest.transactionUuid,
      selectedRequest.requestUuid,
      decisionNote
    );

    updateLocalRequest(selectedRequest.requestUuid, (item) => ({
      ...item,
      status: "APROVADA",
      reviewNote: decisionNote?.trim() || "Solicitação aprovada pela equipe administrativa.",
      reviewedAt: new Date().toLocaleString("pt-BR"),
    }));
  };

  const handleReject = async () => {
    if (!selectedRequest || selectedRequest.status !== "PENDENTE") return;

    await transactionService.rejectAfterSalesRequest(
      selectedRequest.transactionUuid,
      selectedRequest.requestUuid,
      decisionNote
    );

    updateLocalRequest(selectedRequest.requestUuid, (item) => ({
      ...item,
      status: "REPROVADA",
      reviewNote: decisionNote?.trim() || "Solicitação reprovada pela equipe administrativa.",
      reviewedAt: new Date().toLocaleString("pt-BR"),
    }));
  };

  return (
    <AppShell title="Trocas e devoluções">
      <ReviewLayout>
        <Card>
          <Header>
            <div>
              <Title>Solicitações do cliente</Title>
              <Subtitle>Pedidos de troca/devolução aguardando análise administrativa.</Subtitle>
            </div>
          </Header>

          <Filters>
            <FilterSelect value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Status (todos)</option>
              <option value="PENDENTE">Pendente</option>
              <option value="APROVADA">Aprovada</option>
              <option value="REPROVADA">Reprovada</option>
            </FilterSelect>

            <FilterSelect value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="">Tipo (todos)</option>
              <option value="TROCA">Troca</option>
              <option value="DEVOLUCAO">Devolução</option>
            </FilterSelect>

            <FilterInput
              type="date"
              value={requestedFrom}
              onChange={(event) => setRequestedFrom(event.target.value)}
            />

            <FilterInput
              type="date"
              value={requestedTo}
              onChange={(event) => setRequestedTo(event.target.value)}
            />

            <FilterButton type="button" onClick={loadRequests}>
              Filtrar
            </FilterButton>
          </Filters>

          <Table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Tipo</th>
                <th>Solicitado em</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <Row
                  key={request.requestUuid}
                  $active={request.requestUuid === selectedId}
                  onClick={() => {
                    setSelectedId(request.requestUuid);
                    setDecisionNote(request.reviewNote ?? "");
                  }}
                >
                  <td>{request.transactionCode}</td>
                  <td>{typeLabel(request.type)}</td>
                  <td>{request.requestedAt}</td>
                  <td>
                    <Status $status={request.status}>{request.status}</Status>
                  </td>
                </Row>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card>
          <Header>
            <div>
              <Title>Detalhes da análise</Title>
              <Subtitle>Revise o motivo e decida a solicitação.</Subtitle>
            </div>
            {selectedRequest && <Status $status={selectedRequest.status}>{selectedRequest.status}</Status>}
          </Header>

          {!selectedRequest && <Empty>Nenhuma solicitação selecionada.</Empty>}

          {selectedRequest && (
            <Body>
              <Block>
                <Label>Pedido</Label>
                <Value>{selectedRequest.transactionCode}</Value>
              </Block>

              <Block>
                <Label>Tipo</Label>
                <Value>{typeLabel(selectedRequest.type)}</Value>
              </Block>

              <Block>
                <Label>Motivo</Label>
                <ValueText>{selectedRequest.reason}</ValueText>
              </Block>

              <Block>
                <Label>Itens envolvidos</Label>
                {selectedRequest.items.map((item) => (
                  <ValueText key={`${selectedRequest.requestUuid}-${item.productUuid}`}>
                    {item.productName} • Quantidade: {item.quantity}
                  </ValueText>
                ))}
              </Block>

              {selectedRequest.status === "APROVADA" &&
                typeof selectedRequest.compensationAmount === "number" &&
                selectedRequest.compensationAmount > 0 && (
                  <Block>
                    <Label>{compensationTypeLabel(selectedRequest.compensationType)}</Label>
                    <Value>
                      {selectedRequest.compensationAmount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Value>
                  </Block>
                )}

              <Block>
                <Label>Parecer administrativo</Label>
                <TextArea
                  value={decisionNote}
                  placeholder="Descreva a justificativa da aprovação/reprovação"
                  onChange={(event) => setDecisionNote(event.target.value)}
                  disabled={selectedRequest.status !== "PENDENTE"}
                />
              </Block>

              {selectedRequest.status === "PENDENTE" && (
                <ActionRow>
                  <Button type="button" $tone="approve" onClick={handleApprove}>
                    Aprovar
                  </Button>
                  <Button type="button" $tone="reject" onClick={handleReject}>
                    Reprovar
                  </Button>
                </ActionRow>
              )}

              {selectedRequest.status !== "PENDENTE" && selectedRequest.reviewNote && (
                <Block>
                  <Label>Decisão registrada</Label>
                  <ValueText>{selectedRequest.reviewNote}</ValueText>
                </Block>
              )}
            </Body>
          )}
        </Card>
      </ReviewLayout>
    </AppShell>
  );
}
