import { useMemo, useState } from "react";
import produtos from "../../mock/produtos";
import { StoreCarouselSection } from "../../components/StoreCarouselSection/StoreCarouselSection";
import {
  StoreCategories,
  StoreCategory,
} from "../../components/StoreCategories/StoreCategories";
import { StoreHeader } from "../../components/StoreHeader/StoreHeader";
import { StoreHighlights } from "../../components/StoreHighlights/StoreHighlights";
import { StoreImageTiles } from "../../components/StoreImageTiles/StoreImageTiles";
import { StoreProduct } from "../../components/StoreProductCard/StoreProductCard";
import {
  BannerButton,
  BannerDescription,
  BannerTitle,
  HeroBanner,
  Main,
  PageContent,
  SectionStack,
} from "./style";

const categories: StoreCategory[] = [
  { id: "all", name: "Todos", icon: "🛍️" },
  { id: "med", name: "Medicamentos", icon: "💊" },
  { id: "bem", name: "Bem-estar", icon: "🌿" },
  { id: "dor", name: "Dor e Febre", icon: "🌡️" },
  { id: "al", name: "Alergia", icon: "🤧" },
  { id: "dig", name: "Digestivo", icon: "🧪" },
  { id: "vit", name: "Vitaminas", icon: "🍊" },
  { id: "hig", name: "Higiene", icon: "🧼" },
];

const careTiles = [
  {
    id: "tile-1",
    title: "Cuidados com a pele",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=420&h=260&fit=crop&q=80",
  },
  {
    id: "tile-2",
    title: "Hidratação diária",
    image:
      "https://images.unsplash.com/photo-1585238341986-3e0f95f57f5f?w=420&h=260&fit=crop&q=80",
  },
  {
    id: "tile-3",
    title: "Rotina facial",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=420&h=260&fit=crop&q=80",
  },
  {
    id: "tile-4",
    title: "Saúde e energia",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=420&h=260&fit=crop&q=80",
  },
  {
    id: "tile-5",
    title: "Autocuidado",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=420&h=260&fit=crop&q=80",
  },
];

const Loja = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const catalog = useMemo<StoreProduct[]>(() => {
    const sequence = [
      "Medicamentos",
      "Dor e Febre",
      "Bem-estar",
      "Alergia",
      "Digestivo",
      "Vitaminas",
    ];
    const warnings = [
      "Uso adulto",
      "Genérico",
      "Sem açúcar",
      "Venda livre",
      "Uso contínuo",
      "Uso oral",
    ];

    return produtos.map((item, index) => ({
      ...item,
      categoria: sequence[index % sequence.length],
      aviso: warnings[index % warnings.length],
      desconto: 10 + ((item.id * 7) % 26),
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    return catalog.filter((product) => {
      const matchCategory =
        activeCategory === "Todos" || product.categoria === activeCategory;

      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        term.length === 0 ||
        product.nome.toLowerCase().includes(term) ||
        (product.descricao ?? "").toLowerCase().includes(term) ||
        (product.categoria ?? "").toLowerCase().includes(term);

      return matchCategory && matchSearch;
    });
  }, [activeCategory, catalog, searchTerm]);

  const popularProducts = filteredProducts;
  const offerProducts = [...filteredProducts]
    .sort((a, b) => (b.desconto ?? 0) - (a.desconto ?? 0))
    .slice(0, 8);
  const weekProducts = [...filteredProducts]
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 8);

  return (
    <Main>
      <StoreHeader searchValue={searchTerm} onSearchChange={setSearchTerm} />
      <StoreCategories
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <PageContent>
        <HeroBanner>
          <BannerTitle>Farmácia online com ofertas todos os dias</BannerTitle>
          <BannerDescription>
            Um layout mais clean, leve e flexível, com foco em busca rápida,
            categorias interativas e vitrines com carrossel.
          </BannerDescription>
          <BannerButton type="button">Aproveitar promoções</BannerButton>
        </HeroBanner>

        <StoreHighlights
          items={[
            {
              id: "highlight-1",
              title: "Entrega Expressa",
              text: "Receba seus itens com agilidade",
            },
            {
              id: "highlight-2",
              title: "Preço Competitivo",
              text: "Condições especiais da semana",
            },
            {
              id: "highlight-3",
              title: "Compra Segura",
              text: "Produtos e marcas confiáveis",
            },
            {
              id: "highlight-4",
              title: "Retire na Loja",
              text: "Mais conveniência para o cliente",
            },
          ]}
        />

        <SectionStack>
          <StoreCarouselSection
            title="Mais comprados"
            products={popularProducts}
            onAddToCart={(product) => console.log("adicionar", product.id)}
          />

          <StoreCarouselSection
            title="Ofertas imperdíveis"
            products={offerProducts}
            onAddToCart={(product) => console.log("adicionar", product.id)}
          />

          <StoreImageTiles title="Cuidados que você merece" items={careTiles} />

          <StoreCarouselSection
            title="Destaques da semana"
            products={weekProducts}
            onAddToCart={(product) => console.log("adicionar", product.id)}
          />
        </SectionStack>
      </PageContent>
    </Main>
  );
};

export default Loja;
