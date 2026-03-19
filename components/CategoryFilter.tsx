'use client';

import { Category } from '@/hooks/useKeywords';

interface Props {
  category: Category;
  onChange: (c: Category) => void;
  onRefresh: () => void;
  loading: boolean;
}

const TABS: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: '전체', emoji: '🔍' },
  { value: 'trends', label: '검색 트렌드', emoji: '📈' },
  { value: 'news', label: '뉴스', emoji: '📰' },
];

export default function CategoryFilter({ category, onChange, onRefresh, loading }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              category === tab.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-1">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="ml-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {loading ? '로딩 중...' : '🔄 새로고침'}
      </button>
    </div>
  );
}
