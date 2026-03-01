import { useState } from "react";

import { DivPagination } from "../../components/Pagination/style";
import Pagination from "../../components/Pagination/Paginations";
import { DivTitle, Main, SubTitle, SubtitleContainer } from "../Cadastro/style";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../components/NavBar/NavBar";
import {
  DescriptionLabel,
  DivGlobalItens,
  HoverIcons,
  IconBack,
  IconButton,
  ImageWrapper,
  PubliContainer,
  PubliItens,
  PubliLabel,
} from "./style";
import produtos from "../../mock/produtos";

const Loja = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  const navigate = useNavigate();

  return (
    <Main>
      <DivTitle>
        <SubtitleContainer>
          <SubTitle>Loja</SubTitle>
        </SubtitleContainer>
        <NavBar />
      </DivTitle>

      <PubliContainer>
        {produtos &&
          produtos.map((item) => (
            <DivGlobalItens>
              <PubliItens key={item.id}>
                <ImageWrapper>
                  <img src={item.imagem} alt={item.nome} />
                  <HoverIcons>
                    <IconButton>
                      <IconBack></IconBack>
                    </IconButton>
                  </HoverIcons>
                </ImageWrapper>
              </PubliItens>
              <PubliLabel>{item.nome}</PubliLabel>
              <DescriptionLabel>{item.descricao}</DescriptionLabel>
            </DivGlobalItens>
          ))}
      </PubliContainer>
      {produtos.length > 0 && (
        <DivPagination>
          <Pagination
            currentPage={1}
            currentCount={produtos.length}
            totalCount={produtos.length}
            totalPages={1}
            onPageChange={handlePageChange}
            type="níveis"
          />
        </DivPagination>
      )}
    </Main>
  );
};

export default Loja;
