// validations/schemas/CadastroEndereco.ts
import * as yup from "yup";

export const addressSchema = yup.object({
  addressType: yup
    .number()
    .min(1, "Selecione o tipo de endereço")
    .required("Obrigatório"),
  residenceType: yup
    .number()
    .min(1, "Selecione o tipo de residência")
    .required("Obrigatório"),
  label: yup.string().required("Obrigatório"),
  streetType: yup.string().required("Obrigatório"),
  street: yup.string().required("Rua obrigatória"),
  number: yup.string().required("Número obrigatório"),
  neighborhood: yup.string().required("Bairro obrigatório"),
  zipCode: yup.string().required("CEP obrigatório"),
  city: yup.string().required("Cidade obrigatória"),
  state: yup.string().required("Estado obrigatório"),
  country: yup.string().default("Brasil").required("País obrigatório"),
  observations: yup.string().optional().default(""),
});

export type AddressFormData = yup.InferType<typeof addressSchema>;
