"use client";

import { QuoteDto } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface QuoteCardProps {
  quote: QuoteDto;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  const isPositive = (quote.change || 0) >= 0;

  return (
    <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-5xl font-bold mb-2">
            {formatCurrency(quote.price)}
          </div>
          <div
            className={`flex items-center gap-2 text-lg font-semibold ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {formatCurrency(quote.change)} ({formatPercent(quote.changePct)})
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="text-sm text-muted-foreground">
            <div>Open: {formatCurrency(quote.open)}</div>
            <div>High: {formatCurrency(quote.high)}</div>
            <div>Low: {formatCurrency(quote.low)}</div>
            <div>Prev Close: {formatCurrency(quote.prevClose)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
