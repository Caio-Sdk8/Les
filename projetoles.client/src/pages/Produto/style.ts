import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const BackButton = styled.button`
  width: fit-content;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

export const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(280px, 420px) 1fr;
  gap: 24px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid var(--color-border);
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.16), transparent 32%),
    linear-gradient(135deg, #f8fffb 0%, #effaf5 48%, #ffffff 100%);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ImagePanel = styled.div`
  min-height: 320px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg, #d1fae5 0%, #eff6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ChipRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Chip = styled.span<{
  $tone?: "warn" | "neutral" | "ok" | "yellow" | "red" | "black";
}>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $tone }) =>
    $tone === "red"
      ? "#fee2e2"
      : $tone === "black"
        ? "#111827"
        : $tone === "warn" || $tone === "yellow"
      ? "#fef3c7"
      : $tone === "ok"
        ? "#dcfce7"
        : "#e0f2fe"};
  color: ${({ $tone }) =>
    $tone === "red"
      ? "#991b1b"
      : $tone === "black"
        ? "#f9fafb"
        : $tone === "warn" || $tone === "yellow"
      ? "#92400e"
      : $tone === "ok"
        ? "#166534"
        : "#0f766e"};
`;

export const ProductTitle = styled.h1`
  margin: 0;
  font-size: 36px;
  line-height: 1.1;
  color: var(--color-text);

  @media (max-width: 900px) {
    font-size: 28px;
  }
`;

export const Subtitle = styled.p`
  margin: 0;
  color: var(--color-muted);
  font-size: 15px;
  line-height: 1.6;
`;

export const PriceBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PriceLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

export const PriceValue = styled.strong`
  font-size: 38px;
  color: #065f46;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: var(--radius-pill);
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const SecondaryButton = styled.button`
  height: 44px;
  padding: 0 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;

export const Notice = styled.div`
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  font-size: 14px;
  line-height: 1.5;
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 20px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.section`
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: var(--color-text);
`;

export const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SpecItem = styled.div`
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 14px;
  background: #fafafa;
`;

export const SpecLabel = styled.div`
  font-size: 12px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
`;

export const SpecValue = styled.div`
  font-size: 15px;
  color: var(--color-text);
  font-weight: 600;
`;

export const SubstituteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SubstituteCard = styled.button`
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: #f8fafc;
  padding: 14px;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SmallText = styled.p`
  margin: 0;
  font-size: 13px;
  color: var(--color-muted);
  line-height: 1.5;
`;

export const Select = styled.select`
  height: 44px;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
  padding: 0 12px;
  font-size: 14px;
  outline: none;
`;

export const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const AlertCard = styled.div<{ $severity: number }>`
  padding: 14px;
  border-radius: 16px;
  border: 1px solid
    ${({ $severity }) => ($severity >= 3 ? "#fca5a5" : $severity === 2 ? "#fcd34d" : "#93c5fd")};
  background:
    ${({ $severity }) => ($severity >= 3 ? "#fef2f2" : $severity === 2 ? "#fffbeb" : "#eff6ff")};
`;

export const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--color-muted);
  border: 1px dashed var(--color-border);
  border-radius: 16px;
`;

export const LoadingWrap = styled.div`
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
`;