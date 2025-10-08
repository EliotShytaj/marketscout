"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { watchlistApi } from "@/lib/api";
import { getStoredEmail } from "@/lib/storage";

interface AddToWatchlistButtonProps {
  symbol: string;
}

export function AddToWatchlistButton({ symbol }: AddToWatchlistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const email = getStoredEmail();
  const queryClient = useQueryClient();

  const { data: lists } = useQuery({
    queryKey: ["watchlist-lists", email],
    queryFn: () => watchlistApi.getListNames(email),
    enabled: !!email && isOpen,
  });

  const addMutation = useMutation({
    mutationFn: (listName: string) => watchlistApi.add(email, listName, symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist-lists"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist-items"] });
      setIsOpen(false);
      setNewListName("");
    },
  });

  if (!email) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
      >
        <Plus className="h-5 w-5" />
        Add to Watchlist
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Add to Watchlist</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              {lists?.map((list) => (
                <button
                  key={list}
                  onClick={() => addMutation.mutate(list)}
                  disabled={addMutation.isPending}
                  className="w-full text-left px-4 py-2 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                >
                  {list}
                </button>
              ))}
              {(!lists || lists.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No lists yet
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-border">
              <input
                type="text"
                placeholder="Create new list..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newListName.trim()) {
                    addMutation.mutate(newListName);
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
