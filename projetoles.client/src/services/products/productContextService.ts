import api from "../requests/api";

interface Product {
  uuid?: string;
  name: string;
  description?: string;
  price?: number;
  unit?: string;
  categories?: string[];
  [key: string]: any;
}

interface Category {
  uuid?: string;
  name: string;
  description?: string;
  [key: string]: any;
}

interface DrugInteraction {
  uuid?: string;
  productAId?: number;
  productBId?: number;
  description: string;
  severityLevel?: number;
  [key: string]: any;
}

export const productContextService = {
  async getProductsContext(): Promise<string> {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get<{ items: Product[] }>("/api/products", {
          params: { pageSize: 1000 },
        }),
        api.get<Category[]>("/api/categories"),
      ]);

      const products = productsRes.data.items || [];
      const categories = Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : [];

      // Formatar categorias
      const categoriesText = categories
        .map((cat) => `- ${cat.name}: ${cat.description || ""}`)
        .join("\n");

      // Formatar produtos
      const productsText = products
        .slice(0, 100) // Limitar a 100 produtos para não ficar muito grande
        .map((product) => {
          const name = product.name || "Sem nome";
          const price = product.price ? `R$ ${product.price.toFixed(2)}` : "";
          const cats = product.categories?.join(", ") || "Geral";
          return `- ${name} (${cats}) ${price}`;
        })
        .join("\n");

      return `
CATEGORIAS:
${categoriesText}

PRINCIPAIS PRODUTOS:
${productsText}

INSTRUÇÕES:
- Respostas CURTAS e DIRETAS (máx 2-3 linhas)
- Recomende apenas produtos do catálogo
- Cite o nome e preço quando recomendar
- Se não souber, peça orientação médica
`;
    } catch (error) {
      console.error("Erro ao buscar contexto de produtos:", error);
      return "Catálogo indisponível no momento.";
    }
  },

  async getDrugInteractionsContext(): Promise<string> {
    try {
      const { data } = await api.get<{ items: Product[] }>("/api/products", {
        params: { pageSize: 1000 },
      });

      const products = data.items || [];
      const productMap = new Map(
        products.map((p) => [p.name?.toLowerCase(), p.name]),
      );

      // Fetch interações (usar produtos já carregados se possível)
      const interactions: DrugInteraction[] = [];

      const interactionsText = interactions
        .map((inter) => {
          const severity =
            inter.severityLevel === 3
              ? "⚠️ ALTA"
              : inter.severityLevel === 2
                ? "⚠️ MÉDIA"
                : "ℹ️ BAIXA";
          return `${severity}: ${inter.description}`;
        })
        .join("\n");

      return interactionsText || "Sem interações conhecidas";
    } catch (error) {
      console.error("Erro ao buscar interações:", error);
      return "";
    }
  },
};
