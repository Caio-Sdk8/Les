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
  gap: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 8px;
`;
export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  height: 100%;
  font-family: var(--font-noka), sans-serif;

  th {
    vertical-align: middle;
    padding-top: 12px;
  }
  tr {
    padding: 0 10px;
    height: 48px;
  }
  thead {
    padding: 0 10px;
  }
`;

export const Th = styled.th`
  border-bottom: 1px solid var(--color-border);
  height: 48px;
  color: var(--color-muted);
  font-family: var(--font-openSans), sans-serif;
  font-weight: 700;
  font-style: bold;
  font-size: 14px;
  text-align: left;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  table {
    table-layout: fixed;
    width: 100%;
  }

  &.acao {
    text-align: center;
  }
`;

export const Tr = styled.tr<{ $background: boolean }>`
  background-color: ${({ $background }) =>
    $background ? "#f8fafc" : "#ffffff"};
  text-align: center;
  width: 100%;
  max-height: 48px;
`;

export const Td = styled.td<{ $isFirst?: boolean }>`
  max-height: 48px;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
  color: var(--color-text);
  font-size: 14px;
  font-weight: ${({ $isFirst }) => ($isFirst ? 700 : 400)};

  display: table-cell;
  vertical-align: center;
  font-family: var(--font-openSans), sans-serif;

  &.center {
    text-align: center;
    display: flex;
    justify-content: center;
  }

  p {
    font-family: var(--font-openSans), sans-serif;
    display: flex;
    justify-content: start;
    align-items: center;
    margin: 0;
    padding: 2px 15px 0 0;
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
  align-items: center;
`;
