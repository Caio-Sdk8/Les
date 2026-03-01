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

const ModalCartao = ({
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
              <Label>Nome do titular</Label>
            </DivLabel>

            <InputSing placeholder="Digite o nome do titular" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Número do Cartão</Label>
            </DivLabel>

            <InputSing placeholder="Digite o número do cartão" />
          </InputWrapper>

          <DivSeparator>
            <InputWrapper>
              <DivLabel>
                <Label>Bandeira</Label>
              </DivLabel>

              <InputSing placeholder="Digite a bandeira" />
            </InputWrapper>

            <InputWrapper>
              <DivLabel>
                <Label>Código de Segurança</Label>
              </DivLabel>

              <InputSing placeholder="Digite o código de segurança" />
            </InputWrapper>
          </DivSeparator>
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

export default ModalCartao;
