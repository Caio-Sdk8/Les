export const GenderEnum = {
  Masculino: 1,
  Feminino: 2,
  NaoBinario: 3,
  PrefiroNaoInformar: 4,
} as const;

export const PhoneTypeEnum = {
  Celular: 1,
  Residencial: 2,
  Comercial: 3,
  Outro: 4,
} as const;

export const ResidenceTypeEnum = {
  Casa: 1,
  Apartamento: 2,
  Condominio: 3,
  Comercial: 4,
  Outro: 5,
} as const;

export const StreetTypeEnum = [
  "Rua",
  "Avenida",
  "Alameda",
  "Travessa",
  "Estrada",
  "Praça",
  "Largo",
  "Outro",
] as const;
