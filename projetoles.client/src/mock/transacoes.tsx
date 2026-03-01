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
    valor: 350.9,
    status: "EM_ENTREGA",
    produtos: [
      {
        id: 101,
        nome: "Notebook Dell",
        quantidade: 1,
        precoUnitario: 3200.0,
      },
      {
        id: 102,
        nome: "Mouse Logitech",
        quantidade: 2,
        precoUnitario: 75.45,
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
        nome: "Teclado Mecânico",
        quantidade: 1,
        precoUnitario: 89.9,
      },
    ],
  },
  {
    id: 3,
    codigo: "TRX-003",
    valor: 540.0,
    status: "PENDENTE",
    produtos: [
      {
        id: 104,
        nome: "Monitor 24''",
        quantidade: 1,
        precoUnitario: 540.0,
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
        nome: "Headset Gamer",
        quantidade: 1,
        precoUnitario: 120.0,
      },
    ],
  },
];
