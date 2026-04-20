import * as yup from "yup";

export const cardSchema = yup.object({
  printedName: yup
    .string()
    .trim()
    .required("O nome do titular é obrigatório")
    .min(3, "O nome do titular deve ter pelo menos 3 caracteres")
    .max(100, "O nome do titular deve ter no máximo 100 caracteres")
    .matches(
      /^[A-Za-zÀ-ÿ'\-\s]+$/,
      "Use apenas letras e espaços no nome do titular",
    ),

  cardNumber: yup
    .string()
    .transform((value) => value?.replace(/\D/g, "") || "")
    .required("O número do cartão é obrigatório")
    .matches(
      /^\d{13,19}$/,
      "O número do cartão deve ter entre 13 e 19 dígitos",
    ),

  cardBrandUuid: yup.string().required("A bandeira é obrigatória"),

  securityCode: yup
    .string()
    .transform((value) => value?.replace(/\D/g, "") || "")
    .required("O código de segurança é obrigatório")
    .matches(/^\d{3,4}$/, "O código de segurança deve ter 3 ou 4 dígitos"),

  expirationDate: yup
    .string()
    .required("A validade é obrigatória")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use o formato MM/AA")
    .test(
      "future-date",
      "Cartão vencido",
      (value) => {
        if (!value) return false;

        const [monthRaw, yearRaw] = value.split("/");
        const month = Number(monthRaw);
        const year = Number(`20${yearRaw}`);

        if (!Number.isInteger(month) || !Number.isInteger(year)) {
          return false;
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        return year > currentYear || (year === currentYear && month >= currentMonth);
      },
    ),

  isPreferred: yup.boolean().default(true),
});

export type CardFormData = yup.InferType<typeof cardSchema>;
