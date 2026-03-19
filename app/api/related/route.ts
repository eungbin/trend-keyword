import { NextRequest, NextResponse } from 'next/server';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

export interface RelatedArticle {
  title: string;
  description: string;
  link: string;
  pubDate: string;
}

// 캐시: 동일 키워드 5분간 네이버 API 재호출 안 함
const cache = new Map<string, { articles: RelatedArticle[]; expiresAt: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000;

// 안전한 URL만 허용 (javascript: 등 차단)
function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

const decodeHtml = (str: string) =>
  str
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q) return NextResponse.json({ error: '검색어가 필요합니다.' }, { status: 400 });

  // 길이 제한
  if (q.length > 100) {
    return NextResponse.json({ error: '검색어가 너무 깁니다.' }, { status: 400 });
  }

  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return NextResponse.json({ error: '네이버 API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  // 캐시 히트
  const cached = cache.get(q);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ articles: cached.articles });
  }

  try {
    const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=20&sort=sim`;
    const res = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: '뉴스 검색 실패' }, { status: 502 });
    }

    const data = await res.json();
    const articles: RelatedArticle[] = (data.items ?? [])
      .map((item: { title: string; description: string; link: string; originallink: string; pubDate: string }) => ({
        title: decodeHtml(item.title),
        description: decodeHtml(item.description),
        link: item.originallink || item.link,
        pubDate: item.pubDate,
      }))
      .filter((article: RelatedArticle) => isSafeUrl(article.link));

    cache.set(q, { articles, expiresAt: Date.now() + CACHE_TTL_MS });

    return NextResponse.json({ articles });
  } catch (err) {
    console.error('related API error:', err);
    return NextResponse.json({ error: '관련 뉴스를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
