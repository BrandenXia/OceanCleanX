import { memo, useDeferredValue, useEffect, useRef, useState } from "react";
import type {
  Pagefind,
  PagefindDocument,
  PagefindResult,
} from "@/types/pagefind.ts";

const importPagefind = async (): Promise<Pagefind> => {
  const url = "/pagefind/pagefind.js";
  return await import(/* @vite-ignore */ url);
};

const Result = ({ dataFunc }: { dataFunc: PagefindResult["data"] }) => {
  const [data, setData] = useState<PagefindDocument | null>(null);

  useEffect(() => {
    (async () => setData(await dataFunc()))();
  }, [dataFunc]);

  return (
    data && (
      <a href={data.url}>
        <h2 className="font-semibold">{data.meta.title}</h2>
        <p
          className="line-clamp-3 text-sm text-gray-500 [&>mark]:bg-transparent [&>mark]:font-semibold"
          dangerouslySetInnerHTML={{ __html: data.excerpt }}
        />
      </a>
    )
  );
};

const Results = memo(
  ({ pagefind, query }: { pagefind: Pagefind; query: string }) => {
    const [results, setResults] = useState<PagefindResult[]>([]);
    const deferResults = useDeferredValue(results);

    useEffect(() => {
      (async () => {
        const response = await pagefind.debouncedSearch(query);
        if (response === null) return;
        setResults(response.results.slice(0, 5));
      })();
    }, [query]);

    return (
      <ul className="max-h-96 divide-y divide-gray-300 overflow-y-auto px-2">
        {deferResults.length !== 0 ? (
          deferResults.map((result) => (
            <li key={result.id} className="px-2 py-3">
              <Result dataFunc={result.data} />
            </li>
          ))
        ) : (
          <div className="px-2 py-3">No results found</div>
        )}
      </ul>
    );
  },
  (prevProps, nextProps) => prevProps.query === nextProps.query,
);

const Search = () => {
  const pagefind = useRef<Pagefind | null>(null);

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (pagefind.current) return;
    (async () => (pagefind.current = await importPagefind()))();
  }, []);

  return (
    <div className="relative">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative flex items-center">
        <div
          className="absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <div className="i-ph-magnifying-glass-light block"></div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          id="search"
          type="text"
          placeholder="Search for anything"
          className="w-64 rounded-xl border border-gray-300 py-2 pl-9 outline-none transition-colors placeholder:italic hover:border-gray-400 focus:border-gray-600"
        />
      </div>

      {pagefind.current && query && (
        <div className="absolute top-full z-10 mt-3 w-full rounded-lg bg-slate-50 shadow">
          <Results query={query} pagefind={pagefind.current} />
        </div>
      )}
    </div>
  );
};

export default Search;
