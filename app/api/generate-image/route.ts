import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        {
          error: 'Invalid request body',
          message: 'Request body must be valid JSON',
          details: parseError.message
        },
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { prompt, size = '1024x1024', useUnsplash = true } = requestBody;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Try Unsplash first (for stock photos based on search)
    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (useUnsplash && unsplashKey) {
      try {
        console.log('Searching Unsplash for:', prompt);
        
        // Search Unsplash for images matching the prompt
        const searchResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=1&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${unsplashKey}`,
            },
          }
        );

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          
          if (searchData.results && searchData.results.length > 0) {
            const image = searchData.results[0];
            const imageUrl = image.urls?.regular || image.urls?.full || image.urls?.raw;
            
            if (imageUrl) {
              console.log('Found Unsplash image:', imageUrl);
              return NextResponse.json({
                url: imageUrl,
                revised_prompt: prompt,
                source: 'unsplash',
                photographer: image.user?.name,
                photographer_url: image.user?.links?.html,
              });
            }
          }
        } else {
          console.warn('Unsplash search failed, falling back to OpenAI');
        }
      } catch (unsplashError: any) {
        console.warn('Unsplash error, falling back to OpenAI:', unsplashError.message);
      }
    }

    // Fallback to OpenAI DALL-E for AI-generated images
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        console.log('Generating image with OpenAI DALL-E:', prompt);
        
        const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            n: 1,
            size: size === '1024x1024' ? '1024x1024' : '1024x1024',
            quality: 'standard',
          }),
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json().catch(() => ({}));
          console.error('OpenAI API Error:', errorData);
          
          if (openaiResponse.status === 401) {
            return NextResponse.json(
              {
                error: 'Invalid OpenAI API key',
                message: 'Please check your OPENAI_API_KEY in environment variables.',
              },
              { status: 401 }
            );
          }
          
          if (openaiResponse.status === 402 || openaiResponse.status === 429) {
            return NextResponse.json(
              {
                error: 'OpenAI API quota exceeded',
                message: 'Please check your OpenAI account billing and usage limits.',
              },
              { status: openaiResponse.status }
            );
          }
          
          throw new Error(errorData.error?.message || `OpenAI API error: ${openaiResponse.status}`);
        }

        const openaiData = await openaiResponse.json();
        
        if (openaiData.data && openaiData.data[0] && openaiData.data[0].url) {
          return NextResponse.json({
            url: openaiData.data[0].url,
            revised_prompt: openaiData.data[0].revised_prompt || prompt,
            source: 'openai',
          });
        }
      } catch (openaiError: any) {
        console.error('OpenAI generation error:', openaiError);
        throw openaiError;
      }
    }

    // If neither service is available
    return NextResponse.json(
      {
        error: 'Image generation not available',
        message: 'Please configure either UNSPLASH_ACCESS_KEY or OPENAI_API_KEY in your environment variables.',
      },
      { status: 500 }
    );

  } catch (error: any) {
    console.error('Error generating image:', error);
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
