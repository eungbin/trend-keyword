'use client';

import { useState } from 'react';
import CategoryFilter from '@/components/CategoryFilter';
import KeywordList from '@/components/KeywordList';
import WordCloud from '@/components/WordCloud';
import KeywordDetailModal from '@/components/KeywordDetailModal';
import { useKeywords } from '@/hooks/useKeywords';

export default function Home() {
  const { keywords, category, setCategory, loading, error, refresh } = useKeywords();
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">트렌드 키워드</h1>
            <p className="text-sm text-gray-500">오늘의 인기 키워드를 한눈에</p>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
        </div>
      </header>

      <KeywordDetailModal keyword={selectedKeyword} onClose={() => setSelectedKeyword(null)} />

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* 카테고리 필터 */}
        <CategoryFilter
          category={category}
          onChange={setCategory}
          onRefresh={refresh}
          loading={loading}
        />

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 키워드 랭킹 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span>🏆</span> 키워드 랭킹
              <span className="ml-auto text-xs text-gray-400 font-normal">클릭하면 핫 주제 보기</span>
            </h2>
            <KeywordList keywords={keywords} loading={loading} onKeywordClick={setSelectedKeyword} />
          </div>

          {/* 워드 클라우드 */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span>☁️</span> 워드 클라우드
              <span className="ml-2 text-xs text-gray-400 font-normal">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />트렌드
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mx-1 ml-2" />뉴스
              </span>
            </h2>
            <WordCloud keywords={keywords} loading={loading} onKeywordClick={setSelectedKeyword} />
          </div>
        </div>
      </main>
    </div>
  );
}
