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
import { GetAllCLientCardsRequest } from "../../services/requests/getCardClient";
import { useToggleCard } from "../../services/requests/togglePrefered";
interface Props {
  uuid: string;
  clientUuid: string;
}

const CartaoTable: React.FC<Props> = ({ uuid, clientUuid }) => {
  const { data: cards, isLoading, error } = GetAllCLientCardsRequest(uuid);

  const toggleCard = useToggleCard();

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

              {cards &&
                cards.map((cartao, index) => (
                  <tbody key={cartao.uuid}>
                    <Tr
                      $background={index % 2 === 0}
                      style={
                        cartao.isPreferred
                          ? {
                              backgroundColor: "var(--color-primary-soft)",
                              border: "2px dashed var(--color-primary)",
                            }
                          : {}
                      }
                    >
                      <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        <p>{cartao.printedName}</p>
                      </Td>
                      <Td>
                        <p>{cartao.cardBrandName}</p>
                      </Td>
                      <Td>
                        <p>
                          {cartao.isPreferred
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
                        <ButtonPrefer
                          $preferido={cartao.isPreferred}
                          onClick={async () => {
                            await toggleCard.mutate({
                              customerUuid: clientUuid,
                              cardUuid: cartao.uuid,
                            });
                          }}
                        >
                          {cartao.isPreferred
                            ? "Preferencial"
                            : "Não preferencial"}
                        </ButtonPrefer>
                      </Td>
                    </Tr>
                  </tbody>
                ))}
            </TableContainer>

            {(cards?.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={currentPage}
                  currentCount={cards?.length ?? 0}
                  totalCount={cards?.length ?? 0}
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
