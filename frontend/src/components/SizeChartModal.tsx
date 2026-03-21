"use client";

import { useEffect } from "react";
import styled from "styled-components";
import { SizeChart } from "@/lib/api";

interface Props {
  name: string;
  sizeChart: SizeChart;
  onClose: () => void;
}

export default function SizeChartModal({ name, sizeChart, onClose }: Props) {
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
          <div>
            <Label>SIZE CHART</Label>
            <Title>{name}</Title>
          </div>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                {sizeChart.headers.map((h, i) => (
                  <Th key={i}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.rows.map((row, i) => (
                <Tr key={i} $even={i % 2 === 0}>
                  {row.map((cell, j) => (
                    <Td key={j} $isFirst={j === 0}>{cell}</Td>
                  ))}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </Modal>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--c-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: var(--c-surface);
  border: 1px solid var(--c-border-hover);
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
  gap: 16px;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Label = styled.p`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--c-accent);
  margin-bottom: 4px;
`;

const Title = styled.h2`
  font-size: 13px;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 0.03em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CloseButton = styled.button`
  color: var(--c-text-muted);
  font-size: 14px;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.2s;
  margin-top: 2px;

  &:hover {
    color: var(--c-text);
  }
`;

const TableWrapper = styled.div`
  overflow: auto;
  padding: 16px 24px 24px;

  @media (max-width: 480px) {
    padding: 12px 16px 20px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 12px;
  color: var(--c-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-bottom: 2px solid var(--c-border-hover);
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 8px;
  }
`;

const Tr = styled.tr<{ $even: boolean }>`
  background-color: ${({ $even }) => ($even ? "transparent" : "var(--c-surface-hover)")};
`;

const Td = styled.td<{ $isFirst?: boolean }>`
  padding: 9px 12px;
  color: ${({ $isFirst }) => ($isFirst ? "var(--c-text)" : "var(--c-text-secondary)")};
  font-weight: ${({ $isFirst }) => ($isFirst ? 700 : 400)};
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 7px 8px;
  }
`;
