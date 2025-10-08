"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { marketApi } from "@/lib/api";
import { SearchResultDto } from "@/types";
import { SearchResults } from "@/components/SearchResults";
import { TrendingStocks } from "@/components/TrendingStocks";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketNews } from "@/components/MarketNews";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const timer = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const { data: searchResults, isLoading } = useQuery<SearchResultDto[]>({
    queryKey: ["search", debouncedQuery],
    queryFn: () => marketApi.search(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            MarketScout
          </h1>
          <p className="text-muted-foreground mb-6">
            Real-time stock market data, charts, and watchlists
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search stocks by symbol or name..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <SearchResults results={searchResults || []} isLoading={isLoading} />
        )}

        {/* Main Content - Yahoo Finance Style */}
        {!searchQuery && (
          <div className="space-y-6">
            {/* Market Overview */}
            <MarketOverview />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - News (2/3 width) */}
              <div className="lg:col-span-2">
                <MarketNews />
              </div>

              {/* Right Column - Trending (1/3 width) */}
              <div>
                <TrendingStocks />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
