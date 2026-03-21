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
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      getWeeks().then((data) => {
        setWeeks(data);
        if (data.length > 0) {
          setSelectedWeek(data[0].week_label);
        }
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
    return (
      <Container>
        <LoadingText>로딩 중...</LoadingText>
      </Container>
    );
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
    <Container>
      <Header />
      <Main>
        <TopBar>
          <WeekSelector
            weeks={weeks}
            selected={selectedWeek}
            onChange={setSelectedWeek}
          />
          <FilterBar>
            <FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
              ALL ({products.length})
            </FilterButton>
            <FilterButton $active={filter === "new"} onClick={() => setFilter("new")}>
              NEW ({products.filter((p) => p.is_new).length})
            </FilterButton>
            <FilterButton $active={filter === "available"} onClick={() => setFilter("available")}>
              IN STOCK ({products.filter((p) => p.available).length})
            </FilterButton>
          </FilterBar>
        </TopBar>

        {exchangeRate > 0 && (
          <MetaRow>
            <MetaLeft>{selectedWeekData?.product_count ?? products.length}개 제품</MetaLeft>
            <MetaRight>
              기준 환율: $1 = {exchangeRate.toLocaleString("ko-KR")}원 (관세 13% + 부가세 10% 포함)
            </MetaRight>
          </MetaRow>
        )}

        {loading ? (
          <LoadingText>불러오는 중...</LoadingText>
        ) : filteredProducts.length === 0 ? (
          <EmptyText>데이터가 없습니다.</EmptyText>
        ) : (
          <Grid>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Grid>
        )}
      </Main>
    </Container>
  );
}

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--c-bg);
`;

const Main = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 32px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  @media (max-width: 480px) {
    padding: 14px 12px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 6px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 7px 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border: 1px solid ${({ $active }) => ($active ? "var(--c-accent)" : "var(--c-border-hover)")};
  color: ${({ $active }) => ($active ? "var(--c-accent)" : "var(--c-text-muted)")};
  background: none;
  transition: all 0.2s;

  &:hover {
    border-color: var(--c-accent);
    color: var(--c-accent);
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 9px;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-border);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 16px;
  }
`;

const MetaLeft = styled.span`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--c-text-secondary);
`;

const MetaRight = styled.span`
  font-size: 11px;
  color: var(--c-text-muted);

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1px;
  background-color: var(--c-border);
  border: 1px solid var(--c-border);

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LoadingText = styled.p`
  color: var(--c-text-muted);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-align: center;
  padding: 80px 0;
`;

const EmptyText = styled.p`
  color: var(--c-text-faint);
  font-size: 12px;
  text-align: center;
  padding: 80px 0;
`;
