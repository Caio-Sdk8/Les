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
};

const ModalSenha = ({
  back,
  next,
  title,
  message,
  message2,
  button,
  button2,
  height,
  width,
}: Props) => {
  return (
    <Overlay>
      <ModalContainerSmall width={width ?? "auto"} height={height ?? "auto"}>
        <ModalHeader>
          <ModalTitleError>{title}</ModalTitleError>
        </ModalHeader>

        <ModalSection>
          {message && <ModalSubtitle>{message}</ModalSubtitle>}
          {message2 && <ModalSubtitle>{message2}</ModalSubtitle>}

          <InputWrapper>
            <DivLabel>
              <Label>Senha Atual</Label>
            </DivLabel>

            <InputSing placeholder="Digite a senha atual" type="password" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Nova Senha</Label>
            </DivLabel>

            <InputSing placeholder="Digite a nova senha" type="password" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Confirme a nova senha</Label>
            </DivLabel>

            <InputSing
              placeholder="Digite o nova senha novamente"
              type="password"
            />
          </InputWrapper>
        </ModalSection>
        <ModalButtons>
          {button2 && (
            <ModalButtonWarningWhite onClick={back}>
              {button2}
            </ModalButtonWarningWhite>
          )}
          {button && (
            <ModalButtonWarning onClick={next}>{button}</ModalButtonWarning>
          )}
        </ModalButtons>
      </ModalContainerSmall>
    </Overlay>
  );
};

export default ModalSenha;
