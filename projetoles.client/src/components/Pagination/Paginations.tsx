import {
  ButtonsContainer,
  Icon,
  PageButton,
  Pages,
  PaginationContainer,
  Text,
} from "./style";

import SetaDireita from "../../assets/SetaDireita.svg";
import SetaEsquerda from "../../assets/SetaEsquerda.svg";

export const ItensPerPage = 20;

type Props = {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (pageNumber: number) => void;
  type: string;
  currentCount?: number;
};

const Pagination = ({
  totalCount,
  currentCount,
  currentPage,
  totalPages,
  onPageChange,
  type,
}: Props) => {
  const numberInitial = 0;

  const getPages = () => {
    const pages = [];

    if (totalPages > 0) {
      pages.push(1);
    }

    if (currentPage > 4) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, currentPage - 2);
      i <= Math.min(totalPages - 1, currentPage + 2);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  return (
    <PaginationContainer>
      <Text>
        Mostrando {currentCount ? currentCount : numberInitial} de{" "}
        {totalCount ? totalCount : numberInitial}
      </Text>

      <ButtonsContainer>
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon src={SetaEsquerda} alt="Página anterior" />
        </PageButton>

        {pages.map((page, index) =>
          typeof page === "number" ? (
            <Pages
              key={index}
              onClick={() => onPageChange(page)}
              $isActive={page === currentPage}
              disabled={page === currentPage}
            >
              {page}
            </Pages>
          ) : (
            <span key={index} style={{ margin: "0 8px" }}>
              ...
            </span>
          ),
        )}

        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Icon src={SetaDireita} alt="Próxima página" />
        </PageButton>
      </ButtonsContainer>
    </PaginationContainer>
  );
};

export default Pagination;
