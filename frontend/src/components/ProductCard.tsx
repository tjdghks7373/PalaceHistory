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
      <Card
        href={product.product_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleCardClick}
        $soldOut={!product.available}
      >
        <ImageWrapper>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
              sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 220px"
              className="product-img"
            />
          ) : (
            <NoImage>NO IMAGE</NoImage>
          )}
          <Overlay $soldOut={!product.available} />
          <Badges>
            {product.is_new && <Badge $type="new">NEW</Badge>}
            {!product.available && <Badge $type="sold">SOLD OUT</Badge>}
          </Badges>
        </ImageWrapper>
        <Info>
          <Name>{product.name}</Name>
          <Prices>
            {product.price_krw > 0 && (
              <>
                <PriceKRW>{product.price_krw.toLocaleString("ko-KR")}원</PriceKRW>
                <PriceGBP>£{product.price_gbp.toFixed(0)}</PriceGBP>
              </>
            )}
          </Prices>
        </Info>
      </Card>

      {showSizeChart && product.size_chart && (
        <SizeChartModal
          name={product.name}
          sizeChart={product.size_chart}
          imageUrl={product.image_url}
          onClose={() => setShowSizeChart(false)}
        />
      )}
    </>
  );
}

const Card = styled.a<{ $soldOut: boolean }>`
  display: block;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  overflow: hidden;
  cursor: pointer;
  opacity: ${({ $soldOut }) => ($soldOut ? 0.5 : 1)};
  transition: opacity 0.2s, border-color 0.2s;

  &:hover {
    border-color: var(--c-border-hover);
    opacity: ${({ $soldOut }) => ($soldOut ? 0.65 : 1)};
  }

  &:hover .product-img {
    transform: scale(1.04);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background-color: var(--c-surface-hover);
  overflow: hidden;
`;

const Overlay = styled.div<{ $soldOut: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ $soldOut }) => ($soldOut ? "rgba(0,0,0,0.2)" : "transparent")};
  pointer-events: none;
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
`;

const Badge = styled.span<{ $type: "new" | "sold" }>`
  padding: 3px 8px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-align: center;
  white-space: nowrap;
  background-color: ${({ $type }) =>
    $type === "new" ? "var(--c-accent)" : "rgba(0,0,0,0.7)"};
  color: #fff;
`;

const Info = styled.div`
  padding: 12px 14px;

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const Name = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: var(--c-text-secondary);
  line-height: 1.4;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.02em;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Prices = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const PriceKRW = styled.span`
  font-size: 13px;
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: -0.01em;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PriceGBP = styled.span`
  font-size: 11px;
  color: var(--c-text-muted);
`;
