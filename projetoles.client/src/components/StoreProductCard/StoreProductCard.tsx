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
  id: number | string;
  uuid?: string;
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
  onClick?: (product: StoreProduct) => void;
};

const getPrescriptionTone = (label?: string): "free" | "yellow" | "red" | "black" | "neutral" => {
  const normalized = (label ?? "").toLowerCase();

  if (normalized.includes("venda livre")) return "free";
  if (normalized.includes("tarja amarela")) return "yellow";
  if (normalized.includes("tarja vermelha")) return "red";
  if (normalized.includes("tarja preta")) return "black";
  return "neutral";
};

export const StoreProductCard = ({
  product,
  compact = true,
  onAddToCart,
  onClick,
}: StoreProductCardProps) => {
  const discount = product.desconto ?? 0;
  const oldPrice = discount > 0 ? product.valor * (1 + discount / 100) : null;

  return (
    <ProductCardContainer
      $compact={compact}
      $clickable={!!onClick}
      onClick={() => onClick?.(product)}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick(product);
        }
      }}
    >
      <ProductImageWrap>
        {product.categoria && <CategoryTag>{product.categoria}</CategoryTag>}
        <ProductImage src={product.imagem} alt={product.nome} />
      </ProductImageWrap>

      <Info>
        <HeaderRow>
          <Name>{product.nome}</Name>
          {product.aviso && (
            <WarningTag $tone={getPrescriptionTone(product.aviso)}>{product.aviso}</WarningTag>
          )}
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

      <AddButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onAddToCart?.(product);
        }}
      >
        <img src={Plus} alt="Adicionar" />
      </AddButton>
    </ProductCardContainer>
  );
};
