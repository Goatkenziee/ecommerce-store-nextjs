"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Search products..."
        className="p-2 border rounded-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
