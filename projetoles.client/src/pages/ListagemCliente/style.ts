import styled from "styled-components";

export const ContainerDad = styled.div`
  width: 100%;
  max-width: 100%;
  height: auto;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 16px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0;
  overflow: hidden;
`;

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  height: 100%;
  table-layout: fixed;

  th {
    vertical-align: middle;
  }

  tr {
    height: 52px;
  }

  thead {
    background-color: var(--color-bg);
  }
`;

export const Th = styled.th`
  border-bottom: 1px solid var(--color-border);
  height: 48px;
  color: var(--color-muted);
  font-weight: 700;
  font-size: 12px;
  text-align: left;
  padding: 12px 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.acao {
    text-align: center;
  }
`;

export const Tr = styled.tr<{ $background: boolean }>`
  background-color: ${({ $background }) =>
    $background ? "var(--color-bg)" : "var(--color-surface)"};
  text-align: center;
  width: 100%;
  max-height: 52px;

  &:hover {
    background-color: #eef2f7;
  }

  &:last-child td {
    border-bottom: none;
  }
`;

export const Td = styled.td<{ $isFirst?: boolean }>`
  max-height: 52px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  color: var(--color-text);
  font-size: 14px;
  font-weight: ${({ $isFirst }) => ($isFirst ? 700 : 400)};
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);

  display: table-cell;
  vertical-align: middle;

  &.center {
    text-align: center;
    display: table-cell;
  }

  p {
    margin: 0;
    padding: 0;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const MainTable = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
