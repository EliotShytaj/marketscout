"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { getStoredEmail, setStoredEmail } from "@/lib/storage";

export default function WatchlistsPage() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(getStoredEmail());
  const [newListName, setNewListName] = useState("");
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [newSymbol, setNewSymbol] = useState("");

  const { data: listNames } = useQuery({
    queryKey: ["watchlist-lists", email],
    queryFn: () => watchlistApi.getListNames(email),
    enabled: !!email,
  });

  const { data: items } = useQuery({
    queryKey: ["watchlist-items", email, selectedList],
    queryFn: () => watchlistApi.getList(email, selectedList!),
    enabled: !!email && !!selectedList,
  });

  const addMutation = useMutation({
    mutationFn: (data: { list: string; symbol: string }) =>
      watchlistApi.add(email, data.list, data.symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-lists"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist-items"] });
      setNewSymbol("");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (data: { list: string; symbol: string }) =>
      watchlistApi.remove(email, data.list, data.symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-items"] });
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredEmail(email);
    queryClient.invalidateQueries({ queryKey: ["watchlist-lists"] });
  };

  const handleAddToList = (listName: string) => {
    if (newSymbol.trim()) {
      addMutation.mutate({ list: listName, symbol: newSymbol.toUpperCase() });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">My Watchlists</h1>

        {/* Email Input */}
        {!email && (
          <form onSubmit={handleEmailSubmit} className="mb-8">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email to manage watchlists"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {email && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Lists Sidebar */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-4">Lists</h2>
                <div className="space-y-2">
                  {listNames?.map((list) => (
                    <button
                      key={list}
                      onClick={() => setSelectedList(list)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedList === list
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {list}
                    </button>
                  ))}
                </div>

                {/* New List */}
                <div className="mt-4 pt-4 border-t border-border">
                  <input
                    type="text"
                    placeholder="New list name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newListName.trim()) {
                        setSelectedList(newListName);
                        setNewListName("");
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* List Items */}
            <div className="md:col-span-2">
              {selectedList ? (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">{selectedList}</h2>

                  {/* Add Symbol */}
                  <div className="flex gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Add symbol (e.g., AAPL)"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddToList(selectedList);
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleAddToList(selectedList)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                      >
                        <a
                          href={`/symbol/${item.symbol}`}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {item.symbol}
                        </a>
                        <button
                          onClick={() =>
                            removeMutation.mutate({
                              list: selectedList,
                              symbol: item.symbol,
                            })
                          }
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                    {(!items || items.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        No symbols in this list yet
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <p className="text-muted-foreground">
                    Select or create a list to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
