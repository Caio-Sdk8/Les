import { useEffect, useState } from "react";

import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import {
  Container,
  ContainerDad,
  MainTable,
  TableContainer,
  Td,
  Th,
  Tr,
} from "../ListagemCliente/style";
import { AppShell } from "../../components/AppShell/AppShell";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/authService";
import {
  transactionService,
  type TransactionItem,
  type TransactionsPagedResponse,
} from "../../services/transactions/transactionService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);

const formatDateTime = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const extractOrderCode = (order: TransactionItem) => {
  const code = order.description?.split(" - ")?.[0]?.trim();
  if (code?.startsWith("PED-")) return code;
  if (order.uuid) return `PEDIDO ${order.uuid.slice(0, 8).toUpperCase()}`;
  return "Pedido";
};

const formatStatusLabel = (status: string) => {
  switch ((status ?? "").toUpperCase()) {
    case "AGUARDANDO_ANALISE_RECEITA":
      return "Aguardando receita";
    case "AGUARDANDO_REENVIO_RECEITA":
      return "Aguardando reenvio";
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
};

const Transacao = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<TransactionsPagedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const customerUuid = (location.state as { uuid?: string } | null)?.uuid;
  const isStaff = authService.hasAnyRole("Admin", "Employee");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const result = isStaff
          ? await transactionService.getOrders({
              page: currentPage,
              pageSize: 20,
              customerUuid,
            })
          : await transactionService.getMyOrders({
              page: currentPage,
              pageSize: 20,
            });

        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadOrders();
    return () => {
      cancelled = true;
    };
  }, [currentPage, customerUuid, isStaff]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AppShell title="Pedidos">
      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "32%" }}>PEDIDO</Th>
                  <Th style={{ width: "24%" }}>DATA</Th>
                  <Th style={{ width: "18%" }}>STATUS</Th>
                  <Th style={{ width: "16%" }}>TOTAL</Th>
                  <Th style={{ width: "10%", textAlign: "center" }}>AÇÃO</Th>
                </tr>
              </thead>

              {data?.items.map((transacao, index) => (
                <tbody key={transacao.id}>
                  <Tr $background={index % 2 === 0}>
                    <Td>
                      <p>{extractOrderCode(transacao)}</p>
                    </Td>
                    <Td>
                      <p>{formatDateTime(transacao.createdAt)}</p>
                    </Td>
                    <Td>
                      <p>{formatStatusLabel(transacao.status)}</p>
                    </Td>
                    <Td>
                      <p>{formatCurrency(transacao.amount)}</p>
                    </Td>
                    <Td style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        disabled={!transacao.uuid}
                        onClick={() =>
                          navigate(`/pedidos/${transacao.uuid}`, {
                            state: { order: transacao },
                          })
                        }
                        style={{
                          border: "1px solid var(--color-border)",
                          background: "var(--color-surface)",
                          color: "var(--color-text)",
                          borderRadius: "8px",
                          padding: "6px 10px",
                          fontSize: "12px",
                          fontWeight: 700,
                          cursor: transacao.uuid ? "pointer" : "not-allowed",
                          opacity: transacao.uuid ? 1 : 0.5,
                        }}
                      >
                        Ver
                      </button>
                    </Td>
                  </Tr>
                </tbody>
              ))}

              {(!data || data.items.length === 0) && !isLoading && (
                <tbody>
                  <Tr $background={true}>
                    <Td>
                      <p>Nenhum pedido</p>
                    </Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td>--</Td>
                    <Td style={{ textAlign: "center" }}>--</Td>
                  </Tr>
                </tbody>
              )}
            </TableContainer>

            {data && (data?.totalCount ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={data?.page}
                  currentCount={data.items.length}
                  totalCount={data.totalCount}
                  totalPages={data.totalPages}
                  onPageChange={handlePageChange}
                  type="níveis"
                />
              </DivPagination>
            )}
          </Container>
        </ContainerDad>
      </MainTable>
    </AppShell>
  );
};

export default Transacao;
