'use client';

import { KeywordItem } from '@/utils/keywordProcessor';

interface Props {
  keywords: KeywordItem[];
  loading: boolean;
  onKeywordClick: (keyword: string) => void;
}

const SOURCE_BADGE: Record<string, { label: string; className: string }> = {
  trends: { label: '트렌드', className: 'bg-blue-100 text-blue-700' },
  news: { label: '뉴스', className: 'bg-green-100 text-green-700' },
};

export default function KeywordList({ keywords, loading, onKeywordClick }: Props) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        키워드 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ol className="space-y-1">
      {keywords.slice(0, 30).map((kw, idx) => {
        const badge = kw.source ? SOURCE_BADGE[kw.source] : null;
        return (
          <li key={`${kw.text}-${idx}`}>
            <button onClick={() => onKeywordClick(kw.text)} className="w-full text-left">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                <span className="w-6 text-right text-sm font-bold text-gray-300 group-hover:text-blue-400">
                  {idx + 1}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                  {kw.text}
                </span>
                {badge && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                )}
                <span className="text-xs text-gray-400">{kw.value}</span>
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
