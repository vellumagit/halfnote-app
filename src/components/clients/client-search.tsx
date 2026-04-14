"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useCallback } from "react";

const tags = ["active", "new", "paused", "completed"];

export function ClientSearch({
  initialSearch,
  initialTag,
}: {
  initialSearch: string;
  initialTag: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  const applyFilters = useCallback(
    (s: string, t: string) => {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (t) params.set("tag", t);
      router.push(`/clients?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters(search, initialTag);
          }}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={!initialTag ? "default" : "outline"}
          size="sm"
          onClick={() => applyFilters(search, "")}
        >
          All
        </Button>
        {tags.map((t) => (
          <Button
            key={t}
            variant={initialTag === t ? "default" : "outline"}
            size="sm"
            onClick={() => applyFilters(search, t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}
