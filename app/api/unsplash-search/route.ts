import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, per_page = 12 } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!unsplashKey) {
      return NextResponse.json(
        {
          error: 'Unsplash API key not configured',
          message: 'Please set UNSPLASH_ACCESS_KEY in your environment variables.'
        },
        { status: 500 }
      );
    }

    console.log('Searching Unsplash for:', query);

    const searchResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${per_page}&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${unsplashKey}`,
        },
      }
    );

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json().catch(() => ({}));
      console.error('Unsplash API Error:', errorData);
      
      if (searchResponse.status === 401) {
        return NextResponse.json(
          {
            error: 'Invalid Unsplash API key',
            message: 'Please check your UNSPLASH_ACCESS_KEY in environment variables.',
          },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        {
          error: 'Unsplash search failed',
          message: errorData.errors?.[0] || `HTTP ${searchResponse.status}`,
        },
        { status: searchResponse.status }
      );
    }

    const data = await searchResponse.json();

    return NextResponse.json({
      results: data.results || [],
      total: data.total || 0,
      total_pages: data.total_pages || 0,
    });

  } catch (error: any) {
    console.error('Error searching Unsplash:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

