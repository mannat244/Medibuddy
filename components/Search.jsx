'use client';

import { useState } from "react";

import { Button } from "@/components/ui/button";

const popularSearches = ["Advil", "Ibuprofen", "Aspirin", "Paracetamol"];

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const submitSearch = async (value) => {
    const nextQuery = value.trim();

    if (!nextQuery) {
      return;
    }

    const apiUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(nextQuery)}"&limit=20`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Medicine search failed");
      }

      console.log(data);
      onSearch?.(data.results);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitSearch(query);
  };

  const handlePopularSearch = (value) => {
    setQuery(value);
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
