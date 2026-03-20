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

  const filteredProducts = products.filter((p) => {
    if (filter === "new") return p.is_new;
    if (filter === "available") return p.available;
    return true;
  });

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
              전체 ({products.length})
            </FilterButton>
            <FilterButton $active={filter === "new"} onClick={() => setFilter("new")}>
              신규 ({products.filter((p) => p.is_new).length})
            </FilterButton>
            <FilterButton $active={filter === "available"} onClick={() => setFilter("available")}>
              재고있음 ({products.filter((p) => p.available).length})
            </FilterButton>
          </FilterBar>
        </TopBar>

        {exchangeRate > 0 && (
          <ExchangeInfo>
            기준 환율: £1 = {exchangeRate.toLocaleString("ko-KR")}원 (관세 13% + 부가세 10% 포함)
          </ExchangeInfo>
        )}

        {loading ? (
          <LoadingText>크롤링 데이터 불러오는 중...</LoadingText>
        ) : filteredProducts.length === 0 ? (
          <EmptyText>데이터가 없습니다. 아직 크롤링이 진행되지 않았을 수 있어요.</EmptyText>
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
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 24px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 12px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  font-size: 12px;
  letter-spacing: 0.05em;
  border: 1px solid ${({ $active }) => ($active ? "var(--c-text)" : "var(--c-border-hover)")};
  color: ${({ $active }) => ($active ? "var(--c-text)" : "var(--c-text-muted)")};
  background: none;
  transition: all 0.2s;

  &:hover {
    border-color: var(--c-text);
    color: var(--c-text);
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 11px;
  }
`;

const ExchangeInfo = styled.p`
  font-size: 11px;
  color: var(--c-text-muted);
  margin-bottom: 24px;

  @media (max-width: 480px) {
    font-size: 10px;
    margin-bottom: 16px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const LoadingText = styled.p`
  color: var(--c-text-muted);
  font-size: 14px;
  text-align: center;
  padding: 80px 0;
`;

const EmptyText = styled.p`
  color: var(--c-text-faint);
  font-size: 13px;
  text-align: center;
  padding: 80px 0;
  line-height: 1.8;
`;
