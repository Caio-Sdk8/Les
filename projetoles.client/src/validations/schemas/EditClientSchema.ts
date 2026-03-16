import * as yup from "yup";
import { GenderEnum, PhoneTypeEnum } from "../interfaces/interfaces";

export const EditClienteSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),

  gender: yup
    .number()
    .oneOf(Object.values(GenderEnum), "Gênero inválido")
    .required("Gênero é obrigatório"),

  birthDate: yup.string().required("Data de nascimento é obrigatória"),

  cpf: yup.string().required("CPF é obrigatório"),

  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
});

export type EditClienteForm = yup.InferType<typeof EditClienteSchema>;
