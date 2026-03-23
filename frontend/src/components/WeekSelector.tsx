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
      <Select value={selected} onChange={(e) => onChange(e.target.value)}>
        {weeks.map((w) => (
          <option key={w.week_label} value={w.week_label}>
            {formatWeekLabel(w.week_label)}
          </option>
        ))}
      </Select>
      <Arrow>▾</Arrow>
    </SelectWrapper>
  );
}

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Select = styled.select`
  appearance: none;
  background-color: var(--c-bg);
  color: var(--c-text);
  border: 1px solid var(--c-border-hover);
  border-radius: 8px;
  padding: 9px 40px 9px 14px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;

  &:hover,
  &:focus {
    border-color: var(--c-text);
  }

  option {
    background-color: var(--c-bg);
    color: var(--c-text);
    font-weight: 400;
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 8px 36px 8px 12px;
  }
`;

const Arrow = styled.span`
  position: absolute;
  right: 13px;
  pointer-events: none;
  color: var(--c-text-muted);
  font-size: 14px;
  line-height: 1;
`;
