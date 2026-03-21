"use client";

import { useState } from "react";
import Image from "next/image";
import styled from "styled-components";
import { Product } from "@/lib/api";
import SizeChartModal from "./SizeChartModal";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    if (product.size_chart) {
      e.preventDefault();
      setShowSizeChart(true);
    }
  };

  return (
    <>
      <Card href={product.product_url} target="_blank" rel="noopener noreferrer" onClick={handleCardClick}>
        <ImageWrapper>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 220px"
            />
          ) : (
            <NoImage>NO IMAGE</NoImage>
          )}
          <Badges>
            {product.is_new && <Badge $type="new">NEW</Badge>}
            {!product.available && <Badge $type="sold">SOLD OUT</Badge>}
          </Badges>
          {product.size_chart && <SizeBadge>SIZE</SizeBadge>}
        </ImageWrapper>
        <Info>
          <Name>{product.name}</Name>
          <Prices>
            <PriceKRW>
              {product.price_krw.toLocaleString("ko-KR")}원
            </PriceKRW>
            <PriceGBP>${product.price_gbp.toFixed(0)}</PriceGBP>
          </Prices>
        </Info>
      </Card>

      {showSizeChart && product.size_chart && (
        <SizeChartModal
          name={product.name}
          sizeChart={product.size_chart}
          onClose={() => setShowSizeChart(false)}
        />
      )}
    </>
  );
}

const Card = styled.a`
  display: block;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  transition: border-color 0.2s;
  cursor: pointer;

  &:hover {
    border-color: var(--c-border-hover);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: var(--c-surface-hover);
  overflow: hidden;
`;

const NoImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 10px;
  color: var(--c-text-faint);
  letter-spacing: 0.1em;
`;

const Badges = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const Badge = styled.span<{ $type: "new" | "sold" }>`
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: 4px;
  text-align: center;
  background-color: ${({ $type }) =>
    $type === "new" ? "var(--c-badge-new-bg)" : "var(--c-border-hover)"};
  color: ${({ $type }) =>
    $type === "new" ? "var(--c-badge-new-text)" : "var(--c-text-muted)"};
`;

const SizeBadge = styled.span`
  position: absolute;
  bottom: 8px;
  right: 8px;
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  background-color: var(--c-border);
  color: var(--c-text-muted);
`;

const Info = styled.div`
  padding: 10px 12px;

  @media (max-width: 480px) {
    padding: 8px;
  }
`;

const Name = styled.p`
  font-size: 11px;
  color: var(--c-text-secondary);
  line-height: 1.4;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Prices = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  flex-wrap: wrap;
`;

const PriceKRW = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text);

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PriceGBP = styled.span`
  font-size: 11px;
  color: var(--c-text-muted);
`;
