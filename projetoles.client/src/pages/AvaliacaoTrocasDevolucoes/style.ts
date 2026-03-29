import styled from "styled-components";

export const ReviewLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
  gap: 24px;

  @media (max-width: 1080px) {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--color-bg);
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  color: var(--color-text);
`;

export const Subtitle = styled.p`
  margin: 4px 0 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const Table = styled.table`
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

export const Filters = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  gap: 10px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterInput = styled.input`
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0 10px;
  font-size: 13px;
`;

export const FilterSelect = styled.select`
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0 10px;
  font-size: 13px;
`;

export const FilterButton = styled.button`
  height: var(--control-height);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 13px;
  font-weight: 700;
  padding: 0 14px;
  cursor: pointer;
`;

export const Row = styled.tr<{ $active: boolean }>`
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

export const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Block = styled.div`
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
  margin: 0;
  color: var(--color-text);
  font-size: 14px;
`;

export const Status = styled.span<{ $status: string }>`
  width: fit-content;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $status }) =>
    $status === "APROVADA" ? "#065f46" : $status === "REPROVADA" ? "#991b1b" : "#92400e"};
  background: ${({ $status }) =>
    $status === "APROVADA" ? "#d1fae5" : $status === "REPROVADA" ? "#fee2e2" : "#fef3c7"};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $tone?: "approve" | "reject" }>`
  border: 1px solid
    ${({ $tone }) => ($tone === "approve" ? "#10b981" : $tone === "reject" ? "#ef4444" : "var(--color-border)")};
  background: ${({ $tone }) => ($tone === "approve" ? "#10b981" : $tone === "reject" ? "#ef4444" : "var(--color-surface)")};
  color: ${({ $tone }) => ($tone ? "#fff" : "var(--color-text)")};
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 108px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 14px;
  color: var(--color-text);
  background: var(--color-surface);
`;

export const Empty = styled.div`
  padding: 42px 16px;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
`;
