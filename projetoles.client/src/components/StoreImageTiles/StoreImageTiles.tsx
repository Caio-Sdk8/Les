import { useRef } from "react";
import {
  ArrowButton,
  Arrows,
  Header,
  Tile,
  TileImage,
  TileTrack,
  TileTitle,
  Title,
  Wrapper,
} from "./style";

export type StoreTile = {
  id: string;
  title: string;
  image: string;
};

type StoreImageTilesProps = {
  title: string;
  items: StoreTile[];
};

export const StoreImageTiles = ({ title, items }: StoreImageTilesProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const value = direction === "left" ? -420 : 420;
    trackRef.current.scrollBy({ left: value, behavior: "smooth" });
  };

  return (
    <Wrapper>
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

      <TileTrack ref={trackRef}>
        {items.map((item) => (
          <Tile key={item.id}>
            <TileImage src={item.image} alt={item.title} />
            <TileTitle>{item.title}</TileTitle>
          </Tile>
        ))}
      </TileTrack>
    </Wrapper>
  );
};
