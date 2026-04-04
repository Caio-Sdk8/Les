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
import { useDeleteClient } from "../../services/requests/deleteClient";
import ModalActive from "../../components/Modals/ModalActive";
import { authService } from "../../services/auth/authService";
import { notifyApiError } from "../../services/errors/errorNotifier";

const ListagemCliente = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [isDesactive, setIsDesactive] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const isAdmin = authService.hasRole("Admin");

  const { data } = GetAllCLientRequest();
  const toggle = useToggleClient();
  const deleteClient = useDeleteClient();

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (uuid: string, isActive: boolean) => {
    if (!isActive) {
      notifyApiError("Não é permitido editar cliente desativado.");
      return;
    }
    navigate("/editarUsuario", { state: { uuid } });
  };

  const handleTransacao = (uuid: string) => {
    if (!isAdmin) {
      notifyApiError("Apenas administradores podem acessar pedidos de clientes.");
      return;
    }
    navigate("/pedidos", { state: { uuid } });
  };

  const handleDelete = (uuid: string, name: string) => {
    if (!isAdmin) {
      notifyApiError("Apenas administradores podem excluir cliente.");
      return;
    }

    setDocumentId(uuid);
    setSelectedCustomerName(name);
    setIsDelete(true);
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
                            if (!isAdmin) {
                              notifyApiError(
                                "Apenas administradores podem alterar status do cliente.",
                              );
                              return;
                            }

                            setDocumentId(String(usuario.uuid));
                            setSelectedCustomerName(usuario.name);
                            if (usuario.isActive) {
                              setIsDesactive(true);
                            } else {
                              setIsActive(true);
                            }
                          }}
                        />
                        {usuario.isActive === true && (
                          <img
                            src={PencilIcon}
                            alt="Editar"
                            onClick={() =>
                              handleEdit(String(usuario.uuid), usuario.isActive)
                            }
                            style={{
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              opacity: usuario.isActive ? 1 : 0.45,
                            }}
                          />
                        )}

                        <img
                          src={CarrinhoIcon}
                          alt="Pedidos"
                          onClick={() => handleTransacao(String(usuario.uuid))}
                          style={{
                            width: "24px",
                            height: "24px",
                            cursor: isAdmin ? "pointer" : "not-allowed",
                            opacity: isAdmin ? 1 : 0.45,
                          }}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(String(usuario.uuid), usuario.name)
                          }
                          disabled={!isAdmin}
                          style={{
                            border: "1px solid #fecaca",
                            background: "#fef2f2",
                            color: "#dc2626",
                            borderRadius: "8px",
                            padding: "6px 10px",
                            fontSize: "12px",
                            fontWeight: 700,
                            cursor: isAdmin ? "pointer" : "not-allowed",
                            opacity: isAdmin ? 1 : 0.45,
                          }}
                        >
                          Excluir
                        </button>
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

      {isDelete && (
        <ModalActive
          next={() => {
            deleteClient.mutate(documentId);
            setIsDelete(false);
          }}
          title="Excluir cliente?"
          message={`Deseja excluir ${selectedCustomerName}?`}
          button="Excluir"
          button2="Cancelar"
          back={() => setIsDelete(false)}
          height="220px"
        />
      )}
    </AppShell>
  );
};

export default ListagemCliente;
