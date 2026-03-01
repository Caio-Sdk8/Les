import { useState } from "react";

import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import { Main, SubTitle, SubtitleContainer } from "../Cadastro/style";
import { useNavigate } from "react-router-dom";
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
const Transacao = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isDesactive, setIsDesactive] = useState(false);

  const [documentId, setDocumentId] = useState("");

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Main>
      <Container>
        <SubtitleContainer>
          <SubTitle>Transações</SubTitle>
        </SubtitleContainer>
      </Container>
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

              {transacoesMock.map((transacao, index) => (
                <tbody key={transacao.id}>
                  <Tr $background={index % 2 === 0}>
                    <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                      <p>{transacao.codigo}</p>
                    </Td>
                    <Td>
                      {transacao.produtos.map((produto) => (
                        <p key={produto.id}>{produto.nome}</p>
                      ))}
                    </Td>
                    <Td>
                      <p>R${transacao.valor}</p>
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
                      <p>{transacao.status}</p>
                    </Td>
                  </Tr>
                </tbody>
              ))}
            </TableContainer>

            {(transacoesMock.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={currentPage}
                  currentCount={transacoesMock.length}
                  totalCount={transacoesMock.length}
                  totalPages={1}
                  onPageChange={handlePageChange}
                  type="níveis"
                />
              </DivPagination>
            )}
          </Container>
        </ContainerDad>
      </MainTable>
    </Main>
  );
};

export default Transacao;
