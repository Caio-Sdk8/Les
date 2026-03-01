"use client";

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
import { usuariosMock } from "../../mock/usuáriosMock";
import { Main, SubTitle, SubtitleContainer } from "../Cadastro/style";

const ListagemCliente = () => {
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
          <SubTitle>Listagem de Clientes</SubTitle>
        </SubtitleContainer>
      </Container>
      <MainTable>
        <ContainerDad>
          <Container>
            <TableContainer>
              <thead>
                <tr>
                  <Th style={{ width: "18%", paddingLeft: "5px" }}>NOME</Th>
                  <Th style={{ width: "10%", height: "48px" }}>E-MAIL</Th>
                  <Th style={{ width: "18%", height: "48px" }}>TELEFONE</Th>

                  <Th style={{ width: "21%", textAlign: "center" }}>AÇÕES</Th>
                </tr>
              </thead>

              {usuariosMock.map((usuario, index) => (
                <tbody key={usuario.id}>
                  <Tr $background={index % 2 === 0}>
                    <Td style={{ textAlign: "left", paddingLeft: "5px" }}>
                      <p>{usuario.nome}</p>
                    </Td>
                    <Td>
                      <p>{usuario.email}</p>
                    </Td>
                    <Td>
                      <p>{usuario.telefone}</p>
                    </Td>

                    <Td
                      style={{
                        textAlign: "center",
                        verticalAlign: "middle",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "inherit",
                        gap: "36px",
                      }}
                    >
                      <ToggleSwitch
                        checked={usuario.active}
                        onChange={() => {
                          setDocumentId(String(usuario.id));
                          if (usuario.active) {
                            setIsDesactive(true);
                          } else {
                            setIsActive(true);
                          }
                        }}
                      />
                    </Td>
                  </Tr>
                </tbody>
              ))}
            </TableContainer>

            {(usuariosMock.length ?? 0) > 0 && (
              <DivPagination>
                <Pagination
                  currentPage={1}
                  currentCount={usuariosMock.length}
                  totalCount={usuariosMock.length}
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

export default ListagemCliente;
