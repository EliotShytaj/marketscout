"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, subMonths } from "date-fns";

interface ChartSectionProps {
  symbol: string;
}

type TimeRange = "1D" | "1W" | "1M" | "6M" | "1Y";

const TIME_RANGES: { label: TimeRange; days: number; interval: string }[] = [
  { label: "1D", days: 5, interval: "1day" }, // Show 5 days to have enough data points
  { label: "1W", days: 7, interval: "1day" },
  { label: "1M", days: 30, interval: "1day" },
  { label: "6M", days: 180, interval: "1day" },
  { label: "1Y", days: 365, interval: "1day" },
];

export function ChartSection({ symbol }: ChartSectionProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");

  const range = TIME_RANGES.find((r) => r.label === selectedRange)!;
  // Use a recent date that definitely has data (fallback to Oct 2024)
  const to = new Date();
  // If system date seems future, use a known good date
  const effectiveTo = to.getFullYear() > 2024 ? new Date("2024-10-07") : to;
  const from = subDays(effectiveTo, range.days);

  const { data: candles, isLoading } = useQuery({
    queryKey: ["candles", symbol, selectedRange],
    queryFn: () =>
      marketApi.getCandles(
        symbol,
        range.interval,
        format(from, "yyyy-MM-dd"),
        format(effectiveTo, "yyyy-MM-dd")
      ),
  });

  const chartData =
    candles?.candles
      .filter((c) => c.t && c.c)
      .map((candle) => ({
        time: candle.t! * 1000,
        price: candle.c!,
      }))
      .reverse() || [];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Price Chart</h2>
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => setSelectedRange(range.label)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRange === range.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 bg-muted rounded-lg animate-pulse" />
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              tickFormatter={(time) => format(new Date(time), "MMM d")}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              domain={["auto", "auto"]}
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(value) => `$${value.toFixed(2)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelFormatter={(time) =>
                format(new Date(time), "MMM d, yyyy HH:mm")
              }
              formatter={(value: any) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          No chart data available
        </div>
      )}
    </div>
  );
}
