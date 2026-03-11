export interface Endereco {
  id: number;
  apelido?: string;
  cep: string;
  tipo: "Cobrança" | "Entrega";
  cidade: string;
  estado: string;
}

export const enderecosMock: Endereco[] = [
  {
    id: 1,
    apelido: "Casa",
    cep: "08710-230",
    tipo: "Entrega",
    cidade: "Mogi das Cruzes",
    estado: "SP",
  },
  {
    id: 2,
    apelido: "Trabalho",
    cep: "04567-000",
    tipo: "Cobrança",
    cidade: "São Paulo",
    estado: "SP",
  },
  {
    id: 3,
    cep: "20040-020",
    tipo: "Entrega",
    cidade: "Rio de Janeiro",
    estado: "RJ",
  },
  {
    id: 4,
    apelido: "Casa da mãe",
    cep: "30130-110",
    tipo: "Cobrança",
    cidade: "Belo Horizonte",
    estado: "MG",
  },
  {
    id: 5,
    cep: "80010-000",
    tipo: "Entrega",
    cidade: "Curitiba",
    estado: "PR",
  },
];
