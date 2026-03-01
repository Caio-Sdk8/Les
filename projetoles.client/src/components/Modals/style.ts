import styled from "styled-components";

export const ModalTitleError = styled.p`
  font-size: 20px;
  font-weight: 700;
  font-family: var(--font-raleway), sans-serif;
  color: black;
`;

export const ModalButtonWarning = styled.button`
  width: 203px;
  height: 40px;

  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  border-radius: 8px;
  outline: 0;

  border: 0;
  color: white;
  font-family: var(--font-openSans), sans-serif;
  background: green;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(0.98);
  }
`;

export const ModalButtonWarningWhite = styled.button`
  width: 203px;
  height: 40px;

  font-size: 16px;
  font-weight: 700;
  border-radius: 8px;
  outline: 0;

  border: 0;
  color: green;
  border: 1px solid green;
  font-family: var(--font-openSans), sans-serif;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(0.98);
  }
`;

interface ModalProps {
  width: string;
  height: string;
}

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(128, 128, 128, 0.5);
`;

export const ModalContainerSmall = styled.div<ModalProps>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fefefd;
  z-index: 1000;
  width: ${({ width }) => width || "470px"};
  height: ${({ height }) => height || "230px"};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  padding: 12px;
`;

export const IconModal = styled.img`
  width: 44px;
  height: 44px;
`;

export const ModalSection = styled.div`
  width: 100%;
  padding: 15px 15px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
`;

export const ModalHeader = styled.div`
  padding: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
`;

export const ModalButtons = styled.div`
  margin-top: 6px;
  margin-bottom: 6px;
  font-family: var(--font-openSans), sans-serif;
  font-size: 16px;
  padding: 0 12px;
  font-weight: 600;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: black;
`;

export const ModalSubtitle = styled.p`
  font-size: 16px;
  font-weight: 400;
  font-family: var(--font-openSans), sans-serif;
  color: black;
  text-align: center;
`;
