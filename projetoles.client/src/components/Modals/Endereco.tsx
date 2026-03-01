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

const ModalEndereco = ({
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
              <Label>Tipo de Endereço</Label>
            </DivLabel>

            <InputSing placeholder="Digite o tipo de endereço" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Tipo de Residência</Label>
            </DivLabel>

            <InputSing placeholder="Digite o tipo de residência" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Tipo de Logradouro</Label>
            </DivLabel>

            <InputSing placeholder="Digite o tipo de logradouro" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Número</Label>
            </DivLabel>

            <InputSing placeholder="Digite o número" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Bairro</Label>
            </DivLabel>

            <InputSing placeholder="Digite o bairro" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>CEP</Label>
            </DivLabel>

            <InputSing placeholder="Digite o CEP" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Cidade</Label>
            </DivLabel>

            <InputSing placeholder="Digite a cidade" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Estado</Label>
            </DivLabel>

            <InputSing placeholder="Digite o estado" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>País</Label>
            </DivLabel>

            <InputSing placeholder="Digite o país" />
          </InputWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Observações</Label>
            </DivLabel>

            <InputSing placeholder="Digite as observações" />
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

export default ModalEndereco;
