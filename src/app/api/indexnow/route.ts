import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const indexNowKey = process.env.INDEXNOW_KEY;
    if (!indexNowKey) {
      console.error('INDEXNOW_KEY not configured');
      return NextResponse.json({ error: 'IndexNow API key not configured' }, { status: 500 });
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const indexNowPayload = {
      host: hostname,
      key: indexNowKey,
      keyLocation: `https://${hostname}/indexnow-key.txt`,
      urlList: [url],
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(indexNowPayload),
    });

    if (response.ok) {
      console.log(`IndexNow ping successful for ${url}`);
      return NextResponse.json({ success: true, url });
    } else {
      const error = await response.text();
      console.error(`IndexNow ping failed: ${error}`);
      return NextResponse.json({ error: 'IndexNow ping failed', details: error }, { status: response.status });
    }
  } catch (error: any) {
    console.error('IndexNow API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
