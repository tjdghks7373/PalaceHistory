"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Header from "@/components/Header";
import WeekSelector, { formatWeekLabel } from "@/components/WeekSelector";
import ProductCard from "@/components/ProductCard";
import { getWeeks, getProducts, Week, Product } from "@/lib/api";

export default function HistoryPage() {
  const { status } = useSession();
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
    return (
      <PageWrap>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingContainer>
      </PageWrap>
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
  const newCount = products.filter((p) => p.is_new).length;
  const availableCount = products.filter((p) => p.available).length;

  return (
    <PageWrap>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroBadge>
            <BadgeDot />
            <span>WEEKLY DROP ARCHIVE</span>
          </HeroBadge>
          
          <HeroTitle>
            {selectedWeek ? formatWeekLabel(selectedWeek) : "—"}
          </HeroTitle>
          
          <HeroStats>
            <StatItem>
              <StatValue>{selectedWeekData?.product_count ?? products.length}</StatValue>
              <StatLabel>PRODUCTS</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatValue>{newCount}</StatValue>
              <StatLabel>NEW ITEMS</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatValue>{availableCount}</StatValue>
              <StatLabel>IN STOCK</StatLabel>
            </StatItem>
            {exchangeRate > 0 && (
              <>
                <StatDivider />
                <StatItem>
                  <StatValue>₩{exchangeRate.toLocaleString("ko-KR")}</StatValue>
                  <StatLabel>= $1 USD</StatLabel>
                </StatItem>
              </>
            )}
          </HeroStats>
        </HeroContent>

        <HeroSelector>
          <SelectorLabel>Select Week</SelectorLabel>
          <WeekSelector
            weeks={weeks}
            selected={selectedWeek}
            onChange={setSelectedWeek}
          />
        </HeroSelector>
      </HeroSection>

      {/* Main Content */}
      <MainContent>
        <FilterSection>
          <FilterGroup>
            <FilterButton $active={filter === "all"} onClick={() => setFilter("all")}>
              <FilterText>All</FilterText>
              <FilterCount>{products.length}</FilterCount>
            </FilterButton>
            <FilterButton $active={filter === "new"} onClick={() => setFilter("new")}>
              <FilterText>New</FilterText>
              <FilterCount>{newCount}</FilterCount>
            </FilterButton>
            <FilterButton $active={filter === "available"} onClick={() => setFilter("available")}>
              <FilterText>In Stock</FilterText>
              <FilterCount>{availableCount}</FilterCount>
            </FilterButton>
          </FilterGroup>

          <ResultCount>
            {loading ? "Loading..." : `${filteredProducts.length} items`}
          </ResultCount>
        </FilterSection>

        {loading ? (
          <EmptyState>
            <LoadingSpinner />
            <EmptyText>Loading products...</EmptyText>
          </EmptyState>
        ) : filteredProducts.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </EmptyIcon>
            <EmptyText>No products found</EmptyText>
            <EmptySubtext>Try selecting a different filter or week</EmptySubtext>
          </EmptyState>
        ) : (
          <ProductGrid>
            {filteredProducts.map((product, index) => (
              <ProductWrapper key={product.id} style={{ animationDelay: `${index * 30}ms` }}>
                <ProductCard product={product} />
              </ProductWrapper>
            ))}
          </ProductGrid>
        )}
      </MainContent>

      <Footer>
        <FooterContent>
          <FooterBrand>PALACE HISTORY</FooterBrand>
          <FooterText>Weekly archive of Palace Skateboards drops</FooterText>
        </FooterContent>
      </Footer>
    </PageWrap>
  );
}

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(12px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrap = styled.div`
  min-height: 100vh;
  background-color: var(--c-bg);
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.span`
  font-size: 12px;
  letter-spacing: 0.2em;
  color: var(--c-text-muted);
  text-transform: uppercase;
`;

const HeroSection = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  padding: clamp(40px, 6vw, 80px) clamp(16px, 6vw, 80px) clamp(32px, 4vw, 56px);
  background: linear-gradient(180deg, var(--c-bg-elevated) 0%, var(--c-bg) 100%);
  border-bottom: 1px solid var(--c-border);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--c-accent), transparent);
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 32px;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: var(--c-accent-soft);
  border: 1px solid var(--c-accent);
  border-radius: 4px;
  width: fit-content;

  span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: var(--c-accent);
  }
`;

const BadgeDot = styled.div`
  width: 6px;
  height: 6px;
  background: var(--c-accent);
  border-radius: 50%;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 8vw, 72px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--c-text);
  text-wrap: balance;
`;

const HeroStats = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: -0.02em;

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const StatLabel = styled.span`
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--c-text-muted);
`;

const StatDivider = styled.div`
  width: 1px;
  height: 32px;
  background: var(--c-border);

  @media (max-width: 480px) {
    height: 24px;
  }
`;

const HeroSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SelectorLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: var(--c-text-muted);
  text-transform: uppercase;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1800px;
  width: 100%;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px) clamp(16px, 6vw, 80px);
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  background: var(--c-surface);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--c-border);
`;

const FilterButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "var(--c-text)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--c-bg)" : "var(--c-text-muted)")};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "var(--c-text)" : "var(--c-surface-hover)")};
    color: ${({ $active }) => ($active ? "var(--c-bg)" : "var(--c-text)")};
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 11px;
  }
`;

const FilterText = styled.span``;

const FilterCount = styled.span`
  padding: 2px 6px;
  background: rgba(128, 128, 128, 0.2);
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
`;

const ResultCount = styled.span`
  font-size: 12px;
  color: var(--c-text-muted);
  letter-spacing: 0.05em;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

const ProductWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease forwards;
  opacity: 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  color: var(--c-text-faint);
`;

const EmptyText = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text-muted);
`;

const EmptySubtext = styled.p`
  font-size: 13px;
  color: var(--c-text-faint);
`;

const Footer = styled.footer`
  margin-top: auto;
  padding: 48px clamp(16px, 6vw, 80px);
  border-top: 1px solid var(--c-border);
  background: var(--c-surface);
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const FooterBrand = styled.span`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: var(--c-text);
`;

const FooterText = styled.p`
  font-size: 12px;
  color: var(--c-text-muted);
`;
