"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import { marketApi } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/utils";

const TRENDING = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA"];

export function TrendingStocks() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Trending Stocks
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TRENDING.map((symbol) => (
          <TrendingStockCard key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}

function TrendingStockCard({ symbol }: { symbol: string }) {
  const { data: quote } = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => marketApi.getQuote(symbol),
    staleTime: 10 * 1000,
    retry: false,
  });

  if (!quote) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-muted rounded w-2/3 mb-1"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  const isPositive = (quote.change || 0) >= 0;

  return (
    <Link
      href={`/symbol/${symbol}`}
      className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-all group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold group-hover:text-primary transition-colors">
          {symbol}
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {formatPercent(quote.changePct)}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{formatCurrency(quote.price)}</div>
      <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {formatCurrency(quote.change)}
      </div>
    </Link>
  );
}
