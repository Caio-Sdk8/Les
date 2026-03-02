export type StatusTransacao =
  | "PENDENTE"
  | "PAGO"
  | "EM_PROCESSAMENTO"
  | "EM_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Transacao {
  id: number;
  codigo: string;
  valor: number;
  status: StatusTransacao;
  produtos: Produto[];
}

export const transacoesMock: Transacao[] = [
  {
    id: 1,
    codigo: "TRX-001",
    valor: 124.8,
    status: "EM_ENTREGA",
    produtos: [
      {
        id: 101,
        nome: "Dipirona 500mg",
        quantidade: 2,
        precoUnitario: 12.4,
      },
      {
        id: 102,
        nome: "Amoxicilina 500mg",
        quantidade: 1,
        precoUnitario: 100.0,
      },
    ],
  },
  {
    id: 2,
    codigo: "TRX-002",
    valor: 89.9,
    status: "ENTREGUE",
    produtos: [
      {
        id: 103,
        nome: "Insulina Regular",
        quantidade: 1,
        precoUnitario: 89.9,
      },
    ],
  },
  {
    id: 3,
    codigo: "TRX-003",
    valor: 54.0,
    status: "PENDENTE",
    produtos: [
      {
        id: 104,
        nome: "Paracetamol 750mg",
        quantidade: 3,
        precoUnitario: 18.0,
      },
    ],
  },
  {
    id: 4,
    codigo: "TRX-004",
    valor: 120.0,
    status: "CANCELADO",
    produtos: [
      {
        id: 105,
        nome: "Omeprazol 20mg",
        quantidade: 2,
        precoUnitario: 60.0,
      },
    ],
  },
];
