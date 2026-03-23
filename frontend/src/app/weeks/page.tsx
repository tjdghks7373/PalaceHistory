"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import { getWeeks, Week } from "@/lib/api";
import { formatWeekLabel } from "@/components/WeekSelector";

export default function WeeksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [weeks, setWeeks] = useState<Week[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      getWeeks().then(setWeeks);
    }
  }, [status]);

  if (status === "loading" || status === "unauthenticated") {
    return <PageWrap><LoadingText>—</LoadingText></PageWrap>;
  }

  return (
    <PageWrap>
      <Header />
      <Main>
        <PageHeader>
          <PageLabel>ARCHIVE</PageLabel>
          <PageTitle>WEEKLY<br />DROPS</PageTitle>
          <PageDesc>{weeks.length}개 시즌 수록</PageDesc>
        </PageHeader>

        <Grid>
          {weeks.map((week, i) => {
            const formatted = formatWeekLabel(week.week_label);
            const [yearPart, rest] = formatted.split("년 ");
            return (
              <WeekCard
                key={week.week_label}
                onClick={() => router.push(`/history?week=${encodeURIComponent(week.week_label)}`)}
              >
                <CardIndex>{String(i + 1).padStart(2, "0")}</CardIndex>
                <CardBody>
                  <CardWeek>{rest}</CardWeek>
                  <CardYear>{yearPart}년</CardYear>
                  <CardCount>{week.product_count}개 제품</CardCount>
                </CardBody>
                <CardArrow>→</CardArrow>
              </WeekCard>
            );
          })}
        </Grid>
      </Main>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100vh;
  background-color: var(--c-bg);
`;

const Main = styled.main`
  max-width: 1600px;
  margin: 0 auto;
  padding: 48px 8vw 80px;

  @media (max-width: 768px) {
    padding: 32px 20px 60px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 56px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--c-border);
`;

const PageLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--c-accent);
`;

const PageTitle = styled.h1`
  font-size: clamp(48px, 8vw, 100px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 0.95;
  color: var(--c-text);
`;

const PageDesc = styled.span`
  font-size: 12px;
  color: var(--c-text-muted);
  letter-spacing: 0.1em;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const WeekCard = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 20px;
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  cursor: pointer;
  transition: background-color 0.15s, border-color 0.15s;

  &:hover {
    background-color: var(--c-surface-hover);
    border-color: var(--c-border-hover);
  }

  &:hover > :last-child {
    transform: translateX(4px);
  }
`;

const CardIndex = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: var(--c-text-faint);
  letter-spacing: 0.05em;
  min-width: 24px;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardWeek = styled.span`
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.01em;
  color: var(--c-text);
  line-height: 1;
`;

const CardYear = styled.span`
  font-size: 11px;
  color: var(--c-text-muted);
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const CardCount = styled.span`
  font-size: 10px;
  color: var(--c-text-faint);
  letter-spacing: 0.08em;
  margin-top: 4px;
`;

const CardArrow = styled.span`
  font-size: 16px;
  color: var(--c-text-muted);
  transition: transform 0.15s ease;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--c-text-muted);
  font-size: 24px;
`;
