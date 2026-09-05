"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("empty");
      return;
    }

    const apiUrl = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=20`;

    const getResults = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Medicine search failed");
        }

        setResults(data.results || []);
        setStatus(data.results?.length ? "success" : "empty");
      } catch {
        setStatus("error");
      }
    };

    getResults();
  }, [query]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold">Search results for {query}</h1>

      {status === "loading" && <p className="mt-6">Loading...</p>}
      {status === "empty" && <p className="mt-6">No results found.</p>}
      {status === "error" && <p className="mt-6">Unable to load results.</p>}

      {status === "success" && (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {results.map((result) => (
            <article key={result.id} className="rounded-md border p-4">
              <h2 className="font-semibold">
                {result.openfda?.brand_name?.join(", ") || "Unnamed medicine"}
              </h2>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap text-sm text-muted-foreground">
                {JSON.stringify(result.openfda, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default SearchResultsPage;