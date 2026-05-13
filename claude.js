// netlify/functions/claude.js
// Netlify Functions를 통해 Claude API를 안전하게 프록시합니다.
// 환경변수 ANTHROPIC_API_KEY 설정 필요

exports.handler = async (event) => {
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { systemPrompt, userMessage, useWebSearch } = JSON.parse(event.body);

    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    };

    if (useWebSearch) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const result = data.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result })
    };

  } catch (err) {
    console.error('Claude function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
