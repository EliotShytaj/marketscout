"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

const TRENDING = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "NVDA"];

export function TrendingStocks() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        Trending Stocks
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TRENDING.map((symbol) => (
          <Link
            key={symbol}
            href={`/symbol/${symbol}`}
            className="p-6 rounded-xl border border-border bg-card hover:bg-muted transition-all hover:scale-105"
          >
            <div className="text-2xl font-bold text-primary">{symbol}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
