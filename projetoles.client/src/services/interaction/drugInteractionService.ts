import { productService, type ProductSummary } from "../catalog/productService";

const INTERACTION_KEYWORDS = [
  "intera", // interação/interações
  "conflito",
  "interfere",
  "tomar com",
  "usar com",
  "usar junto",
  "com outro",
  "com outra",
  "remédio",
  "medicamento",
  "interferência",
  "interferencia",
  "anticoagul", // anticoagulante, anticoagulantes
];

const containsInteractionKeyword = (text: string) => {
  const lower = text.toLowerCase();
  return INTERACTION_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const findProductMatches = (text: string, products: ProductSummary[]) => {
  const normalized = text.toLowerCase();

  const exactMatches = products.filter((product) =>
    normalized.includes(product.name.toLowerCase()),
  );

  if (exactMatches.length > 0) {
    return exactMatches.sort((a, b) => b.name.length - a.name.length);
  }

  const partialMatches = products.filter((product) =>
    product.name
      .toLowerCase()
      .split(" ")
      .some((term) => term.length > 3 && normalized.includes(term)),
  );

  return partialMatches.length > 0
    ? partialMatches.sort((a, b) => b.name.length - a.name.length)
    : [];
};

const formatInteractionAnswer = (
  target: ProductSummary,
  interactions: { otherName: string; description: string }[],
) => {
  if (interactions.length === 0) {
    return "Nenhum medicamento vendido pela Pharma Lais possui interferência registrada com o medicamento citado.";
  }

  const compact = interactions
    .slice(0, 3)
    .map(
      (interaction) => `${interaction.otherName}: ${interaction.description}`,
    )
    .join("; ");

  return `Sim. ${target.name} possui interação registrada com ${compact}.`;
};

export const drugInteractionService = {
  async getInteractionAnswer(userText: string): Promise<string | null> {
    if (!containsInteractionKeyword(userText)) return null;

    try {
      const allProducts = await productService.getProducts({ pageSize: 1000 });
      const products = allProducts.items;
      const matches = findProductMatches(userText, products);

      if (matches.length === 0) {
        return "Nenhum medicamento vendido pela Pharma Lais possui interferência registrada com o medicamento citado.";
      }

      const target = matches[0];
      const allUuids = products.map((product) => product.uuid);
      const interactions = await productService.checkDrugInteractions(allUuids);

      const relevant = interactions
        .filter(
          (interaction) =>
            interaction.productAUuid === target.uuid ||
            interaction.productBUuid === target.uuid,
        )
        .map((interaction) => {
          const otherName =
            interaction.productAUuid === target.uuid
              ? interaction.productBName
              : interaction.productAName;
          return {
            otherName,
            description: interaction.description,
          };
        });

      return formatInteractionAnswer(target, relevant);
    } catch (error) {
      console.error("Erro ao buscar interações de medicamento:", error);
      return "Nenhum medicamento vendido pela Pharma Lais possui interferência registrada com o medicamento citado.";
    }
  },
};
