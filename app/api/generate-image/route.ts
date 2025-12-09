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
    
    const { prompt, size = '1024x1024', model = 'dall-e-3' } = requestBody;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check for OpenAI API key
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          message: 'Please set OPENAI_API_KEY in your environment variables. Make sure to restart your development server after adding it.',
          hint: 'Check your .env.local file and ensure the variable is named exactly OPENAI_API_KEY'
        },
        { status: 500 }
      );
    }

    // Log that we're attempting to generate (without exposing the key)
    console.log('Attempting to generate image with OpenAI API...', {
      promptLength: prompt.length,
      model: model === 'dall-e-3' ? 'dall-e-3' : 'dall-e-2',
      keyPresent: !!openaiApiKey,
      keyLength: openaiApiKey.length
    });

    // Use OpenAI DALL-E API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: model === 'dall-e-3' ? 'dall-e-3' : 'dall-e-2',
        prompt: prompt,
        n: 1,
        size: model === 'dall-e-3' ? '1024x1024' : size,
        quality: model === 'dall-e-3' ? 'standard' : undefined,
      }),
    });

    if (!response.ok) {
      let errorData: any = {};
      const contentType = response.headers.get('content-type');
      
      try {
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          errorData = text ? JSON.parse(text) : {};
        } else {
          const text = await response.text().catch(() => '');
          errorData = { message: text || response.statusText };
        }
      } catch (parseError) {
        console.error('Error parsing OpenAI error response:', parseError);
        errorData = { message: response.statusText || 'Unknown error' };
      }
      
      console.error('OpenAI API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        contentType
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to generate image',
          details: errorData.error?.message || errorData.message || errorData.error?.code || `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          fullError: process.env.NODE_ENV === 'development' ? errorData : undefined
        },
        { 
          status: response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    const data = await response.json();
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      return NextResponse.json(
        { error: 'Invalid response from image generation API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.data[0].url,
      revised_prompt: data.data[0].revised_prompt || prompt,
    });

  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message || 'An unexpected error occurred',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

