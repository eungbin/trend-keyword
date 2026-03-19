const STOPWORDS = new Set([
  '의', '을', '를', '이', '가', '은', '는', '에', '와', '과', '으로', '에서',
  '도', '만', '에게', '한테', '께', '부터', '까지', '보다', '처럼', '만큼',
  '하다', '있다', '없다', '되다', '이다', '아니다', '같다', '위해', '통해',
  '대해', '관해', '따라', '인해', '위한', '대한', '관한',
  '그', '이', '저', '그것', '이것', '저것', '여기', '거기', '저기',
  '또', '및', '등', '즉', '곧', '그리고', '하지만', '그러나', '그래서',
  '때문', '경우', '것으로', '것이', '수도', '수가', '않은', '않는',
]);

export interface KeywordItem {
  text: string;
  value: number;
  source?: 'trends' | 'news' | 'youtube';
}

export function extractKeywords(titles: string[], source?: KeywordItem['source']): KeywordItem[] {
  const freq: Record<string, number> = {};

  titles.forEach(title => {
    const clean = title.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '');
    const words = clean.split(/[\s,·""''「」【】()\[\]!?…~|/\\]+/);

    words.forEach(word => {
      const w = word.trim().replace(/[^\uAC00-\uD7A3a-zA-Z0-9]/g, '');
      if (w.length < 2) return;
      if (STOPWORDS.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([text, value]) => ({ text, value, source }));
}

// 공모전/경진대회 관련 키워드가 포함된 항목만 통과
const CONTEST_TERMS = [
  '공모', '경진', '대회', '공모전', '해커톤', '경연', '선발', '수상',
  '모집', '지원사업', '창업', '스타트업', '데모데이', '과제',
];

export function filterContestKeywords(keywords: KeywordItem[]): KeywordItem[] {
  return keywords.filter(({ text }) =>
    CONTEST_TERMS.some(term => text.includes(term))
  );
}

export function mergeKeywords(keywordSets: KeywordItem[][]): KeywordItem[] {
  const freq: Record<string, { value: number; source: KeywordItem['source'] }> = {};

  keywordSets.flat().forEach(({ text, value, source }) => {
    if (freq[text]) {
      freq[text].value += value;
    } else {
      freq[text] = { value, source };
    }
  });

  return Object.entries(freq)
    .map(([text, { value, source }]) => ({ text, value, source }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);
}
