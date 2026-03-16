import * as yup from "yup";

export const ChangePasswordSchema = yup.object({
  currentPassword: yup.string().required("A senha atual é obrigatória"),

  newPassword: yup
    .string()
    .required("A nova senha é obrigatória")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .matches(/[0-9]/, "A senha deve conter pelo menos um número")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "A senha deve conter pelo menos um caractere especial",
    ),

  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref("newPassword")], "As senhas não conferem")
    .required("Confirmação da nova senha é obrigatória"),
});
