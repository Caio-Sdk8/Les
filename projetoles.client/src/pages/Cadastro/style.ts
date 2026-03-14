import styled from "styled-components";

// ── Existentes (mantidos intactos) ─────────────────────────────────────────

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;
  background-color: var(--color-bg);
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
  border-radius: var(--radius-md);
  padding: 20px;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
`;

export const PageTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 800;
`;

export const PageSubtitle = styled.p`
  margin: 6px 0 0;
  color: var(--color-muted);
  font-size: 14px;
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
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
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
  color: var(--color-muted);
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
  height: var(--control-height);
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: #fff;
  color: var(--color-text);

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
    background-color: #fff;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const InputSingBig = styled.textarea`
  width: 100%;
  height: 92px;
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: #fff;
  color: var(--color-text);

  &::placeholder {
    color: #9ca3af;
  }
`;

export const InputSingArchive = styled.input`
  width: 100%;
  height: var(--control-height);
  outline: none;
  font-size: 14px;
  padding: 11px 12px;
  font-weight: 500;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);

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
  height: 72px;
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
  gap: 20px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 14px;
  }
`;

export const NextButton = styled.button`
  width: 200px;
  height: 52px;
  margin-top: 20px;
  background-color: var(--color-primary);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-primary-hover);
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
  height: 68px;
  background-color: var(--color-surface);
  color: white;
  border-bottom: 1px solid var(--color-border);
  padding: 0 16px;
  z-index: 100;

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
  height: var(--control-height);
  outline: none;
  font-size: 14px;
  padding: 0 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: white;
  cursor: pointer;
  color: var(--color-text);

  &:focus {
    border-color: var(--color-primary);
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
interface CardItemProps {
  $preferred?: boolean;
}

export const CardItem = styled.div<CardItemProps>`
  width: 100%;
  border: 1px solid
    ${({ $preferred }) =>
      $preferred ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${({ $preferred }) =>
    $preferred ? "var(--color-primary-soft)" : "#ffffff"};
  transition:
    border-color 0.2s,
    background-color 0.2s;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/** Badge com número ou "★ Preferencial" */
interface CardBadgeProps {
  $preferred?: boolean;
}

export const CardBadge = styled.span<CardBadgeProps>`
  font-size: 14px;
  font-weight: 700;
  color: ${({ $preferred }) =>
    $preferred ? "var(--color-primary)" : "var(--color-muted)"};
  background: ${({ $preferred }) =>
    $preferred ? "var(--color-primary-soft)" : "#f3f4f6"};
  padding: 4px 12px;
  border-radius: 999px;
`;

/** Mensagem de rodapé dentro do card preferencial */
export const PreferredBadge = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  padding: 8px 12px;
  background: var(--color-primary-soft);
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
  color: var(--color-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-soft);
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
  color: var(--color-muted);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
    background: var(--color-primary-soft);
  }
`;
