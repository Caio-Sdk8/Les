import { useState } from "react";
import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import PencilIcon from "../../assets/PencilIcon.svg";
import { useNavigate } from "react-router-dom";
import {
  Container,
  ContainerDad,
  MainTable,
  TableContainer,
  Td,
  Th,
  Tr,
} from "../../pages/ListagemCliente/style";
import { enderecosMock } from "../../mock/endereco";
import { Title } from "./style";
const EnderecoTable = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = () => {
    navigate("/editarEndereco");
  };

  return (
    <>
      <Title>Endereços</Title>

      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "16.8%", paddingLeft: "5px" }}>NOME</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>CEP</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>ESTADO</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>CIDADE</Th>
                  <Th style={{ width: "16,8%", height: "48px" }}>TIPO</Th>

                  <Th style={{ width: "16,8%", textAlign: "center" }}>AÇÕES</Th>
                </tr>
              </thead>

              {enderecosMock.map((endereco, index) => (
                <tbody key={endereco.id}>
                  <Tr $background={index % 2 === 0}>
                    <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                      <p>{endereco.apelido || "----------"}</p>
                    </Td>
                    <Td>
                      <p>{endereco.cep}</p>
                    </Td>
                    <Td>
                      <p>{endereco.estado}</p>
                    </Td>
                    <Td>
                      <p>{endereco.cidade}</p>
                    </Td>
                    <Td>
                      <p>{endereco.tipo}</p>
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
                        src={PencilIcon}
                        alt="Editar"
                        onClick={handleEdit}
                        style={{
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                      />
                    </Td>
                  </Tr>
                </tbody>
              ))}
            </TableContainer>

            {(enderecosMock.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={currentPage}
                  currentCount={enderecosMock.length}
                  totalCount={enderecosMock.length}
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

export default EnderecoTable;
