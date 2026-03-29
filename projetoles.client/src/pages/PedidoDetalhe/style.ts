import styled from "styled-components";

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

export const Header = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
`;

export const Title = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 18px;
`;

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 12px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const Value = styled.strong`
  color: var(--color-text);
  font-size: 14px;
`;

export const ValueText = styled.p`
  color: var(--color-text);
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  width: fit-content;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: ${({ $status }) =>
    $status === "APROVADA" || $status === "EM_PROCESSAMENTO" ? "#065f46" : $status === "REPROVADA" ? "#991b1b" : "#92400e"};
  background: ${({ $status }) =>
    $status === "APROVADA" || $status === "EM_PROCESSAMENTO" ? "#d1fae5" : $status === "REPROVADA" ? "#fee2e2" : "#fef3c7"};
`;

export const BackButton = styled.button`
  width: fit-content;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const UploadInput = styled.input`
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 8px 10px;
  font-size: 13px;
`;

export const ActionButton = styled.button`
  width: fit-content;
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: var(--color-surface);
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const AlertText = styled.p`
  color: #b91c1c;
  font-size: 12px;
  margin: 0;
`;

export const SelectInput = styled.select`
  width: 100%;
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: 0 12px;
  font-size: 14px;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ItemCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  padding: 12px;
`;

export const ItemName = styled.strong`
  color: var(--color-text);
  font-size: 14px;
`;

export const ItemMeta = styled.p`
  margin: 4px 0 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const SummaryLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-text);
  font-size: 14px;
`;

export const SummaryTotal = styled(SummaryLine)`
  font-weight: 800;
  border-top: 1px solid var(--color-border);
  padding-top: 10px;
`;

export const Empty = styled.div`
  width: 100%;
  padding: 36px 18px;
  text-align: center;
  color: var(--color-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
`;
