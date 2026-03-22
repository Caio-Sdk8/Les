import * as yup from "yup";

export const cardSchema = yup.object({
  printedName: yup
    .string()
    .required("O nome do titular é obrigatório")
    .min(3, "O nome do titular deve ter pelo menos 3 caracteres")
    .max(100, "O nome do titular deve ter no máximo 100 caracteres"),

  cardNumber: yup
    .string()
    .transform((value) => value?.replace(/\s/g, "") || "")
    .required("O número do cartão é obrigatório")
    .matches(
      /^\d{13,19}$/,
      "O número do cartão deve ter entre 13 e 19 dígitos",
    ),

  cardBrandUuid: yup.string().required("A bandeira é obrigatória"),

  securityCode: yup
    .string()
    .required("O código de segurança é obrigatório")
    .matches(/^\d{3,4}$/, "O código de segurança deve ter 3 ou 4 dígitos"),

  expirationDate: yup.string().required("A data de validade é obrigatória"),
});

export type CardFormData = yup.InferType<typeof cardSchema>;
