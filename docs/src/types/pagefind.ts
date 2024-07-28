export interface Pagefind {
  debouncedSearch: (query: string, timeout?: number) => Promise<PagefindResponse>;
}

export interface PagefindResponse {
  results: PagefindResult[];
}

export interface PagefindResult {
  id: string;
  data: () => Promise<PagefindDocument>;
}

export interface PagefindDocument {
  url: string;
  excerpt: string;
  filters: {
    author: string;
  };
  meta: {
    title: string;
    image: string;
  };
  content: string;
  word_count: number;
}
