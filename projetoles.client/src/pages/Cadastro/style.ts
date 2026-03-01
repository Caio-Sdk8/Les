import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 90px;
  box-sizing: border-box;
`;

export const Header = styled.div`
  width: 100%;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Bottom = styled.div`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: flex-end;
`;

export const BottomLabel = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin: 32px;
`;

export const Title = styled.div`
  margin-bottom: auto;
  width: 100%;
  height: 29px;
  padding: 2.5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2.5px;
  font-size: 24px;
  font-weight: 700;
`;

export const MainForm = styled.div`
  width: 100%;
  height: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DataContainer = styled.div`
  width: 100%;
  height: auto;
  border-radius: 12px;
  padding: 20px;
`;

export const DataContainerEtapa1 = styled.div`
  width: 100%;
  height: auto;
  border-radius: 12px;
  padding: 20px;
`;

export const SubTitle = styled.h1`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 35px;
  font-weight: 700;
`;

export const SubtitleContainer = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

export const ImageContainer = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export const Label = styled.h1`
  height: 14px;
  text-align: start;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
`;

export const ImageDiv = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const BodyData = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BodyDataEtapa1 = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-between;
`;

export const InputSing = styled.input`
  width: 100%;
  height: 46px;
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border-color: gray;
  border-radius: 8px;
  outline: none;

  &::placeholder {
  }
`;

export const InputSingBig = styled.textarea`
  width: 100%;
  height: 92px;
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border-radius: 8px;

  &::placeholder {
  }
`;

export const InputSingArchive = styled.input`
  width: 100%;
  height: 46px;
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border-radius: 8px;

  &::placeholder {
    text-decoration: underline;
  }
`;

export const InputsDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const InputWrapper = styled.div`
  width: 100%;
  height: 64px;
`;

export const Required = styled.h1`
  height: 14px;
  text-align: start;
  font-size: 12px;
  font-weight: 600;
`;

export const DivLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const DivSeparator = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 40px;
`;

export const NextButton = styled.button`
  width: 200px;
  height: 52px;
  margin-top: 48px;
  background-color: green;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.5s ease;

  &:hover {
    scale: 0.98;
  }
`;

export const ButtonDiv = styled.div`
  display: flex;
  width: 100%;
  align-items: end;
  justify-content: end;
  gap: 15px;
`;

export const DivTitle = styled.div`
  width: 100%;
  height: 80px;
  background-color: purple;
  color: white;
  padding: 0 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: fixed;
  top: 0;
  left: 0;
`;
