'use client';

import { useEffect, useState } from 'react';
import { RelatedArticle } from '@/app/api/related/route';

interface Props {
  keyword: string | null;
  onClose: () => void;
}

export default function KeywordDetailModal({ keyword, onClose }: Props) {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) return;
    setArticles([]);
    setError(null);
    setLoading(true);

    fetch(`/api/related?q=${encodeURIComponent(keyword)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setArticles(data.articles ?? []);
      })
      .catch(() => setError('데이터를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [keyword]);

  if (!keyword) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              🔥 <span className="text-blue-600">{keyword}</span> 핫 주제
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">네이버 뉴스 관련도 순</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 text-center py-10">{error}</div>
          )}

          {!loading && !error && articles.length === 0 && (
            <div className="text-sm text-gray-400 text-center py-10">관련 뉴스가 없습니다.</div>
          )}

          {articles.map((article, i) => (
            <a
              key={i}
              href={/^https?:\/\//.test(article.link) ? article.link : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group"
            >
              <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700 line-clamp-2">
                {article.title}
              </p>
              {article.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{article.description}</p>
              )}
              <p className="text-xs text-gray-300 mt-2">
                {new Date(article.pubDate).toLocaleDateString('ko-KR', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </a>
          ))}
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 border-t border-gray-100">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(keyword)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            구글에서 더 검색하기 →
          </a>
        </div>
      </div>
    </div>
  );
}
