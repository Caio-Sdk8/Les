import styled from "styled-components";

// ── Existentes (mantidos intactos) ─────────────────────────────────────────

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
  border: 1px solid gray;
  border-radius: 8px;

  &:focus {
    border-color: purple;
  }

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

// ── Novo: select com mesmo visual dos inputs ───────────────────────────────

export const InputSelect = styled.select`
  width: 100%;
  height: 46px;
  outline: none;
  font-size: 14px;
  padding: 0 12px;
  font-weight: 500;
  border: 1px solid gray;
  border-radius: 8px;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: purple;
  }
`;

// ── Novos: seção de cartões ────────────────────────────────────────────────

export const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/** Card individual — borda roxa se for preferencial */
export const CardItem = styled.div`
  width: 100%;
  border: 2px solid ${({ $preferred }) => ($preferred ? "purple" : "#d1d5db")};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ $preferred }) => ($preferred ? "#faf5ff" : "#ffffff")};
  transition: border-color 0.2s, background-color 0.2s;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Badge com número ou "★ Preferencial" */
export const CardBadge = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $preferred }) => ($preferred ? "purple" : "#6b7280")};
  background: ${({ $preferred }) => ($preferred ? "#f3e8ff" : "#f3f4f6")};
  padding: 4px 12px;
  border-radius: 999px;
`;

/** Mensagem de rodapé dentro do card preferencial */
export const PreferredBadge = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: purple;
  margin: 0;
  padding: 8px 12px;
  background: #f3e8ff;
  border-radius: 6px;
`;

/** Botão secundário: "Definir preferencial" */
export const SetPreferredButton = styled.button`
  height: 32px;
  padding: 0 14px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: purple;
    color: purple;
    background: #faf5ff;
  }
`;

/** Botão remover cartão */
export const RemoveButton = styled.button`
  height: 32px;
  padding: 0 14px;
  background: transparent;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;
  }
`;

/** Botão de adicionar novo cartão — estilo dashed */
export const AddCardButton = styled.button`
  width: 100%;
  height: 46px;
  background: transparent;
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: purple;
    color: purple;
    background: #faf5ff;
  }
`;