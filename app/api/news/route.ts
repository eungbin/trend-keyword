import { NextResponse } from 'next/server';
import { extractKeywords, filterContestKeywords } from '@/utils/keywordProcessor';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

export async function GET() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return NextResponse.json({ error: '네이버 API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  try {
    const queries = ['공모전', '경진대회', '해커톤', '아이디어 공모', '창업 경진', '대학생 대회'];
    const titles: string[] = [];

    await Promise.all(
      queries.map(async (q) => {
        const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(q)}&display=50&sort=date`;
        const res = await fetch(url, {
          headers: {
            'X-Naver-Client-Id': NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        const items = (data.items ?? []) as Array<{ title: string }>;
        items.forEach(item => titles.push(item.title));
      })
    );

    const keywords = filterContestKeywords(extractKeywords(titles, 'news'));

    return NextResponse.json({ keywords });
  } catch (err) {
    console.error('news API error:', err);
    return NextResponse.json({ error: '뉴스 데이터를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
