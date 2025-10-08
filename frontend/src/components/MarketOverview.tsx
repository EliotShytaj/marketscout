"use client";

import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/lib/api";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

// Use major tech stocks as proxies since indices may not be supported
const INDICES = [
  { symbol: "SPY", name: "S&P 500 (SPY)" },
  { symbol: "DIA", name: "Dow Jones (DIA)" },
  { symbol: "QQQ", name: "Nasdaq (QQQ)" },
];

export function MarketOverview() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INDICES.map((index) => (
          <IndexCard key={index.symbol} symbol={index.symbol} name={index.name} />
        ))}
      </div>
    </div>
  );
}

function IndexCard({ symbol, name }: { symbol: string; name: string }) {
  const { data: quote } = useQuery({
    queryKey: ["quote", symbol],
    queryFn: () => marketApi.getQuote(symbol),
    staleTime: 30 * 1000,
    retry: false,
  });

  if (!quote) {
    return (
      <div className="p-4 bg-muted/50 rounded-lg animate-pulse">
        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-muted rounded w-3/4"></div>
      </div>
    );
  }

  const isPositive = (quote.change || 0) >= 0;

  return (
    <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors">
      <div className="text-sm text-muted-foreground mb-1">{name}</div>
      <div className="text-2xl font-bold mb-1">{formatCurrency(quote.price)}</div>
      <div
        className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        {formatCurrency(quote.change)} ({formatPercent(quote.changePct)})
      </div>
    </div>
  );
}
