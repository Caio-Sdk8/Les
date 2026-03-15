import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  width: 280px;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }
`;

export const PrimaryBtn = styled.button`
  height: 40px;
  padding: 0 20px;
  border-radius: var(--radius-sm);
  border: none;
  background-color: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: var(--color-primary-hover);
  }
`;

export const TableCard = styled.div`
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
`;

export const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
`;

export const Tr = styled.tr<{ $even?: boolean }>`
  background-color: ${({ $even }) => ($even ? "var(--color-bg)" : "var(--color-surface)")};

  &:last-child td {
    border-bottom: none;
  }
`;

export const StockBadge = styled.span<{ $low?: boolean }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: var(--radius-pill);
  font-size: 12px;
  font-weight: 700;
  background-color: ${({ $low }) => ($low ? "#fef2f2" : "#f0fdf4")};
  color: ${({ $low }) => ($low ? "#dc2626" : "#16a34a")};
`;

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: var(--color-muted);
`;

export const PageArrowBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

export const PageBtn = styled.button<{ $active?: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: var(--radius-sm);
  border: 1px solid ${({ $active }) => ($active ? "var(--color-primary)" : "var(--color-border)")};
  background-color: ${({ $active }) => ($active ? "var(--color-primary)" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "var(--color-text)")};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  cursor: pointer;

  &:hover:not(:disabled) {
    border-color: var(--color-primary);
    background-color: var(--color-primary-soft);
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;

export const PageArrowIcon = styled.img`
  width: 12px;
  height: 12px;
  display: block;
`;

/* ── Modal ─────────────────────────────────────────────────────────────────── */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBox = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 28px 32px;
  width: 480px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
`;

export const FormGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`;

export const FieldInput = styled.input`
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-bg);
  outline: none;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }
`;

export const FieldSelect = styled.select`
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  padding: 0 12px;
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-bg);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-primary);
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
`;

export const SecondaryBtn = styled.button`
  height: 40px;
  padding: 0 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const ErrorMsg = styled.p`
  font-size: 13px;
  color: #dc2626;
  margin: 0;
`;
