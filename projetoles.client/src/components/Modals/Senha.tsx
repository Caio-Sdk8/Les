import { useForm } from "react-hook-form";
import {
  DivLabel,
  DivSeparator,
  InputSing,
  InputWrapper,
  Label,
} from "../../pages/Cadastro/style";
import {
  IconModal,
  ModalButtons,
  ModalButtonWarning,
  ModalButtonWarningWhite,
  ModalContainerSmall,
  ModalHeader,
  ModalSection,
  ModalSubtitle,
  ModalTitleError,
  Overlay,
} from "./style";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangePasswordSchema } from "../../validations/schemas/ChangePassword";
import { UpdatePassword } from "../../services/requests/editPassword";

type Props = {
  back?: () => void;
  next: () => void;
  title: string;
  message?: string;
  message2?: string;
  button?: string;
  button2?: string;
  height?: string;
  width?: string;
  uuid: string;
};

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

const ModalSenha = ({
  back,
  next,
  title,
  message,
  message2,
  uuid,
  button,
  button2,
  height,
  width,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({
    resolver: yupResolver(ChangePasswordSchema),
  });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await UpdatePassword(uuid, data);
      alert("Senha alterada com sucesso!");
      next();
    } catch (err: any) {
      console.error(err);
      alert(
        "Erro ao alterar senha: " +
          (err.response?.data?.message || err.message),
      );
    }
  };

  return (
    <Overlay>
      <ModalContainerSmall width={width ?? "auto"} height={height ?? "auto"}>
        <ModalHeader>
          <ModalTitleError>{title}</ModalTitleError>
        </ModalHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalSection>
            {message && <ModalSubtitle>{message}</ModalSubtitle>}
            {message2 && <ModalSubtitle>{message2}</ModalSubtitle>}

            <InputWrapper>
              <DivLabel>
                <Label>Senha Atual</Label>
              </DivLabel>
              <InputSing
                placeholder="Digite a senha atual"
                type="password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <span style={{ color: "red" }}>
                  {errors.currentPassword.message}
                </span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Nova Senha</Label>
              </DivLabel>
              <InputSing
                placeholder="Digite a nova senha"
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <span style={{ color: "red" }}>
                  {errors.newPassword.message}
                </span>
              )}
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Confirme a nova senha</Label>
              </DivLabel>
              <InputSing
                placeholder="Digite a nova senha novamente"
                type="password"
                {...register("newPasswordConfirmation")}
              />
              {errors.newPasswordConfirmation && (
                <span style={{ color: "red" }}>
                  {errors.newPasswordConfirmation.message}
                </span>
              )}
            </InputWrapper>
          </ModalSection>

          <ModalButtons>
            {button2 && (
              <ModalButtonWarningWhite type="button" onClick={back}>
                {button2}
              </ModalButtonWarningWhite>
            )}
            {button && (
              <ModalButtonWarning type="submit" disabled={isSubmitting}>
                {button}
              </ModalButtonWarning>
            )}
          </ModalButtons>
        </form>
      </ModalContainerSmall>
    </Overlay>
  );
};

export default ModalSenha;
