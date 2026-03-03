import Plus from "../../assets/PlusIcon.svg";
import {
  AddButton,
  CategoryTag,
  Description,
  HeaderRow,
  Info,
  Name,
  Price,
  PriceFrom,
  ProductCardContainer,
  ProductImage,
  ProductImageWrap,
  WarningTag,
} from "./style";

export type StoreProduct = {
  id: number;
  nome: string;
  valor: number;
  imagem: string;
  descricao?: string;
  categoria?: string;
  aviso?: string;
  desconto?: number;
};

type StoreProductCardProps = {
  product: StoreProduct;
  compact?: boolean;
  onAddToCart?: (product: StoreProduct) => void;
};

export const StoreProductCard = ({
  product,
  compact = true,
  onAddToCart,
}: StoreProductCardProps) => {
  const discount = product.desconto ?? 0;
  const oldPrice = discount > 0 ? product.valor * (1 + discount / 100) : null;

  return (
    <ProductCardContainer $compact={compact}>
      <ProductImageWrap>
        {product.categoria && <CategoryTag>{product.categoria}</CategoryTag>}
        <ProductImage src={product.imagem} alt={product.nome} />
      </ProductImageWrap>

      <Info>
        <HeaderRow>
          <Name>{product.nome}</Name>
          {product.aviso && <WarningTag>{product.aviso}</WarningTag>}
        </HeaderRow>

        {product.descricao && <Description>{product.descricao}</Description>}

        {oldPrice && <PriceFrom>de {oldPrice.toFixed(2).replace(".", ",")}</PriceFrom>}
        <Price>
          {product.valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Price>
      </Info>

      <AddButton type="button" onClick={() => onAddToCart?.(product)}>
        <img src={Plus} alt="Adicionar" />
      </AddButton>
    </ProductCardContainer>
  );
};
