"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import WeekSelector from "@/components/WeekSelector";
import ProductCard from "@/components/ProductCard";
import { getWeeks, getProducts, Week, Product } from "@/lib/api";

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [weeks, setWeeks] = useState<Week[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "new" | "available">("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      getWeeks().then((data) => {
        setWeeks(data);
        if (data.length > 0) setSelectedWeek(data[0].week_label);
      });
    }
  }, [status]);

  useEffect(() => {
    if (!selectedWeek) return;
    setLoading(true);
    getProducts(selectedWeek)
      .then((data) => {
        setProducts(data.products);
        setExchangeRate(data.exchange_rate);
      })
      .finally(() => setLoading(false));
  }, [selectedWeek]);

  if (status === "loading" || status === "unauthenticated") {
    return <PageWrap><LoadingText>—</LoadingText></PageWrap>;
  }

  const filteredProducts = products
    .filter((p) => {
      if (filter === "new") return p.is_new;
      if (filter === "available") return p.available;
      return true;
    })
    .sort((a, b) => {
      if (a.available === b.available) return 0;
      return a.available ? -1 : 1;
    });

  const selectedWeekData = weeks.find((w) => w.week_label === selectedWeek);

  return (
    <PageWrap>
      <Header />

      {/* Week Hero */}
      <WeekHero>
        <HeroLeft>
          <HeroLabel>WEEKLY DROP ARCHIVE</HeroLabel>
          <HeroTitle>{selectedWeek || "—"}</HeroTitle>
          <HeroMeta>
            {selectedWeekData?.product_count ?? products.length}개 제품
            {exchangeRate > 0 && (
              <ExchangeBadge>
                $1 = {exchangeRate.toLocaleString("ko-KR")}원
              </ExchangeBadge>
            )}
          </HeroMeta>
        </HeroLeft>
        <HeroRight>
          <WeekSelector
            weeks={weeks}
            selected={selectedWeek}
            onChange={setSelectedWeek}
          />
        </HeroRight>
      </WeekHero>

      {/* Filter + Grid */}
      <Main>
        <FilterBar>
          <FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
            ALL <FilterCount>({products.length})</FilterCount>
          </FilterButton>
          <FilterButton $active={filter === "new"} onClick={() => setFilter("new")}>
            NEW <FilterCount>({products.filter((p) => p.is_new).length})</FilterCount>
          </FilterButton>
          <FilterButton $active={filter === "available"} onClick={() => setFilter("available")}>
            IN STOCK <FilterCount>({products.filter((p) => p.available).length})</FilterCount>
          </FilterButton>
        </FilterBar>

        {loading ? (
          <StatusText>불러오는 중...</StatusText>
        ) : filteredProducts.length === 0 ? (
          <StatusText>데이터가 없습니다.</StatusText>
        ) : (
          <Grid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </Main>
    </PageWrap>
  );
}

const PageWrap = styled.div`
  min-height: 100vh;
  background-color: var(--c-bg);
`;

const WeekHero = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 48px 8vw 36px;
  border-bottom: 1px solid var(--c-border);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 20px 24px;
    gap: 20px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeroLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--c-accent);
`;

const HeroTitle = styled.h2`
  font-size: clamp(36px, 6vw, 80px);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--c-text);
`;

const HeroMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--c-text-muted);
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const ExchangeBadge = styled.span`
  padding: 3px 10px;
  border: 1px solid var(--c-border-hover);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--c-text-muted);
`;

const HeroRight = styled.div``;

const Main = styled.main`
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 8vw 64px;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px 40px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 28px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  border: 1px solid ${({ $active }) => ($active ? "var(--c-text)" : "var(--c-border)")};
  background-color: ${({ $active }) => ($active ? "var(--c-text)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--c-bg)" : "var(--c-text-muted)")};
  transition: all 0.15s;

  &:hover {
    border-color: var(--c-text);
    color: ${({ $active }) => ($active ? "var(--c-bg)" : "var(--c-text)")};
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 9px;
  }
`;

const FilterCount = styled.span`
  opacity: 0.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2px;
  }
`;

const StatusText = styled.p`
  color: var(--c-text-muted);
  font-size: 12px;
  letter-spacing: 0.15em;
  text-align: center;
  padding: 120px 0;
`;

const LoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: var(--c-text-muted);
  font-size: 24px;
`;
