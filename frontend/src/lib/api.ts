const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Week {
  id: number;
  week_label: string;
  crawled_at: string;
  exchange_rate: number;
  product_count: number;
}

export interface SizeChart {
  headers: string[];
  rows: string[][];
}

export interface Product {
  id: number;
  shopify_id: string;
  name: string;
  price_gbp: number;
  price_krw: number;
  image_url: string;
  product_url: string;
  available: boolean;
  is_new: boolean;
  size_chart: SizeChart | null;
}

export interface WeekProducts {
  week_label: string;
  exchange_rate: number;
  crawled_at: string;
  products: Product[];
}

export async function getWeeks(): Promise<Week[]> {
  const res = await fetch(`${API_URL}/weeks`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch weeks");
  return res.json();
}

export async function getProducts(week: string): Promise<WeekProducts> {
  const res = await fetch(`${API_URL}/products?week=${week}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
