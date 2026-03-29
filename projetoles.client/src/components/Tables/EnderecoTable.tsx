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
import { Title } from "./style";
import { GetAllCLientAddressRequest } from "../../services/requests/getAddressClient";
import { IGetAddressResponse } from "../../services/interfaces/GetAddressClient";

interface Props {
  uuid: string;
}

const EnderecoTable: React.FC<Props> = ({ uuid }) => {
  const {
    data: addresses,
    isLoading,
    error,
  } = GetAllCLientAddressRequest(uuid);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

const handleEdit = (endereco: IGetAddressResponse) => {
  navigate("/editarEndereco", {
    state: {
      endereco,
      clientUuid: uuid, 
    },
  });
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
                  <Th style={{ width: "16.8%", paddingLeft: "5px" }}>PAÍS</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>CEP</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>ESTADO</Th>
                  <Th style={{ width: "16.8%", height: "48px" }}>CIDADE</Th>
                  <Th style={{ width: "16,8%", height: "48px" }}>TIPO</Th>

                  <Th style={{ width: "16,8%", textAlign: "center" }}>AÇÕES</Th>
                </tr>
              </thead>

              {addresses &&
                addresses.map((endereco, index) => (
                  <tbody key={endereco.uuid}>
                    <Tr $background={index % 2 === 0}>
                      <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        <p>{endereco.country || "----------"}</p>
                      </Td>
                      <Td>
                        <p>{endereco.zipCode}</p>
                      </Td>
                      <Td>
                        <p>{endereco.state}</p>
                      </Td>
                      <Td>
                        <p>{endereco.city}</p>
                      </Td>
                      <Td>
                        <p>{endereco.label}</p>
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
                        <button
                          type="button"
                          onClick={() => handleEdit(endereco)}
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "999px",
                            border: "1px solid var(--color-border)",
                            backgroundColor: "var(--color-surface)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={PencilIcon}
                            alt="Editar"
                            style={{ width: "18px", height: "18px" }}
                          />
                        </button>
                      </Td>
                    </Tr>
                  </tbody>
                ))}
            </TableContainer>

            {addresses && (addresses.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={currentPage}
                  currentCount={addresses.length}
                  totalCount={addresses.length}
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
