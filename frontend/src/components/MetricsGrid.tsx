"use client";

import { MetricsDto } from "@/types";
import { formatMarketCap, formatNumber, formatPercent } from "@/lib/utils";

interface MetricsGridProps {
  metrics: MetricsDto;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricsData = [
    { label: "Market Cap", value: formatMarketCap(metrics.marketCap) },
    { label: "P/E Ratio", value: formatNumber(metrics.pe) },
    { label: "P/B Ratio", value: formatNumber(metrics.pb) },
    { label: "Dividend Yield", value: formatPercent(metrics.dividendYield) },
    { label: "Beta", value: formatNumber(metrics.beta) },
    { label: "Revenue Growth", value: formatPercent(metrics.revenueGrowth) },
    { label: "Gross Margin", value: formatPercent(metrics.grossMargin) },
    { label: "Sector", value: metrics.sector || "N/A" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Key Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metricsData.map((metric) => (
          <div key={metric.label}>
            <div className="text-sm text-muted-foreground mb-1">
              {metric.label}
            </div>
            <div className="text-xl font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
