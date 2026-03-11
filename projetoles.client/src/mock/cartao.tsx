export interface Cartao {
  id: number;
  titular: string;
  bandeira: "visa" | "mastercard" | "elo" | "amex";
  preferencial: boolean;
}

export const cartoesMock: Cartao[] = [
  {
    id: 1,
    titular: "João Silva",
    bandeira: "visa",
    preferencial: true,
  },
  {
    id: 2,
    titular: "João Silva",
    bandeira: "mastercard",
    preferencial: false,
  },
  {
    id: 3,
    titular: "João Silva",
    bandeira: "elo",
    preferencial: false,
  },
  {
    id: 4,
    titular: "João Silva",
    bandeira: "amex",
    preferencial: false,
  },
];
