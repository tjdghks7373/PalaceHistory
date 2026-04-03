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
  const [imageLoaded, setImageLoaded] = useState(false);

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
            <>
              {!imageLoaded && <ImageSkeleton />}
              <StyledImage
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 280px"
                onLoad={() => setImageLoaded(true)}
                $loaded={imageLoaded}
              />
            </>
          ) : (
            <NoImage>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </NoImage>
          )}
          
          <Overlay $soldOut={!product.available} />
          
          <Badges>
            {product.is_new && (
              <Badge $type="new">
                <BadgeDot />
                NEW
              </Badge>
            )}
            {!product.available && <Badge $type="sold">SOLD OUT</Badge>}
          </Badges>

          <QuickActions className="quick-actions">
            <ActionButton title="View details">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </ActionButton>
          </QuickActions>
        </ImageWrapper>

        <Info>
          <Category>{getCategoryFromName(product.name)}</Category>
          <Name>{product.name}</Name>
          <PriceRow>
            {product.price_krw > 0 && (
              <>
                <PriceKRW>₩{product.price_krw.toLocaleString("ko-KR")}</PriceKRW>
                <PriceGBP>£{product.price_gbp.toFixed(0)}</PriceGBP>
              </>
            )}
          </PriceRow>
          {product.size_chart && (
            <SizeChartHint>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Size Chart
            </SizeChartHint>
          )}
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

function getCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("t-shirt") || lowerName.includes("tee")) return "T-SHIRTS";
  if (lowerName.includes("hoodie") || lowerName.includes("hood")) return "HOODIES";
  if (lowerName.includes("jacket")) return "JACKETS";
  if (lowerName.includes("pant") || lowerName.includes("trouser")) return "PANTS";
  if (lowerName.includes("short")) return "SHORTS";
  if (lowerName.includes("cap") || lowerName.includes("hat") || lowerName.includes("beanie")) return "HEADWEAR";
  if (lowerName.includes("bag") || lowerName.includes("pouch")) return "ACCESSORIES";
  if (lowerName.includes("deck") || lowerName.includes("wheel")) return "SKATE";
  if (lowerName.includes("crew") || lowerName.includes("sweat")) return "SWEATSHIRTS";
  if (lowerName.includes("polo")) return "POLOS";
  if (lowerName.includes("shirt")) return "SHIRTS";
  return "APPAREL";
}

const Card = styled.a<{ $soldOut: boolean }>`
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${({ $soldOut }) => ($soldOut ? 0.7 : 1)};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:hover {
    border-color: var(--c-border-hover);
    transform: translateY(-4px);
    box-shadow: var(--c-card-shadow);
    opacity: 1;
  }

  &:hover .product-img {
    transform: scale(1.05);
  }

  &:hover .quick-actions {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: var(--c-bg-elevated);
  overflow: hidden;
`;

const ImageSkeleton = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--c-surface) 25%, var(--c-surface-hover) 50%, var(--c-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const StyledImage = styled(Image)<{ $loaded: boolean }>`
  object-fit: cover;
  transition: transform 0.5s ease, opacity 0.3s ease;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
`;

const Overlay = styled.div<{ $soldOut: boolean }>`
  position: absolute;
  inset: 0;
  background: ${({ $soldOut }) =>
    $soldOut
      ? "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%)"
      : "linear-gradient(180deg, transparent 70%, rgba(0,0,0,0.15) 100%)"};
  pointer-events: none;
  transition: background 0.3s ease;
`;

const NoImage = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-faint);
`;

const Badges = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
`;

const BadgeDot = styled.span`
  width: 5px;
  height: 5px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Badge = styled.span<{ $type: "new" | "sold" }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-align: center;
  border-radius: 4px;
  backdrop-filter: blur(8px);
  background: ${({ $type }) =>
    $type === "new" ? "var(--c-accent)" : "rgba(0,0,0,0.75)"};
  color: #fff;
`;

const QuickActions = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  z-index: 2;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  color: var(--c-text);
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: var(--c-text);
    color: var(--c-bg);
    border-color: var(--c-text);
  }
`;

const Info = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Category = styled.span`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--c-text-muted);
`;

const Name = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: -0.01em;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 4px;
`;

const PriceKRW = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: -0.02em;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const PriceGBP = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: var(--c-text-muted);
`;

const SizeChartHint = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: var(--c-accent);
  margin-top: 4px;
  letter-spacing: 0.05em;
`;
