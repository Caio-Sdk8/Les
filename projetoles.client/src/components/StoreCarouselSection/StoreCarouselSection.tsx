import { useRef } from "react";
import { StoreProduct, StoreProductCard } from "../StoreProductCard/StoreProductCard";
import {
  ArrowButton,
  Arrows,
  CarouselTrack,
  Header,
  Section,
  Title,
} from "./style";

type StoreCarouselSectionProps = {
  title: string;
  products: StoreProduct[];
  compactCards?: boolean;
  onAddToCart?: (product: StoreProduct) => void;
};

export const StoreCarouselSection = ({
  title,
  products,
  compactCards = true,
  onAddToCart,
}: StoreCarouselSectionProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const value = direction === "left" ? -420 : 420;
    trackRef.current.scrollBy({ left: value, behavior: "smooth" });
  };

  return (
    <Section>
      <Header>
        <Title>{title}</Title>
        <Arrows>
          <ArrowButton type="button" onClick={() => handleScroll("left")}>
            ◀
          </ArrowButton>
          <ArrowButton type="button" onClick={() => handleScroll("right")}>
            ▶
          </ArrowButton>
        </Arrows>
      </Header>

      <CarouselTrack ref={trackRef}>
        {products.map((product) => (
          <StoreProductCard
            key={`${title}-${product.id}`}
            product={product}
            compact={compactCards}
            onAddToCart={onAddToCart}
          />
        ))}
      </CarouselTrack>
    </Section>
  );
};
