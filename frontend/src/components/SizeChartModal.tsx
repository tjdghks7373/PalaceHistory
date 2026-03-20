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
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{name}</Title>
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
                <tr key={i}>
                  {row.map((cell, j) => (
                    <Td key={j} $isFirst={j === 0}>{cell}</Td>
                  ))}
                </tr>
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
`;

const Modal = styled.div`
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--c-border);

  @media (max-width: 480px) {
    padding: 12px 16px;
  }
`;

const Title = styled.h2`
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 16px;
`;

const CloseButton = styled.button`
  color: var(--c-text-muted);
  font-size: 14px;
  padding: 4px;
  flex-shrink: 0;
  transition: color 0.2s;

  &:hover {
    color: var(--c-text);
  }
`;

const TableWrapper = styled.div`
  overflow: auto;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 12px;
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
  font-weight: 600;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 8px;
  }
`;

const Td = styled.td<{ $isFirst?: boolean }>`
  padding: 8px 12px;
  color: ${({ $isFirst }) => ($isFirst ? "var(--c-text-secondary)" : "var(--c-text)")};
  font-weight: ${({ $isFirst }) => ($isFirst ? 600 : 400)};
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;

  @media (max-width: 480px) {
    padding: 6px 8px;
  }
`;
