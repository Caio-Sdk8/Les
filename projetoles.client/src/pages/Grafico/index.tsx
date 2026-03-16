import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell/AppShell";
import ProdutosGrafico from "../../components/Grafico/Grafico";
import { salesCatalogMock, type SalesSeries } from "../../mock/grafico";
import {
  ColorDot,
  ContainerPage,
  ContentGrid,
  EmptyMessage,
  FieldControl,
  FieldGroup,
  FieldLabel,
  FieldSelect,
  FilterCard,
  FilterGrid,
  FilterHint,
  LegendItem,
  LegendList,
  LegendMeta,
  LegendName,
  LegendTop,
  MetricCard,
  MetricDetail,
  MetricLabel,
  MetricValue,
  MetricsGrid,
  Panel,
  PanelHeader,
  PanelText,
  PanelTitle,
  SummaryTable,
} from "./sryle";

type AnalysisMode = "produto" | "categoria";

const SERIES_COLORS = ["#2563eb", "#ea580c"];

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const percent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;

const sum = (values: number[]) => values.reduce((acc, current) => acc + current, 0);

export default function Grafico() {
  const [mode, setMode] = useState<AnalysisMode>("produto");
  const [startPeriod, setStartPeriod] = useState(salesCatalogMock.periods[0].value);
  const [endPeriod, setEndPeriod] = useState(
    salesCatalogMock.periods[salesCatalogMock.periods.length - 1].value
  );

  const availableSeries = useMemo(
    () => (mode === "produto" ? salesCatalogMock.products : salesCatalogMock.categories),
    [mode]
  );

  const [primarySeriesId, setPrimarySeriesId] = useState(availableSeries[0]?.id ?? "");
  const [secondarySeriesId, setSecondarySeriesId] = useState("");

  useEffect(() => {
    const fallbackPrimary = availableSeries[0]?.id ?? "";
    setPrimarySeriesId((current) =>
      availableSeries.some((series) => series.id === current) ? current : fallbackPrimary
    );
    setSecondarySeriesId((current) =>
      current && availableSeries.some((series) => series.id === current) ? current : ""
    );
  }, [availableSeries]);

  const filteredPeriods = useMemo(
    () =>
      salesCatalogMock.periods.filter(
        (period) => period.value >= startPeriod && period.value <= endPeriod
      ),
    [startPeriod, endPeriod]
  );

  const clipSeries = (series: SalesSeries | undefined | null) => {
    if (!series) return null;
    return {
      ...series,
      points: series.points.filter(
        (point) => point.period >= startPeriod && point.period <= endPeriod
      ),
    };
  };

  const primarySeries = clipSeries(
    availableSeries.find((series) => series.id === primarySeriesId)
  );

  const secondarySeries = clipSeries(
    secondarySeriesId
      ? availableSeries.find((series) => series.id === secondarySeriesId)
      : null
  );

  const selectedSeries = [primarySeries, secondarySeries].filter(
    (series): series is SalesSeries => Boolean(series)
  );

  const chartSeries = selectedSeries.map((series, index) => ({
    label: series.label,
    data: series.points.map((point) => point.quantity),
    color: SERIES_COLORS[index],
  }));

  const primaryTotals = useMemo(() => {
    if (!primarySeries) {
      return { quantity: 0, revenue: 0, variation: 0 };
    }

    const quantities = primarySeries.points.map((point) => point.quantity);
    const first = quantities[0] ?? 0;
    const last = quantities[quantities.length - 1] ?? 0;
    const variation = first > 0 ? ((last - first) / first) * 100 : 0;

    return {
      quantity: sum(quantities),
      revenue: sum(primarySeries.points.map((point) => point.revenue)),
      variation,
    };
  }, [primarySeries]);

  const periodLeader = useMemo(() => {
    const ranked = availableSeries
      .map((series) => ({
        label: series.label,
        quantity: sum(
          series.points
            .filter((point) => point.period >= startPeriod && point.period <= endPeriod)
            .map((point) => point.quantity)
        ),
      }))
      .sort((a, b) => b.quantity - a.quantity);

    return ranked[0] ?? null;
  }, [availableSeries, startPeriod, endPeriod]);

  const comparisonRows = selectedSeries.map((series) => {
    const totalQuantity = sum(series.points.map((point) => point.quantity));
    const totalRevenue = sum(series.points.map((point) => point.revenue));
    const average = series.points.length > 0 ? totalQuantity / series.points.length : 0;

    return {
      id: series.id,
      label: series.label,
      totalQuantity,
      totalRevenue,
      average,
    };
  });

  return (
    <AppShell title="Análise de Vendas">
      <ContainerPage>
        <FilterCard>
          <PanelHeader>
            <PanelTitle>Filtros de análise</PanelTitle>
            <PanelText>
              Compare desempenho entre produtos ou categorias em um intervalo definido por data inicial e final.
            </PanelText>
          </PanelHeader>

          <FilterGrid>
            <FieldGroup>
              <FieldLabel htmlFor="analysis-mode">Modo de análise</FieldLabel>
              <FieldSelect
                id="analysis-mode"
                value={mode}
                onChange={(event) => setMode(event.target.value as AnalysisMode)}
              >
                <option value="produto">Produto</option>
                <option value="categoria">Categoria</option>
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="primary-series">Série principal</FieldLabel>
              <FieldSelect
                id="primary-series"
                value={primarySeriesId}
                onChange={(event) => setPrimarySeriesId(event.target.value)}
              >
                {availableSeries.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.label}
                  </option>
                ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="secondary-series">Comparação</FieldLabel>
              <FieldSelect
                id="secondary-series"
                value={secondarySeriesId}
                onChange={(event) => setSecondarySeriesId(event.target.value)}
              >
                <option value="">Sem comparação</option>
                {availableSeries
                  .filter((series) => series.id !== primarySeriesId)
                  .map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.label}
                    </option>
                  ))}
              </FieldSelect>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="start-period">Data inicial</FieldLabel>
              <FieldControl
                id="start-period"
                type="month"
                min={salesCatalogMock.periods[0].value}
                max={endPeriod}
                value={startPeriod}
                onChange={(event) => setStartPeriod(event.target.value)}
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel htmlFor="end-period">Data final</FieldLabel>
              <FieldControl
                id="end-period"
                type="month"
                min={startPeriod}
                max={salesCatalogMock.periods[salesCatalogMock.periods.length - 1].value}
                value={endPeriod}
                onChange={(event) => setEndPeriod(event.target.value)}
              />
            </FieldGroup>
          </FilterGrid>
        </FilterCard>

        <MetricsGrid>
          <MetricCard>
            <MetricLabel>Série principal</MetricLabel>
            <MetricValue>{primarySeries?.label ?? "-"}</MetricValue>
            <MetricDetail>{mode === "produto" ? "Produto analisado" : "Categoria analisada"}</MetricDetail>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Volume no período</MetricLabel>
            <MetricValue>{primaryTotals.quantity}</MetricValue>
            <MetricDetail>Unidades vendidas da série principal</MetricDetail>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Receita estimada</MetricLabel>
            <MetricValue>{currency(primaryTotals.revenue)}</MetricValue>
            <MetricDetail>Faturamento acumulado no intervalo</MetricDetail>
          </MetricCard>

          <MetricCard>
            <MetricLabel>Variação</MetricLabel>
            <MetricValue>{percent(primaryTotals.variation)}</MetricValue>
            <MetricDetail>
              {periodLeader ? `Líder do período: ${periodLeader.label}` : "Sem dados para o intervalo"}
            </MetricDetail>
          </MetricCard>
        </MetricsGrid>

        <ContentGrid>
          <Panel>
            <PanelHeader>
              <PanelTitle>Histórico comparativo</PanelTitle>
              <PanelText>
                Gráfico de linhas com a evolução temporal das séries selecionadas dentro do período informado.
              </PanelText>
            </PanelHeader>

            {chartSeries.length === 0 || filteredPeriods.length === 0 ? (
              <EmptyMessage>Nenhum dado disponível para os filtros atuais.</EmptyMessage>
            ) : (
              <ProdutosGrafico labels={filteredPeriods.map((period) => period.label)} series={chartSeries} />
            )}
          </Panel>

          <Panel>
            <PanelHeader>
              <PanelTitle>Resumo das séries</PanelTitle>
            </PanelHeader>

            <LegendList>
              {comparisonRows.map((row, index) => (
                <LegendItem key={row.id}>
                  <LegendTop>
                    <LegendName>
                      <ColorDot $color={SERIES_COLORS[index]} />
                      {row.label}
                    </LegendName>
                    <LegendMeta>{row.totalQuantity} un.</LegendMeta>
                  </LegendTop>
                  <LegendMeta>Receita: {currency(row.totalRevenue)}</LegendMeta>
                  <LegendMeta>Média por período: {row.average.toFixed(1)} un.</LegendMeta>
                </LegendItem>
              ))}
            </LegendList>
          </Panel>
        </ContentGrid>

        <Panel>
          <PanelHeader>
            <PanelTitle>Tabela analítica</PanelTitle>
          </PanelHeader>

          {comparisonRows.length === 0 ? (
            <EmptyMessage>Nenhuma série selecionada para consolidar.</EmptyMessage>
          ) : (
            <SummaryTable>
              <thead>
                <tr>
                  <th>{mode === "produto" ? "Produto" : "Categoria"}</th>
                  <th>Total vendido</th>
                  <th>Receita</th>
                  <th>Média por período</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.label}</td>
                    <td>{row.totalQuantity} un.</td>
                    <td>{currency(row.totalRevenue)}</td>
                    <td>{row.average.toFixed(1)} un.</td>
                  </tr>
                ))}
              </tbody>
            </SummaryTable>
          )}
        </Panel>
      </ContainerPage>
    </AppShell>
  );
}
