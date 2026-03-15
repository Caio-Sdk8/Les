import React from "react";
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
  button?: string;
  button2?: string;
  height?: string;
};

const ModalActive = ({
  back,
  next,
  title,
  message,
  button,
  button2,
  height,
}: Props) => {
  return (
    <Overlay>
      <ModalContainerSmall width="305px" height={height ?? "179px"}>
        <ModalHeader>
          <ModalTitleError>{title}</ModalTitleError>
        </ModalHeader>
        <ModalSection>
          {message && <ModalSubtitle>{message}</ModalSubtitle>}
        </ModalSection>
        <ModalButtons>
          {button2 && (
            <ModalButtonWarning onClick={back}>{button2}</ModalButtonWarning>
          )}
          <ModalButtonWarningWhite onClick={next}>
            {button ?? "Sim"}
          </ModalButtonWarningWhite>
        </ModalButtons>
      </ModalContainerSmall>
    </Overlay>
  );
};

export default ModalActive;
