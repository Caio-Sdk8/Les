import * as yup from "yup";
import {
  GenderEnum,
  PhoneTypeEnum,
  ResidenceTypeEnum,
  StreetTypeEnum,
} from "../interfaces/interfaces";

// endereço
export const AddressSchema = yup.object({
  zipCode: yup.string().required("CEP é obrigatório"),
  street: yup.string().required("Rua é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  neighborhood: yup.string().required("Bairro é obrigatório"),
  state: yup.string().required("Estado é obrigatório"),
  city: yup.string().required("Cidade é obrigatória"),
  country: yup.string().required("País é obrigatório"),

  residenceType: yup
    .number()
    .oneOf(Object.values(ResidenceTypeEnum), "Tipo de residência inválido")
    .required("Tipo de residência é obrigatório"),

  streetType: yup
    .mixed<(typeof StreetTypeEnum)[number]>()
    .oneOf(StreetTypeEnum, "Tipo de logradouro inválido")
    .required("Tipo de logradouro é obrigatório"),

  observations: yup.string().optional(),
  label: yup.string().optional(),
});

// cartão de crédito
export const CardSchema = yup.object({
  cardBrandName: yup.string().required("Bandeira é obrigatória"),
  cardNumber: yup.string().required("Número do cartão é obrigatório"),
  printedName: yup.string().required("Nome impresso é obrigatório"),
  securityCode: yup.string().required("CVV é obrigatório"),
  expirationDate: yup.string().required("Validade é obrigatória"),
});

// formulário completo
export const CadastroClienteSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),

  gender: yup
    .number()
    .oneOf(Object.values(GenderEnum), "Gênero inválido")
    .required("Gênero é obrigatório"),

  birthDate: yup.string().required("Data de nascimento é obrigatória"),
  cpf: yup.string().required("CPF é obrigatório"),
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),

  phoneType: yup
    .number()
    .oneOf(Object.values(PhoneTypeEnum), "Tipo de telefone inválido")
    .required("Tipo de telefone é obrigatório"),

  areaCode: yup.string().required("DDD é obrigatório"),
  phoneNumber: yup.string().required("Telefone é obrigatório"),

  password: yup.string().required("Senha é obrigatória"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password")], "As senhas não conferem")
    .required("Confirmação de senha é obrigatória"),

  billingAddress: AddressSchema.required(),
  deliveryAddress: AddressSchema.required(),

  cards: yup
    .array()
    .of(CardSchema)
    .min(1, "É necessário ter pelo menos um cartão")
    .required("É necessário ter pelo menos um cartão"),
});

// interface para React Hook Form
export type CadastroClienteForm = yup.InferType<typeof CadastroClienteSchema>;
