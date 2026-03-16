import styled from "styled-components";

export const ReviewLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.9fr);
  gap: 24px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export const ReviewCard = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

export const ReviewHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--color-bg);
`;

export const ReviewTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  color: var(--color-text);
`;

export const ReviewSubtitle = styled.p`
  margin: 4px 0 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const StatusBadge = styled.span<{ $status: "PENDENTE" | "APROVADA" | "REPROVADA" }>`
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ $status }) =>
    $status === "APROVADA" ? "#065f46" : $status === "REPROVADA" ? "#991b1b" : "#92400e"};
  background: ${({ $status }) =>
    $status === "APROVADA" ? "#d1fae5" : $status === "REPROVADA" ? "#fee2e2" : "#fef3c7"};
`;

export const ReviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 12px;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid var(--color-border);
  }
`;

export const ReviewRow = styled.tr<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? "#eef2f7" : "transparent")};
  cursor: pointer;

  &:hover {
    background: #eef2f7;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-text);
    font-size: 14px;
    vertical-align: top;
  }
`;

export const DetailBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const DetailLabel = styled.span`
  font-size: 12px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DetailValue = styled.strong`
  color: var(--color-text);
  font-size: 14px;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProductItem = styled.div`
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
`;

export const ProductMeta = styled.p`
  margin: 4px 0 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 112px;
  resize: vertical;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 10px 12px;
  font-size: 14px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button<{ $variant?: "approve" | "reject" | "ghost" }>`
  border: 1px solid
    ${({ $variant }) =>
      $variant === "approve"
        ? "#10b981"
        : $variant === "reject"
          ? "#ef4444"
          : "var(--color-border)"};
  background:
    ${({ $variant }) =>
      $variant === "approve"
        ? "#10b981"
        : $variant === "reject"
          ? "#ef4444"
          : "var(--color-surface)"};
  color: ${({ $variant }) => ($variant === "ghost" ? "var(--color-text)" : "#fff")};
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const EmptyState = styled.div`
  padding: 48px 20px;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
`;

export const FileLink = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: var(--color-primary);
  font-weight: 700;
  cursor: pointer;
  text-align: left;
`;