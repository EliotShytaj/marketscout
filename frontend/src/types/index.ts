export interface QuoteDto {
  symbol: string;
  price: number | null;
  change: number | null;
  changePct: number | null;
  open: number | null;
  high: number | null;
  low: number | null;
  prevClose: number | null;
  timestamp: number | null;
}

export interface CandleDto {
  t: number | null;
  o: number | null;
  h: number | null;
  l: number | null;
  c: number | null;
  v: number | null;
}

export interface CandleSeriesDto {
  symbol: string;
  interval: string;
  from: string;
  to: string;
  candles: CandleDto[];
}

export interface NewsItemDto {
  headline: string | null;
  source: string | null;
  url: string | null;
  summary: string | null;
  publishedAt: number | null;
}

export interface SearchResultDto {
  symbol: string | null;
  name: string | null;
  exchange: string | null;
  currency: string | null;
}

export interface MetricsDto {
  symbol: string;
  marketCap: number | null;
  pe: number | null;
  pb: number | null;
  dividendYield: number | null;
  beta: number | null;
  revenueGrowth: number | null;
  grossMargin: number | null;
  sector: string | null;
  industry: string | null;
}

export interface WatchlistEntry {
  id: number;
  email: string;
  listName: string;
  symbol: string;
  position: number;
  addedAt: string;
}
