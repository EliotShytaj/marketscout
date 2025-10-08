"use client";

import Link from "next/link";
import { SearchResultDto } from "@/types";
import { TrendingUp } from "lucide-react";

interface SearchResultsProps {
  results: SearchResultDto[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result, idx) => (
        <Link
          key={idx}
          href={`/symbol/${result.symbol}`}
          className="block p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{result.symbol}</div>
              <div className="text-sm text-muted-foreground">{result.name}</div>
            </div>
            <div className="text-sm text-muted-foreground">
              {result.exchange}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
