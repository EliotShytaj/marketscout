"use client";

import { useQuery } from "@tanstack/react-query";
import { marketApi } from "@/lib/api";
import { Newspaper, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export function MarketNews() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);

  const { data: news, isLoading } = useQuery({
    queryKey: ["market-news"],
    queryFn: async () => {
      // Fetch news from multiple popular stocks
      const symbols = ["AAPL", "TSLA", "NVDA"];
      const newsPromises = symbols.map((symbol) =>
        marketApi.getNews(
          symbol,
          from.toISOString().split("T")[0],
          to.toISOString().split("T")[0]
        )
      );
      const results = await Promise.all(newsPromises);
      // Combine and sort by date
      const allNews = results.flat();
      return allNews
        .sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0))
        .slice(0, 10); // Top 10 news
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Newspaper className="h-5 w-5 text-primary" />
        Latest Market News
      </h2>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news?.map((item, idx) => (
            <a
              key={idx}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.source || "Unknown"}</span>
                    <span>•</span>
                    <span>
                      {item.publishedAt
                        ? format(new Date(item.publishedAt * 1000), "MMM d, h:mm a")
                        : "Recent"}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
