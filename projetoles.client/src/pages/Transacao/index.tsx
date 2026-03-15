import { useState } from "react";

import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import Refound from "../../assets/Refound.png";
import {
  Container,
  ContainerDad,
  MainTable,
  TableContainer,
  Td,
  Th,
  Tr,
} from "../ListagemCliente/style";
import { transacoesMock } from "../../mock/transacoes";
import { AppShell } from "../../components/AppShell/AppShell";
import ModalTroca from "../../components/Modals/Troca";
import { GetTransactionClientRequest } from "../../services/requests/getTransactionClient";
import { useLocation } from "react-router-dom";
const Transacao = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refound, setRefound] = useState(false);

  const location = useLocation();
  const customerUuid = location.state?.uuid;

  const { data, isLoading } = GetTransactionClientRequest(customerUuid, 1, 20);

  const [isDesactive, setIsDesactive] = useState(false);

  const [documentId, setDocumentId] = useState("");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AppShell title="Transações">
      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "18%", paddingLeft: "5px" }}>CÓDIGO</Th>
                  <Th style={{ width: "10%", height: "48px" }}>PRODUTOS</Th>
                  <Th style={{ width: "18%", height: "48px" }}>VALOR</Th>

                  <Th style={{ width: "21%", textAlign: "center" }}>STATUS</Th>
                </tr>
              </thead>

              {data?.items.map((transacao, index) => (
                <tbody key={transacao.id}>
                  <Tr $background={index % 2 === 0}>
                    <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                      <p>R${transacao.amount}</p>
                    </Td>
                    <Td>{transacao.description}</Td>
                    <Td>
                      <p>{transacao.createdAt}</p>
                    </Td>
                    <Td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "inherit",
                        gap: "20px",
                      }}
                    >
                      <img
                        src={Refound}
                        alt="Transações"
                        onClick={() => setRefound(true)}
                        style={{
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                      />
                      <p>{transacao.status}</p>
                    </Td>
                  </Tr>
                </tbody>
              ))}

              <tbody>
                <Tr $background={true}>
                  <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                    <p>------</p>
                  </Td>
                  <Td>------</Td>
                  <Td>
                    <p>------</p>
                  </Td>
                  <Td
                    style={{
                      textAlign: "center",
                      verticalAlign: "middle",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "inherit",
                      gap: "20px",
                    }}
                  >
                    <p>------</p>
                  </Td>
                </Tr>
              </tbody>
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
      {refound && (
        <ModalTroca
          title="Troca de Produtos"
          message2="Selecione a o produto que deseja trocar e digite o motivo"
          button="Trocar"
          button2="Cancelar"
          next={() => setRefound(false)}
          back={() => setRefound(false)}
        />
      )}
    </AppShell>
  );
};

export default Transacao;
