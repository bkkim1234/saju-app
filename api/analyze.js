export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 년주, 월주, 일주, 시주, 오행 } = req.body;

  const prompt = `당신은 명리학을 현대적으로 해석하는 전문가입니다.

- 미신적 표현, 운명 단정, 미래 예언은 절대 사용하지 마세요.
- "~할 것이다", "반드시" 같은 단정 표현을 금지합니다.
- 사주는 성격·경향·패턴을 설명하는 도구로만 사용합니다.

아래 사주 데이터를 바탕으로 다음 항목을 작성하세요.

1. 성격 요약
2. 일·직업 성향
3. 인간관계 스타일
4. 삶에서 반복되는 패턴과 조언

조건:
- 상담가·코치 말투 사용
- 현대적인 언어 사용
- 각 항목은 최소 4문장 이상
- 오행 이름만 나열하지 말고, 의미를 풀어서 설명하세요
- "당신은 이런 사람입니다" 형식으로 작성하세요

사주 데이터:
- 년주: ${년주}
- 월주: ${월주}
- 일주: ${일주}
- 시주: ${시주}
- 오행 분포: 목 ${오행.목}개, 화 ${오행.화}개, 토 ${오행.토}개, 금 ${오행.금}개, 수 ${오행.수}개`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const content = data.choices[0].message.content;
    return res.status(200).json({ result: content });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
