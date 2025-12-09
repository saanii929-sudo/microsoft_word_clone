import { NextRequest, NextResponse } from 'next/server';

// Test endpoint to check if OpenAI API key is configured
export async function GET(request: NextRequest) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      return NextResponse.json({
        configured: false,
        message: 'OPENAI_API_KEY not found in environment variables',
        hint: 'Make sure you have a .env.local file with OPENAI_API_KEY=your_key_here'
      }, { status: 200 });
    }

    // Test the key by making a simple API call
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      });

      if (testResponse.ok) {
        return NextResponse.json({
          configured: true,
          valid: true,
          message: 'OpenAI API key is configured and valid',
          keyLength: openaiApiKey.length,
          keyPrefix: openaiApiKey.substring(0, 7) + '...'
        });
      } else {
        const errorData = await testResponse.json().catch(() => ({}));
        return NextResponse.json({
          configured: true,
          valid: false,
          message: 'OpenAI API key is configured but appears to be invalid',
          error: errorData.error?.message || 'Unknown error',
          status: testResponse.status
        }, { status: 200 });
      }
    } catch (testError: any) {
      return NextResponse.json({
        configured: true,
        valid: false,
        message: 'Error testing API key',
        error: testError.message
      }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({
      configured: false,
      error: error.message
    }, { status: 500 });
  }
}

