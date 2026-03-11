import { useState } from "react";

import SetaDireita from "../../assets/SetaDireita.svg";
import SetaEsquerda from "../../assets/SetaEsquerda.svg";
import {
  ButtonsContainer,
  PageButton,
  PaginationContainer,
  Text,
} from "../Pagination/style";

type Props = {
  totalCount: number;
};

const RefundSelector = ({ totalCount }: Props) => {
  const [selectedCount, setSelectedCount] = useState(1);

  const handleDecrease = () => {
    if (selectedCount > 1) {
      setSelectedCount(selectedCount - 1);
    }
  };

  const handleIncrease = () => {
    if (selectedCount < totalCount) {
      setSelectedCount(selectedCount + 1);
    }
  };

  return (
    <PaginationContainer>
      <ButtonsContainer>
        <PageButton onClick={handleDecrease} disabled={selectedCount === 1}>
          <img
            src={SetaEsquerda}
            alt="Diminuir"
            style={{
              width: "15px",
              height: "15px",
              cursor: "pointer",
            }}
          />
        </PageButton>

        <Text>
          {selectedCount} / {totalCount}
        </Text>

        <PageButton
          onClick={handleIncrease}
          disabled={selectedCount === totalCount}
        >
          <img
            src={SetaDireita}
            alt="Aumentar"
            style={{
              width: "15px",
              height: "15px",
              cursor: "pointer",
            }}
          />
        </PageButton>
      </ButtonsContainer>
    </PaginationContainer>
  );
};

export default RefundSelector;
