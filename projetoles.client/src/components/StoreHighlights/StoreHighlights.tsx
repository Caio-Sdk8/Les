import { HighlightCard, HighlightsGrid, ItemText, ItemTitle } from "./style";

type HighlightItem = {
  id: string;
  title: string;
  text: string;
};

type StoreHighlightsProps = {
  items: HighlightItem[];
};

export const StoreHighlights = ({ items }: StoreHighlightsProps) => {
  return (
    <HighlightsGrid>
      {items.map((item) => (
        <HighlightCard key={item.id}>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemText>{item.text}</ItemText>
        </HighlightCard>
      ))}
    </HighlightsGrid>
  );
};
