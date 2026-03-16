export interface SalesPoint {
  period: string;
  label: string;
  quantity: number;
  revenue: number;
}

export interface SalesSeries {
  id: string;
  label: string;
  points: SalesPoint[];
}

export interface SalesCatalog {
  periods: Array<{ value: string; label: string }>;
  products: SalesSeries[];
  categories: SalesSeries[];
}

const periods = [
  { value: "2025-11", label: "Nov/2025" },
  { value: "2025-12", label: "Dez/2025" },
  { value: "2026-01", label: "Jan/2026" },
  { value: "2026-02", label: "Fev/2026" },
  { value: "2026-03", label: "Mar/2026" },
];

const productSeries = (
  id: string,
  label: string,
  quantities: number[],
  revenues: number[]
): SalesSeries => ({
  id,
  label,
  points: periods.map((period, index) => ({
    period: period.value,
    label: period.label,
    quantity: quantities[index],
    revenue: revenues[index],
  })),
});

export const salesCatalogMock: SalesCatalog = {
  periods,
  products: [
    productSeries("dipirona-1g", "Dipirona 1g", [180, 166, 194, 172, 208], [2680, 2490, 2910, 2580, 3120]),
    productSeries("advil-400mg", "Advil 400mg", [92, 108, 124, 110, 138], [2658.8, 3121.2, 3583.6, 3179, 3988.2]),
    productSeries("amoxicilina-500mg", "Amoxicilina 500mg", [74, 69, 88, 95, 102], [7400, 6900, 8800, 9500, 10200]),
    productSeries("clonazepam-2mg", "Clonazepam 2mg", [41, 44, 48, 53, 51], [1599, 1716, 1872, 2067, 1989]),
  ],
  categories: [
    productSeries("analgesicos", "Analgésicos", [272, 274, 318, 282, 346], [5338.8, 5611.2, 6493.6, 5759, 7108.2]),
    productSeries("antibioticos", "Antibióticos", [74, 69, 88, 95, 102], [7400, 6900, 8800, 9500, 10200]),
    productSeries("controlados", "Medicamentos controlados", [41, 44, 48, 53, 51], [1599, 1716, 1872, 2067, 1989]),
  ],
};
