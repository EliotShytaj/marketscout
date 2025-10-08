import axios from "axios";
import type {
  QuoteDto,
  CandleSeriesDto,
  NewsItemDto,
  SearchResultDto,
  MetricsDto,
  WatchlistEntry,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const marketApi = {
  getQuote: async (symbol: string): Promise<QuoteDto> => {
    const { data } = await api.get(`/api/market/quote?symbol=${symbol}`);
    return data;
  },

  getCandles: async (
    symbol: string,
    interval: string,
    from: string,
    to: string
  ): Promise<CandleSeriesDto> => {
    const { data } = await api.get(
      `/api/market/candles?symbol=${symbol}&interval=${interval}&from=${from}&to=${to}`
    );
    return data;
  },

  getNews: async (
    symbol: string,
    from: string,
    to: string
  ): Promise<NewsItemDto[]> => {
    const { data } = await api.get(
      `/api/market/news?symbol=${symbol}&from=${from}&to=${to}`
    );
    return data;
  },

  search: async (query: string): Promise<SearchResultDto[]> => {
    const { data } = await api.get(`/api/market/search?q=${query}`);
    return data;
  },

  getMetrics: async (symbol: string): Promise<MetricsDto> => {
    const { data } = await api.get(`/api/market/metrics?symbol=${symbol}`);
    return data;
  },
};

export const watchlistApi = {
  getListNames: async (email: string): Promise<string[]> => {
    const { data } = await api.get(`/api/watchlist/lists?email=${email}`);
    return data;
  },

  getList: async (email: string, list: string): Promise<WatchlistEntry[]> => {
    const { data } = await api.get(
      `/api/watchlist/items?email=${email}&list=${list}`
    );
    return data;
  },

  getAll: async (email: string): Promise<WatchlistEntry[]> => {
    const { data } = await api.get(`/api/watchlist/all?email=${email}`);
    return data;
  },

  add: async (
    email: string,
    list: string,
    symbol: string
  ): Promise<WatchlistEntry> => {
    const { data } = await api.post(`/api/watchlist/add`, {
      email,
      list,
      symbol,
    });
    return data;
  },

  remove: async (
    email: string,
    list: string,
    symbol: string
  ): Promise<void> => {
    await api.delete(
      `/api/watchlist/remove?email=${email}&list=${list}&symbol=${symbol}`
    );
  },
};
