import styled from "styled-components";

export const ProductCardContainer = styled.article<{ $compact: boolean }>`
  width: ${({ $compact }) => ($compact ? "210px" : "240px")};
  min-height: ${({ $compact }) => ($compact ? "290px" : "320px")};
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background-color: var(--color-surface);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  }
`;

export const ProductImageWrap = styled.div`
  width: 100%;
  height: 132px;
  position: relative;
  background-color: #f8fafc;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const CategoryTag = styled.span`
  position: absolute;
  left: 8px;
  top: 8px;
  border-radius: 999px;
  background-color: rgba(15, 23, 42, 0.85);
  color: #fff;
  font-size: 11px;
  padding: 4px 8px;
`;

export const Info = styled.div`
  padding: 10px 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
`;

export const Name = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const WarningTag = styled.span`
  font-size: 10px;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  padding: 3px 7px;
  white-space: nowrap;
`;

export const Description = styled.p`
  margin: 0;
  font-size: 12px;
  color: var(--color-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 32px;
`;

export const PriceFrom = styled.span`
  font-size: 12px;
  color: #9ca3af;
  text-decoration: line-through;
`;

export const Price = styled.strong`
  font-size: 18px;
  color: var(--color-text);
`;

export const AddButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 14px;
    height: 14px;
  }
`;
