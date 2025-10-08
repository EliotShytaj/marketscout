"use client";

import { NewsItemDto } from "@/types";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface NewsListProps {
  news: NewsItemDto[];
  isLoading: boolean;
}

export function NewsList({ news, isLoading }: NewsListProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Latest News</h2>
      <div className="space-y-4">
        {news.slice(0, 10).map((item, idx) => (
          <a
            key={idx}
            href={item.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1 line-clamp-2">
                  {item.headline}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  {item.publishedAt && (
                    <span>
                      {format(new Date(item.publishedAt * 1000), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
