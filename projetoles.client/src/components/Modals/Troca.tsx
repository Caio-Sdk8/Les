import { useState } from "react";
import {
  DivLabel,
  DivSeparator,
  InputSing,
  InputWrapper,
  Label,
} from "../../pages/Cadastro/style";
import RefundSelector from "../RefoundSelector/RefoundSelector";
import Amoxicilina from "../../assets/Amoxicilina.png";
import {
  IconModal,
  ImageWrapper,
  ModalButtons,
  ModalButtonWarning,
  ModalButtonWarningWhite,
  ModalContainerSmall,
  ModalHeader,
  ModalSection,
  ModalSubtitle,
  ModalTitleError,
  Overlay,
  ProductWrapper,
  TextItem,
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

const ModalTroca = ({
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
  const [images, setImages] = useState<File[]>([]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  return (
    <Overlay>
      <ModalContainerSmall width={width ?? "auto"} height={height ?? "auto"}>
        <ModalHeader>
          <ModalTitleError>{title}</ModalTitleError>
        </ModalHeader>

        <ModalSection>
          {message && <ModalSubtitle>{message}</ModalSubtitle>}
          {message2 && <ModalSubtitle>{message2}</ModalSubtitle>}

          <ProductWrapper>
            <ImageWrapper>
              <img
                src={Amoxicilina}
                alt="Shampoo Dove"
                width={60}
                height={60}
              />
            </ImageWrapper>
            <TextItem>Amoxicilina</TextItem>

            <RefundSelector totalCount={5} />
          </ProductWrapper>

          <InputWrapper>
            <DivLabel>
              <Label>Motivo</Label>
            </DivLabel>

            <InputSing
              placeholder="Digite o motivo da troca"
              style={{ height: "80px" }}
            />
          </InputWrapper>

          <InputWrapper style={{ marginTop: "30px" }}>
            <DivLabel>
              <Label>Imagens de comprovação</Label>
            </DivLabel>

            <InputSing
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
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

export default ModalTroca;
