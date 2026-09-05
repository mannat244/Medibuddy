"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Search from "@/components/Search";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const getValue = (values) => values?.join(", ") || "Not available";
const getFirstValue = (values) => values?.[0] || "Not available";
const CACHE_TTL = 5 * 60 * 1000;

const SearchResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const cacheKey = useMemo(
    () => `medibuddy-search-${query.trim().toLowerCase()}`,
    [query]
  );
  const apiUrl = useMemo(
    () => `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=20`,
    [query]
  );
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("empty");
      return;
    }

    setStatus("loading");
    const controller = new AbortController();
    let isActive = true;

    try {
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      const cacheAge = Date.now() - cachedData.timestamp;

      if (
        Array.isArray(cachedData.results) &&
        cacheAge >= 0 &&
        cacheAge < CACHE_TTL
      ) {
        setResults(cachedData.results);
        setStatus(cachedData.results.length ? "success" : "empty");
        return;
      }

      localStorage.removeItem(cacheKey);
    } catch {
      localStorage.removeItem(cacheKey);
    }

    const getResults = async () => {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        const data = await response.json();

        if (!isActive) {
          return;
        }

        if (!response.ok) {
          throw new Error(data.error?.message || "Medicine search failed");
        }

        const nextResults = data.results || [];
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), results: nextResults })
        );
        setResults(nextResults);
        setStatus(nextResults.length ? "success" : "empty");
      } catch (error) {
        if (error.name !== "AbortError" && isActive) {
          setStatus("error");
        }
      }
    };

    getResults();
    return () => {
      isActive = false;
      controller.abort();
    };
  }, [apiUrl, cacheKey, query]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Search compact initialQuery={query} />
      <main className="mx-auto max-w-5xl px-6 pb-12">
        <h1 className="text-xl font-bold">Search results for {query}</h1>

      {status === "loading" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-5 w-2/3" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {status === "empty" && <p className="mt-6">No results found.</p>}
      {status === "error" && <p className="mt-6">Unable to load results.</p>}

      {status === "success" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card
              key={result.id}
              className="h-full transition-shadow duration-200 hover:shadow-md"
            >
              <CardHeader>
                <CardTitle className="text-lg">
                  {getFirstValue(result.openfda?.brand_name)}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Purpose:</span>{" "}
                  {getValue(result.purpose)}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Manufacturer:</span>{" "}
                  {getValue(result.openfda?.manufacturer_name)}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Ingredients:</span>{" "}
                  {getValue(result.openfda?.substance_name)}
                </p>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-3">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{getFirstValue(result.openfda?.route)}</Badge>
                  <Badge variant="secondary">{getFirstValue(result.openfda?.product_type)}</Badge>
                </div>
                <Button
                  className="w-full"
                  type="button"
                  onClick={() => router.push(`/medicine?id=${encodeURIComponent(result.id)}`)}
                >
                  Explore
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </main>
      <Footer />
    </div>
  );
};

const SearchResultsPage = () => (
  <Suspense fallback={<p className="p-6">Loading search results...</p>}>
    <SearchResultsContent />
  </Suspense>
);

export default SearchResultsPage;