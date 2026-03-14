import styled from "styled-components";

export const HeroCard = styled.section`
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 18px;
  margin-bottom: 14px;
`;

export const HeroTitle = styled.h2`
  margin: 0;
  color: var(--color-text);
  font-size: 24px;
  font-weight: 800;
`;

export const HeroDescription = styled.p`
  margin: 8px 0 0;
  color: var(--color-muted);
  font-size: 14px;
`;

export const CartLayout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckoutCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionCard = styled.div`
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 16px;
`;

export const CartTitle = styled.h3`
  margin: 0 0 14px;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 700;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.span`
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
`;

export const FieldSelect = styled.select`
  height: var(--control-height);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-text);
  padding: 0 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-soft);
  }
`;

export const PaymentSplitCard = styled.div`
  margin-top: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 12px;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TwoCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const InlineHint = styled.span`
  color: var(--color-muted);
  font-size: 12px;
`;

export const InlineValue = styled.strong`
  color: var(--color-text);
  font-size: 12px;
`;

export const AlertText = styled.p`
  color: #b91c1c;
  font-size: 12px;
  margin: 0;
`;

export const CartItemsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CartItem = styled.article`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: space-between;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  padding: 12px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const ProductThumb = styled.div`
  width: 88px;
  height: 88px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  flex-shrink: 0;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CartItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;

  strong {
    color: var(--color-text);
    font-size: 15px;
  }
`;

export const CartItemMeta = styled.span`
  color: var(--color-muted);
  font-size: 13px;
`;

export const SummaryCard = styled.aside`
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: 16px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SummaryHeader = styled.h3`
  margin: 0 0 4px;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 700;
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text);
  font-size: 14px;
`;

export const SummaryDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: var(--color-border);
`;

export const TotalValue = styled.strong`
  color: var(--color-primary);
  font-size: 18px;
`;

export const SecondaryButton = styled.button`
  margin-top: 6px;
  width: 100%;
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 14px;
  font-weight: 700;

  &:hover {
    background: var(--color-primary-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
