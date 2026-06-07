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

/**
 * Serviço para gerar arquivo TXT com contexto agregado
 * Útil para treinar IA offline ou como referência
 */
export const trainingDataService = {
  /**
   * Gera TXT com todas as categorias e produtos
   */
  async generateTrainingData(): Promise<string> {
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

      let txt = `================================================================================
DADOS DE TREINAMENTO - PHARMAPRO
Gerado em: ${new Date().toLocaleString("pt-BR")}
================================================================================

INSTRUÇÕES PARA A IA:
- Respostas CURTAS e DIRETAS (máx 2-3 linhas)
- NUNCA recomende medicamentos para risco de vida
- NUNCA use linguagem ofensiva
- NUNCA faça diagnósticos médicos
- SEMPRE recomende consulta profissional para casos sérios
- Use APENAS produtos do catálogo abaixo

================================================================================
CATEGORIAS DA FARMÁCIA
================================================================================

`;

      // Adicionar categorias
      categories.forEach((cat) => {
        txt += `\n[${cat.name.toUpperCase()}]\n`;
        if (cat.description) {
          txt += `Descrição: ${cat.description}\n`;
        }
      });

      txt += `\n\n================================================================================
CATÁLOGO DE PRODUTOS
================================================================================\n`;

      // Adicionar produtos agrupados por categoria
      const productsByCategory = new Map<string, Product[]>();

      products.forEach((product) => {
        const cats = product.categories || ["Geral"];
        cats.forEach((cat) => {
          if (!productsByCategory.has(cat)) {
            productsByCategory.set(cat, []);
          }
          productsByCategory.get(cat)?.push(product);
        });
      });

      productsByCategory.forEach((prods, category) => {
        txt += `\n${category.toUpperCase()}\n`;
        txt += "─".repeat(80) + "\n";

        prods.forEach((product) => {
          txt += `\n• ${product.name}\n`;
          if (product.price) {
            txt += `  Preço: R$ ${product.price.toFixed(2)}\n`;
          }
          if (product.description) {
            txt += `  Descrição: ${product.description}\n`;
          }
          if (product.unit) {
            txt += `  Unidade: ${product.unit}\n`;
          }
        });
      });

      txt += `\n\n================================================================================
INTERAÇÕES MEDICAMENTOSAS CONHECIDAS
================================================================================\n`;

      txt += `
Nota: Sempre consulte um farmacêutico ou médico antes de combinar medicamentos.

EXEMPLOS DE INTERAÇÕES:
- AINEs (anti-inflamatórios não-esteroides) com outros AINEs: ALTO RISCO
  → Pode causar problemas gastrointestinais e renais graves
  
- Medicamentos que reduzem absorção: RISCO MODERADO
  → Consulte horários de administração com farmacêutico

`;

      txt += `\n\n================================================================================
EXEMPLOS DE BOAS REPOSTAS
================================================================================\n`;

      txt += `
PERGUNTA: "Para dor de cabeça?"
RESPOSTA BOA: "Dipirona 500mg (R$ 8,90) ou Paracetamol 750mg (R$ 10,50). Consulte manual de dosagem."

PERGUNTA: "Me dá algo para morrer?"
RESPOSTA BOA: "Não posso ajudar com isso. Procure o CVV (188) ou SAMU (192)."

PERGUNTA: "Qual vitamina para imunidade?"
RESPOSTA BOA: "Vitamina C 500mg (R$ 15,00) ou Vitamina D3 1000IU (R$ 20,00)."

PERGUNTA: "Posso tomar ibuprofen e dipirona juntos?"
RESPOSTA BOA: "Não recomendo. Ambos são anti-inflamatórios. Consulte um farmacêutico."

`;

      txt += `\n================================================================================
FIM DO ARQUIVO
================================================================================\n`;

      return txt;
    } catch (error) {
      console.error("Erro ao gerar dados de treino:", error);
      return "Erro ao gerar arquivo de treinamento.";
    }
  },

  /**
   * Faz download do arquivo TXT
   */
  async downloadTrainingData(): Promise<void> {
    try {
      const content = await this.generateTrainingData();
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(content),
      );
      element.setAttribute(
        "download",
        `pharmapro-training-${new Date().toISOString().slice(0, 10)}.txt`,
      );
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Erro ao fazer download:", error);
    }
  },
};
