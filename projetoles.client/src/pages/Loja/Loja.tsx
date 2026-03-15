import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoreCarouselSection } from "../../components/StoreCarouselSection/StoreCarouselSection";
import {
  StoreCategories,
  StoreCategory,
} from "../../components/StoreCategories/StoreCategories";
import { StoreHighlights } from "../../components/StoreHighlights/StoreHighlights";
import { StoreImageTiles } from "../../components/StoreImageTiles/StoreImageTiles";
import { StoreProduct } from "../../components/StoreProductCard/StoreProductCard";
import {
  categoryService,
  productService,
  ProductSummary,
  PrescriptionType,
} from "../../services/catalog/productService";
import { cartService } from "../../services/cart/cartService";
import {
  BannerButton,
  BannerDescription,
  BannerTitle,
  CatalogSearchInput,
  HeroBanner,
  Main,
  PageContent,
  SectionStack,
} from "./style";
import { AppShell } from "../../components/AppShell/AppShell";

const CATEGORY_ICONS: Record<string, string> = {
  Medicamentos: "💊",
  "Bem-estar": "🌿",
  "Dor e Febre": "🌡️",
  Alergia: "🤧",
  Digestivo: "🧪",
  Vitaminas: "🍊",
  Higiene: "🧼",
  Dermocosméticos: "🧴",
  Antibióticos: "🔬",
  "Tarja Vermelha": "🔴",
};

const PRESCRIPTION_LABELS: Record<PrescriptionType, string> = {
  [PrescriptionType.None]: "Venda livre",
  [PrescriptionType.TarjaAmarela]: "Tarja Amarela",
  [PrescriptionType.TarjaVermelha]: "Tarja Vermelha",
  [PrescriptionType.TarjaPreta]: "Tarja Preta",
};

function toStoreProduct(p: ProductSummary): StoreProduct {
  return {
    id: p.uuid,
    uuid: p.uuid,
    nome: p.name,
    valor: p.salePrice,
    imagem:
      p.imageUrl ||
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=80",
    descricao: p.activePrinciple,
    categoria: p.categories[0] ?? "",
    aviso: PRESCRIPTION_LABELS[p.prescriptionType],
  };
}
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
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [apiProducts, setApiProducts] = useState<ProductSummary[]>([]);
  const [apiCategories, setApiCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const handleAddToCart = (product: StoreProduct) => {
    if (!product.uuid) return;
    cartService.addItem(product.uuid, 1);
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [productResult, cats] = await Promise.all([
          productService.getProducts({ pageSize: 100, isActive: true }),
          categoryService.getAll(),
        ]);
        if (!cancelled) {
          setApiProducts(productResult.items);
          const storeCategories: StoreCategory[] = [
            { id: "all", name: "Todos", icon: "🛍️" },
            ...cats.map((c) => ({
              id: c.uuid,
              name: c.name,
              icon: CATEGORY_ICONS[c.name] ?? "📦",
            })),
          ];
          setApiCategories(storeCategories);
        }
      } catch {
        // mantém tela funcional mesmo sem API
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const catalog = useMemo<StoreProduct[]>(
    () => apiProducts.map(toStoreProduct),
    [apiProducts]
  );

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
  const weekProducts = [...filteredProducts].slice(0, 8);

  if (loading) {
    return (
      <AppShell title="Loja">
        <Main>
          <PageContent>
            <p style={{ color: "var(--color-muted)", padding: "32px 0" }}>Carregando produtos...</p>
          </PageContent>
        </Main>
      </AppShell>
    );
  }

  return (
    <AppShell title="Loja">
      <Main>
      <StoreCategories
        categories={apiCategories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <PageContent>
        <CatalogSearchInput
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Buscar produto, categoria ou marca"
        />

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
            onAddToCart={handleAddToCart}
            onProductClick={(product) => {
              if (product.uuid) navigate(`/produto/${product.uuid}`);
            }}
          />


          <StoreImageTiles title="Cuidados que você merece" items={careTiles} />

          <StoreCarouselSection
            title="Destaques da semana"
            products={weekProducts}
            onAddToCart={handleAddToCart}
            onProductClick={(product) => {
              if (product.uuid) navigate(`/produto/${product.uuid}`);
            }}
          />
        </SectionStack>
      </PageContent>
      </Main>
    </AppShell>
  );
};

export default Loja;
