import { useState } from "react";
import {
  Container,
  ContainerDad,
  MainTable,
  TableContainer,
  Td,
  Th,
  Tr,
} from "./style";
import { ToggleSwitch } from "../../components/Switch/Switch";
import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import PencilIcon from "../../assets/PencilIcon.svg";
import CarrinhoIcon from "../../assets/Carrinho.png";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/AppShell/AppShell";
import { GetAllCLientRequest } from "../../services/requests/getAllClient";
import { useToggleClient } from "../../services/requests/activeDesactiveClient";
import ModalActive from "../../components/Modals/ModalActive";

const ListagemCliente = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isDesactive, setIsDesactive] = useState(false);
  const [documentId, setDocumentId] = useState("");

  const { data } = GetAllCLientRequest();
  const toggle = useToggleClient();

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (uuid: string) => {
    navigate("/editarUsuario", { state: { uuid } });
  };

  const handleTransacao = (uuid: string) => {
    navigate("/transacao", { state: { uuid } });
  };

  return (
    <AppShell title="Listagem de Clientes">
      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "18%", paddingLeft: "5px" }}>NOME</Th>
                  <Th style={{ width: "10%", height: "48px" }}>E-MAIL</Th>
                  <Th style={{ width: "18%", height: "48px" }}>
                    CÓDIGO DO CLIENTE
                  </Th>
                  <Th style={{ width: "21%", textAlign: "center" }}>AÇÕES</Th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.items.map((usuario, index) => (
                    <Tr $background={index % 2 === 0} key={usuario.uuid}>
                      <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        <p>{usuario.name}</p>
                      </Td>
                      <Td>
                        <p>{usuario.email}</p>
                      </Td>
                      <Td>
                        <p>{usuario.customerCode}</p>
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
                        <ToggleSwitch
                          checked={usuario.isActive}
                          onChange={() => {
                            setDocumentId(String(usuario.uuid));
                            if (usuario.isActive) {
                              setIsDesactive(true);
                            } else {
                              setIsActive(true);
                            }
                          }}
                        />
                        <img
                          src={PencilIcon}
                          alt="Editar"
                          onClick={() => handleEdit(String(usuario.uuid))}
                          style={{
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                          }}
                        />
                        <img
                          src={CarrinhoIcon}
                          alt="Transações"
                          onClick={() => handleTransacao(String(usuario.uuid))}
                          style={{
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
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

      {isActive && (
        <ModalActive
          next={() => {
            toggle.mutate(documentId);
            setIsActive(false);
          }}
          title="Ativar?"
          message="Tem certeza que deseja ativar o cliente?"
          button2="Não"
          back={() => setIsActive(false)}
          height="200px"
        />
      )}

      {isDesactive && (
        <ModalActive
          next={() => {
            toggle.mutate(documentId);
            setIsDesactive(false);
          }}
          title="Desativar?"
          message="Tem certeza que deseja desativar o cliente?"
          button2="Não"
          back={() => setIsDesactive(false)}
          height="200px"
        />
      )}
    </AppShell>
  );
};

export default ListagemCliente;
