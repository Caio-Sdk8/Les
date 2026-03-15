import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/AppShell/AppShell";
import {
  PrescriptionType,
  productService,
  type ProductDetail,
  type ProductSummary,
} from "../../services/catalog/productService";
import {
  Actions,
  BackButton,
  Card,
  Chip,
  ChipRow,
  Content,
  EmptyState,
  Grid,
  Hero,
  ImagePanel,
  LoadingWrap,
  Notice,
  Page,
  PriceBlock,
  PriceLabel,
  PriceValue,
  PrimaryButton,
  ProductTitle,
  SectionTitle,
  SecondaryButton,
  SmallText,
  SpecItem,
  SpecLabel,
  SpecsGrid,
  SpecValue,
  Subtitle,
  SubstituteCard,
  SubstituteList,
} from "./style";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&h=720&fit=crop&q=80";

const PRESCRIPTION_TEXT: Record<PrescriptionType, string> = {
  [PrescriptionType.None]: "Venda livre",
  [PrescriptionType.TarjaAmarela]: "Tarja amarela",
  [PrescriptionType.TarjaVermelha]: "Tarja vermelha",
  [PrescriptionType.TarjaPreta]: "Tarja preta",
};

const PRESCRIPTION_TONE: Record<
  PrescriptionType,
  "ok" | "neutral" | "yellow" | "red" | "black"
> = {
  [PrescriptionType.None]: "ok",
  [PrescriptionType.TarjaAmarela]: "yellow",
  [PrescriptionType.TarjaVermelha]: "red",
  [PrescriptionType.TarjaPreta]: "black",
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDimension = (value?: number, suffix = "cm") =>
  value ? `${value.toLocaleString("pt-BR")} ${suffix}` : "Não informado";

export default function Produto() {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [substitutes, setSubstitutes] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!uuid) {
      setError("Produto inválido.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const [productResult, substituteResult] = await Promise.all([
          productService.getProductByUuid(uuid),
          productService.getSubstitutes(uuid),
        ]);

        if (cancelled) return;

        setProduct(productResult);
        setSubstitutes(substituteResult.filter((item) => item.uuid !== uuid));
      } catch {
        if (!cancelled) setError("Não foi possível carregar o produto.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [uuid]);

  const stockTone = useMemo(() => {
    if (!product) return "neutral" as const;
    return product.availableStock > 0 ? "ok" as const : "warn" as const;
  }, [product]);

  if (loading) {
    return (
      <AppShell title="Produto">
        <LoadingWrap>Carregando produto...</LoadingWrap>
      </AppShell>
    );
  }

  if (error || !product) {
    return (
      <AppShell title="Produto">
        <Page>
          <BackButton type="button" onClick={() => navigate("/loja")}>
            Voltar para a loja
          </BackButton>
          <EmptyState>{error || "Produto não encontrado."}</EmptyState>
        </Page>
      </AppShell>
    );
  }

  return (
    <AppShell title="Detalhes do Produto">
      <Page>
        <BackButton type="button" onClick={() => navigate(-1)}>
          ← Voltar
        </BackButton>

        <Hero>
          <ImagePanel>
            <img src={product.imageUrl || DEFAULT_IMAGE} alt={product.name} />
          </ImagePanel>

          <Content>
            <ChipRow>
              <Chip>{product.productCode}</Chip>
              <Chip $tone={stockTone}>
                {product.availableStock > 0
                  ? `${product.availableStock} unidade(s) disponíveis`
                  : "Sem estoque disponível"}
              </Chip>
              <Chip $tone={PRESCRIPTION_TONE[product.prescriptionType]}>
                {PRESCRIPTION_TEXT[product.prescriptionType]}
              </Chip>
            </ChipRow>

            <ProductTitle>{product.name}</ProductTitle>
            <Subtitle>
              {product.description ||
                product.activePrinciple ||
                "Produto farmacêutico disponível na vitrine digital."}
            </Subtitle>

            <PriceBlock>
              <PriceLabel>Preço atual</PriceLabel>
              <PriceValue>{formatCurrency(product.salePrice)}</PriceValue>
            </PriceBlock>

            {product.prescriptionType !== PrescriptionType.None && (
              <Notice>
                Este medicamento exige atenção à prescrição. Confirme o tipo de tarja e as regras de venda antes de finalizar o pedido.
              </Notice>
            )}

            <Actions>
              <PrimaryButton type="button" onClick={() => navigate("/carrinho")}>
                Ir para o carrinho
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => navigate("/loja")}>
                Continuar comprando
              </SecondaryButton>
            </Actions>
          </Content>
        </Hero>

        <Grid>
          <Card>
            <SectionTitle>Informações técnicas</SectionTitle>
            <SpecsGrid>
              <SpecItem>
                <SpecLabel>Princípio ativo</SpecLabel>
                <SpecValue>{product.activePrinciple || "Não informado"}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Código de barras</SpecLabel>
                <SpecValue>{product.barcode || "Não informado"}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Grupo de precificação</SpecLabel>
                <SpecValue>{product.pricingGroupName || "Não informado"}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Categorias</SpecLabel>
                <SpecValue>{product.categories.join(", ") || "Não informado"}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Altura</SpecLabel>
                <SpecValue>{formatDimension(product.heightCm)}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Largura</SpecLabel>
                <SpecValue>{formatDimension(product.widthCm)}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Profundidade</SpecLabel>
                <SpecValue>{formatDimension(product.depthCm)}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Peso</SpecLabel>
                <SpecValue>{formatDimension(product.weightGrams, "g")}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Estoque reservado</SpecLabel>
                <SpecValue>{product.blockedStock}</SpecValue>
              </SpecItem>
            </SpecsGrid>
          </Card>

          <Card>
            <SectionTitle>Substitutos e similares</SectionTitle>
            {substitutes.length === 0 ? (
              <EmptyState>Nenhum substituto genérico encontrado para este item.</EmptyState>
            ) : (
              <SubstituteList>
                {substitutes.map((substitute) => (
                  <SubstituteCard
                    key={substitute.uuid}
                    type="button"
                    onClick={() => navigate(`/produto/${substitute.uuid}`)}
                  >
                    <strong>{substitute.name}</strong>
                    <SmallText>
                      {substitute.activePrinciple || "Princípio ativo não informado"}
                    </SmallText>
                    <SmallText>{formatCurrency(substitute.salePrice)}</SmallText>
                  </SubstituteCard>
                ))}
              </SubstituteList>
            )}
          </Card>
        </Grid>
      </Page>
    </AppShell>
  );
}