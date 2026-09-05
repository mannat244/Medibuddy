'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const popularSearches = ["Advil", "Ibuprofen", "Aspirin", "Paracetamol"];

const normalizeBrandName = (value) => value.trim().toLowerCase();

const getMatchingBrandNames = (brandNames, query) => {
  const normalizedQuery = normalizeBrandName(query);
  const uniqueNames = [...new Map(
    brandNames.map((brandName) => [normalizeBrandName(brandName), brandName])
  ).values()];

  return uniqueNames
    .filter((brandName) => normalizeBrandName(brandName).includes(normalizedQuery))
    .sort((firstName, secondName) => {
      const firstStartsWithQuery = normalizeBrandName(firstName).startsWith(normalizedQuery);
      const secondStartsWithQuery = normalizeBrandName(secondName).startsWith(normalizedQuery);

      return Number(secondStartsWithQuery) - Number(firstStartsWithQuery);
    })
    .slice(0, 6);
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(async () => {
      const apiUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(trimmedQuery)}"&limit=8`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const brandNames = data.results?.flatMap((result) => result.openfda?.brand_name || []) || [];

        setSuggestions(getMatchingBrandNames(brandNames, trimmedQuery));
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const submitSearch = (value) => {
    const nextQuery = value.trim();

    if (!nextQuery) {
      return;
    }

    router.push(`/search?query=${encodeURIComponent(nextQuery)}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch(query);
  };

  const handlePopularSearch = (value) => {
    setQuery(value);
    submitSearch(value);
  };

  const handleSuggestionClick = (value) => {
    setQuery(value);
    setSuggestions([]);
    submitSearch(value);
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <div>
        <h1 className="text-4xl font-bold">
          Find Your Medicine on India&apos;s Largest Digital Healthcare Platform
        </h1>
        <p className="mt-4 text-muted-foreground">
          Search medicines by brand name and find useful label information.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl gap-2">
          <label htmlFor="medicine-search" className="sr-only">
            Search medicines by brand name
          </label>
          <input
            id="medicine-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by brand name"
            className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit">Search</Button>
        </form>

        {isLoading && (
          <div className="mx-auto mt-2 w-full max-w-xl space-y-2 rounded-md border p-3 text-left">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        )}

        {suggestions.length > 0 && (
          <dialog open className="relative mx-auto mt-2 w-full max-w-xl rounded-md border bg-background p-2 text-left shadow-md">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </dialog>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Popular:</span>
          {popularSearches.map((medicine) => (
            <Button
              key={medicine}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePopularSearch(medicine)}
            >
              {medicine}
            </Button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Search;
