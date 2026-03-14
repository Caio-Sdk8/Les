import { useState } from "react";
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
} from "../../pages/ListagemCliente/style";
import { ButtonPrefer, Title } from "./style";
import { cartoesMock } from "../../mock/cartao";
const CartaoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Title>Cartões</Title>

      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "25%", paddingLeft: "5px" }}>TITULAR</Th>
                  <Th style={{ width: "25%", height: "48px" }}>BANDEIRA</Th>
                  <Th style={{ width: "25%", height: "48px" }}>PREFERENCIAL</Th>

                  <Th style={{ width: "25%", textAlign: "center" }}>AÇÕES</Th>
                </tr>
              </thead>

              {cartoesMock.map((cartao, index) => (
                <tbody key={cartao.id}>
                  <Tr
                    $background={index % 2 === 0}
                    style={
                      cartao.preferencial
                        ? {
                            backgroundColor: "var(--color-primary-soft)",
                            border: "2px dashed var(--color-primary)",
                          }
                        : {}
                    }
                  >
                    <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                      <p>{cartao.titular}</p>
                    </Td>
                    <Td>
                      <p>{cartao.bandeira}</p>
                    </Td>
                    <Td>
                      <p>
                        {cartao.preferencial
                          ? "Preferencial"
                          : "Não preferencial"}
                      </p>
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
                      <ButtonPrefer preferido={cartao.preferencial}>
                        {cartao.preferencial
                          ? "Preferencial"
                          : "Não preferencial"}
                      </ButtonPrefer>
                    </Td>
                  </Tr>
                </tbody>
              ))}
            </TableContainer>

            {(cartoesMock.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={currentPage}
                  currentCount={cartoesMock.length}
                  totalCount={cartoesMock.length}
                  totalPages={1}
                  onPageChange={handlePageChange}
                  type="níveis"
                />
              </DivPagination>
            )}
          </Container>
        </ContainerDad>
      </MainTable>
    </>
  );
};

export default CartaoTable;
