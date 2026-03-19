'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import { KeywordItem } from '@/utils/keywordProcessor';

interface Props {
  keywords: KeywordItem[];
  loading: boolean;
  onKeywordClick: (keyword: string) => void;
}

const SOURCE_COLORS: Record<string, string> = {
  trends: '#3b82f6',
  news: '#22c55e',
};

export default function WordCloud({ keywords, loading, onKeywordClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onClickRef = useRef(onKeywordClick);
  onClickRef.current = onKeywordClick;

  useEffect(() => {
    if (!svgRef.current || loading || keywords.length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth || 500;
    const height = svg.clientHeight || 400;

    const maxVal = Math.max(...keywords.map(k => k.value));
    const minVal = Math.min(...keywords.map(k => k.value));
    const fontScale = d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([14, 56]);

    const words = keywords.slice(0, 60).map(k => ({
      text: k.text,
      size: fontScale(k.value),
      source: k.source,
    }));

    cloud()
      .size([width, height])
      .words(words)
      .padding(4)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0))
      .font('Noto Sans KR, sans-serif')
      .fontSize(d => (d as { size: number }).size)
      .on('end', draw)
      .start();

    function draw(wordsOut: cloud.Word[]) {
      d3.select(svg).selectAll('*').remove();

      d3.select(svg)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll('text')
        .data(wordsOut)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'Noto Sans KR, sans-serif')
        .style('font-weight', 'bold')
        .style('fill', d => {
          const src = (d as { source?: string }).source;
          return src ? (SOURCE_COLORS[src] ?? '#6366f1') : '#6366f1';
        })
        .style('cursor', 'pointer')
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text ?? '')
        .on('click', (_, d) => {
          if (d.text) onClickRef.current(d.text);
        })
        .append('title')
        .text(d => `${d.text} (빈도: ${(d as { size: number }).size})`);
    }
  }, [keywords, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>
          <div className="text-sm">키워드 로딩 중...</div>
        </div>
      </div>
    );
  }

  if (keywords.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400">
        <div className="text-center">
          <div className="text-4xl mb-3">🔍</div>
          <div className="text-sm">키워드 데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  return <svg ref={svgRef} className="w-full h-full min-h-[400px]" />;
}
