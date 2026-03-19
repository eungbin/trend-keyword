'use client';

import { useState, useEffect, useCallback } from 'react';
import { KeywordItem, mergeKeywords } from '@/utils/keywordProcessor';

export type Category = 'all' | 'trends' | 'news';

interface KeywordsState {
  all: KeywordItem[];
  trends: KeywordItem[];
  news: KeywordItem[];
}

interface UseKeywordsReturn {
  keywords: KeywordItem[];
  category: Category;
  setCategory: (c: Category) => void;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

async function fetchCategory(path: string): Promise<KeywordItem[]> {
  const res = await fetch(path);
  if (!res.ok) return [];
  const data = await res.json();
  return data.keywords ?? [];
}

export function useKeywords(): UseKeywordsReturn {
  const [category, setCategory] = useState<Category>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<KeywordsState>({ all: [], trends: [], news: [] });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trends, news] = await Promise.all([
        fetchCategory('/api/trends'),
        fetchCategory('/api/news'),
      ]);
      setData({
        trends,
        news,
        all: mergeKeywords([trends, news]),
      });
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    keywords: data[category],
    category,
    setCategory,
    loading,
    error,
    refresh: load,
  };
}
