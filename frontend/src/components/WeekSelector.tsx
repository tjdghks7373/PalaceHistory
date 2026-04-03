"use client";

import styled from "styled-components";
import { Week } from "@/lib/api";

interface Props {
  weeks: Week[];
  selected: string;
  onChange: (week: string) => void;
}

export function formatWeekLabel(label: string): string {
  const [yearStr, weekStr] = label.split("-W");
  const year = parseInt(yearStr, 10);
  const isoWeek = parseInt(weekStr, 10);

  // ISO 주차의 월요일 날짜 계산
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = jan4.getDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setDate(jan4.getDate() - dayOfWeek + 1);
  const monday = new Date(mondayOfWeek1);
  monday.setDate(mondayOfWeek1.getDate() + (isoWeek - 1) * 7);

  const month = monday.getMonth();
  const monthNum = month + 1;

  // 해당 월의 첫 번째 월요일 계산
  const firstOfMonth = new Date(monday.getFullYear(), month, 1);
  const firstDow = firstOfMonth.getDay() || 7;
  const firstMondayDate = firstDow === 1 ? 1 : 1 + (8 - firstDow);
  const weekOfMonth = Math.floor((monday.getDate() - firstMondayDate) / 7) + 1;

  return `${monday.getFullYear()}년 ${monthNum}월 ${weekOfMonth}주차`;
}

export default function WeekSelector({ weeks, selected, onChange }: Props) {
  return (
    <SelectWrapper>
      <SelectIcon>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </SelectIcon>
      <Select value={selected} onChange={(e) => onChange(e.target.value)}>
        {weeks.map((w) => (
          <option key={w.week_label} value={w.week_label}>
            {formatWeekLabel(w.week_label)}
          </option>
        ))}
      </Select>
      <Arrow>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Arrow>
    </SelectWrapper>
  );
}

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const SelectIcon = styled.span`
  position: absolute;
  left: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text-muted);
  pointer-events: none;
  z-index: 1;
`;

const Select = styled.select`
  appearance: none;
  background: var(--c-surface);
  color: var(--c-text);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 12px 44px 12px 42px;
  font-size: 13px;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    border-color: var(--c-border-hover);
    background: var(--c-surface-hover);
  }

  &:focus {
    border-color: var(--c-accent);
    box-shadow: 0 0 0 3px var(--c-accent-soft);
  }

  option {
    background: var(--c-surface);
    color: var(--c-text);
    font-weight: 500;
    padding: 8px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 10px 40px 10px 38px;
    min-width: 170px;
  }
`;

const Arrow = styled.span`
  position: absolute;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--c-text-muted);
  transition: transform 0.2s ease;

  ${Select}:focus + & {
    transform: rotate(180deg);
  }
`;
