"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { marketApi } from "@/lib/api";
import { QuoteCard } from "@/components/QuoteCard";
import { MetricsGrid } from "@/components/MetricsGrid";
import { NewsList } from "@/components/NewsList";
import { ChartSection } from "@/components/ChartSection";
import { AddToWatchlistButton } from "@/components/AddToWatchlistButton";

export default function SymbolPage() {
  const params = useParams();
  const ticker = params.ticker as string;

  const { data: quote, isLoading: quoteLoading } = useQuery({
    queryKey: ["quote", ticker],
    queryFn: () => marketApi.getQuote(ticker),
    staleTime: 10 * 1000, // Quotes update every 10 seconds
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["metrics", ticker],
    queryFn: () => marketApi.getMetrics(ticker),
    staleTime: 60 * 60 * 1000, // Metrics cache for 1 hour
  });

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ["news", ticker],
    queryFn: () => {
      const to = new Date();
      const from = new Date();
      from.setMonth(from.getMonth() - 1);
      return marketApi.getNews(
        ticker,
        from.toISOString().split("T")[0],
        to.toISOString().split("T")[0]
      );
    },
  });

  if (quoteLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{ticker.toUpperCase()}</h1>
          <AddToWatchlistButton symbol={ticker} />
        </div>

        {/* Quote Card */}
        {quote && <QuoteCard quote={quote} />}

        {/* Chart */}
        <ChartSection symbol={ticker} />

        {/* Key Metrics */}
        {metrics && <MetricsGrid metrics={metrics} />}

        {/* News */}
        {news && <NewsList news={news} isLoading={newsLoading} />}
      </div>
    </div>
  );
}
