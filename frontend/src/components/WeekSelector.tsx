"use client";

import styled from "styled-components";
import { Week } from "@/lib/api";

interface Props {
  weeks: Week[];
  selected: string;
  onChange: (week: string) => void;
}

export default function WeekSelector({ weeks, selected, onChange }: Props) {
  return (
    <Container>
      <Label>주차 선택</Label>
      <Select value={selected} onChange={(e) => onChange(e.target.value)}>
        {weeks.map((w) => (
          <option key={w.week_label} value={w.week_label}>
            {w.week_label} ({w.product_count}개)
          </option>
        ))}
      </Select>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 11px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  white-space: nowrap;
`;

const Select = styled.select`
  background-color: var(--c-surface);
  color: var(--c-text);
  border: 1px solid var(--c-border);
  padding: 8px 12px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
  min-height: 40px;

  &:focus {
    border-color: var(--c-border-hover);
  }

  option {
    background-color: var(--c-surface);
    color: var(--c-text);
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 10px;
  }
`;
