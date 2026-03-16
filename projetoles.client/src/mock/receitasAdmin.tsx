export type PrescriptionReviewStatus = "PENDENTE" | "APROVADA" | "REPROVADA";

export interface PrescriptionReviewItem {
  id: number;
  transactionCode: string;
  customerName: string;
  customerDocument: string;
  sentAt: string;
  fileName: string;
  status: PrescriptionReviewStatus;
  products: Array<{
    name: string;
    quantity: number;
    prescriptionLabel: string;
  }>;
  note: string;
}

export const prescriptionReviewsMock: PrescriptionReviewItem[] = [
  {
    id: 1,
    transactionCode: "PED-2048",
    customerName: "Mariana Alves",
    customerDocument: "123.456.789-10",
    sentAt: "16/03/2026 09:40",
    fileName: "receita-amoxicilina.pdf",
    status: "PENDENTE",
    note: "Receita enviada no checkout aguardando análise.",
    products: [
      { name: "Amoxicilina 500mg", quantity: 1, prescriptionLabel: "Tarja vermelha" },
      { name: "Dipirona 1g", quantity: 1, prescriptionLabel: "Isento" },
    ],
  },
  {
    id: 2,
    transactionCode: "PED-2054",
    customerName: "Carlos Henrique",
    customerDocument: "987.654.321-00",
    sentAt: "16/03/2026 10:15",
    fileName: "receita-controlado.jpg",
    status: "APROVADA",
    note: "Receita legível e dentro do prazo de validade.",
    products: [
      { name: "Clonazepam 2mg", quantity: 1, prescriptionLabel: "Tarja preta" },
    ],
  },
  {
    id: 3,
    transactionCode: "PED-2061",
    customerName: "Fernanda Souza",
    customerDocument: "456.789.123-44",
    sentAt: "16/03/2026 11:05",
    fileName: "receita-ilegivel.pdf",
    status: "REPROVADA",
    note: "Documento sem identificação completa do prescritor.",
    products: [
      { name: "Azitromicina 500mg", quantity: 1, prescriptionLabel: "Tarja vermelha" },
    ],
  },
];