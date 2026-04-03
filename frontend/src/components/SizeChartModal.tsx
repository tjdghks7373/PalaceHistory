"use client";

import { useEffect } from "react";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import { SizeChart } from "@/lib/api";

interface Props {
  name: string;
  sizeChart: SizeChart;
  imageUrl?: string;
  onClose: () => void;
}

export default function SizeChartModal({ name, sizeChart, imageUrl, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderContent>
            <Label>
              <LabelIcon>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </LabelIcon>
              SIZE CHART
            </Label>
            <Title>{name}</Title>
          </HeaderContent>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </Header>

        {imageUrl && (
          <ImageWrapper>
            <Image
              src={imageUrl}
              alt={name}
              fill
              style={{ objectFit: "contain" }}
              sizes="640px"
            />
            <ImageOverlay />
          </ImageWrapper>
        )}

        <TableWrapper>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  {sizeChart.headers.map((h, i) => (
                    <Th key={i} $isFirst={i === 0}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeChart.rows.map((row, i) => (
                  <Tr key={i}>
                    {row.map((cell, j) => (
                      <Td key={j} $isFirst={j === 0}>{cell}</Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </TableWrapper>

        <Footer>
          <FooterHint>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Measurements are in centimeters (cm)
          </FooterHint>
        </Footer>
      </Modal>
    </Overlay>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--c-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${fadeIn} 0.2s ease;
`;

const Modal = styled.div`
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  animation: ${slideUp} 0.3s ease;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid var(--c-border);
  gap: 16px;

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const Label = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--c-accent);
`;

const LabelIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: -0.01em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    color: var(--c-text);
    border-color: var(--c-border-hover);
    background: var(--c-surface-hover);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  background: var(--c-bg);
  border-bottom: 1px solid var(--c-border);
  flex-shrink: 0;

  @media (max-width: 480px) {
    height: 200px;
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 80%, var(--c-surface) 100%);
  pointer-events: none;
`;

const TableWrapper = styled.div`
  flex: 1;
  overflow: auto;
  padding: 0;
`;

const TableContainer = styled.div`
  padding: 20px 28px;

  @media (max-width: 480px) {
    padding: 16px 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const Th = styled.th<{ $isFirst?: boolean }>`
  text-align: ${({ $isFirst }) => ($isFirst ? "left" : "center")};
  padding: 12px 16px;
  color: var(--c-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: 2px solid var(--c-border);
  white-space: nowrap;
  background: var(--c-surface);
  position: sticky;
  top: 0;

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const Tr = styled.tr`
  transition: background 0.15s ease;

  &:nth-child(even) {
    background: var(--c-bg);
  }

  &:hover {
    background: var(--c-accent-soft);
  }
`;

const Td = styled.td<{ $isFirst?: boolean }>`
  padding: 14px 16px;
  text-align: ${({ $isFirst }) => ($isFirst ? "left" : "center")};
  color: ${({ $isFirst }) => ($isFirst ? "var(--c-text)" : "var(--c-text-secondary)")};
  font-weight: ${({ $isFirst }) => ($isFirst ? 700 : 500)};
  white-space: nowrap;
  border-bottom: 1px solid var(--c-border);

  ${Tr}:last-child & {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const Footer = styled.div`
  padding: 16px 28px;
  border-top: 1px solid var(--c-border);
  background: var(--c-bg);

  @media (max-width: 480px) {
    padding: 14px 20px;
  }
`;

const FooterHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: var(--c-text-muted);
`;
