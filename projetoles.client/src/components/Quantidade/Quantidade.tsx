import { Container, QuantityButton, QuantityValue } from "./style";

import SetaDireita from "../../assets/SetaDireita.svg";
import SetaEsquerda from "../../assets/SetaEsquerda.svg";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

const QuantitySelector = ({
  value = 1,
  min = 1,
  max = 99,
  onChange,
}: Props) => {
  const quantity = value;

  const increase = () => {
    if (quantity < max) {
      const newValue = quantity + 1;
      onChange?.(newValue);
    }
  };

  const decrease = () => {
    if (quantity > min) {
      const newValue = quantity - 1;
      onChange?.(newValue);
    }
  };

  return (
    <Container>
      <QuantityButton onClick={decrease} disabled={quantity === min}>
        <img src={SetaEsquerda} alt="Diminuir" width="12" height="12" />
      </QuantityButton>

      <QuantityValue>{quantity}</QuantityValue>

      <QuantityButton onClick={increase} disabled={quantity === max}>
        <img src={SetaDireita} alt="Aumentar" width="12" height="12" />
      </QuantityButton>
    </Container>
  );
};

export default QuantitySelector;
