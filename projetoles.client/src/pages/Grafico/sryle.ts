import styled from "styled-components";

export const ContainerPage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const IntroCard = styled.section`
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 58%, #f8fafc 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const IntroTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
`;

export const IntroText = styled.p`
  margin: 0;
  color: var(--color-muted);
  max-width: 860px;
  font-size: 14px;
  line-height: 1.6;
`;

export const FilterCard = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FieldControl = styled.input`
  width: 100%;
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0 12px;
  font-size: 14px;
`;

export const FieldSelect = styled.select`
  width: 100%;
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0 12px;
  font-size: 14px;
`;

export const FilterHint = styled.p`
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
`;

export const MetricsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.article`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MetricLabel = styled.span`
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const MetricValue = styled.strong`
  font-size: 28px;
  line-height: 1;
  color: var(--color-text);
`;

export const MetricDetail = styled.span`
  color: var(--color-muted);
  font-size: 13px;
`;

export const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(320px, 1fr);
  gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: var(--color-text);
`;

export const PanelText = styled.p`
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
  line-height: 1.5;
`;

export const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const LegendItem = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LegendTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const ColorDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  display: inline-block;
  margin-right: 8px;
`;

export const LegendName = styled.strong`
  color: var(--color-text);
  font-size: 14px;
`;

export const LegendMeta = styled.span`
  color: var(--color-muted);
  font-size: 13px;
`;

export const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border-bottom: 1px solid var(--color-border);
    padding: 12px 10px;
    text-align: left;
    font-size: 14px;
  }

  th {
    color: var(--color-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const EmptyMessage = styled.div`
  padding: 32px 16px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  text-align: center;
  color: var(--color-muted);
`;
