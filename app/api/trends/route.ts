import { NextResponse } from 'next/server';
import { KeywordItem } from '@/utils/keywordProcessor';

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

const KEYWORD_GROUPS = [
  { groupName: '공모전', keywords: ['공모전', '작품공모', '아이디어공모', '디자인공모'] },
  { groupName: '경진대회', keywords: ['경진대회', '해커톤', '코딩대회', '개발대회'] },
  { groupName: '창업대회', keywords: ['창업경진', '스타트업대회', '데모데이', '창업공모'] },
  { groupName: '학생대회', keywords: ['대학생공모', '청년공모', '학생경진', '졸업작품'] },
  { groupName: '정부지원', keywords: ['정부지원사업', '창업지원', '과제공모', '공공데이터'] },
];

export async function GET() {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return NextResponse.json({ error: '네이버 API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  try {
    const today = new Date();
    const endDate = today.toISOString().slice(0, 10);
    const startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    const body = {
      startDate,
      endDate,
      timeUnit: 'date',
      keywordGroups: KEYWORD_GROUPS,
    };

    const res = await fetch('https://openapi.naver.com/v1/datalab/search', {
      method: 'POST',
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: '트렌드 데이터를 가져오는 데 실패했습니다.' }, { status: 502 });
    }

    const data = await res.json();

    // 각 그룹의 최근 ratio 값을 value로 변환
    const keywords: KeywordItem[] = (data.results as Array<{
      title: string;
      data: Array<{ ratio: number }>;
    }>).map(result => ({
      text: result.title,
      value: Math.round((result.data.at(-1)?.ratio ?? 0) * 10),
      source: 'trends' as const,
    }));

    return NextResponse.json({ keywords });
  } catch (err) {
    console.error('trends API error:', err);
    return NextResponse.json({ error: '트렌드 데이터를 가져오는 데 실패했습니다.' }, { status: 500 });
  }
}
