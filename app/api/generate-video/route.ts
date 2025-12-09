import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration = 5 } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check for Stability AI API key (for video generation)
    const stabilityApiKey = process.env.STABILITY_API_KEY;
    
    if (!stabilityApiKey) {
      // Fallback: Use a placeholder service or return error
      // For now, we'll return an error with instructions
      return NextResponse.json(
        { 
          error: 'Stability AI API key not configured',
          message: 'Please set STABILITY_API_KEY in your environment variables. Video generation requires Stability AI API access.',
          fallback: true
        },
        { status: 500 }
      );
    }

    // Use Stability AI Video Generation API
    // Note: This is a placeholder - adjust based on actual Stability AI video API
    const response = await fetch('https://api.stability.ai/v2beta/image-to-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${stabilityApiKey}`,
      },
      body: JSON.stringify({
        image: '', // Would need an initial image for image-to-video
        prompt: prompt,
        duration: duration,
      }),
    });

    // Alternative: Use text-to-video if available
    // For now, we'll use a mock response structure
    // In production, you would use the actual Stability AI or Runway ML API

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // If API is not available, provide a fallback message
      return NextResponse.json(
        { 
          error: 'Video generation service unavailable',
          details: errorData.error?.message || 'Video generation requires a configured API service',
          fallback: true,
          message: 'Video generation is currently in beta. Please use image generation for now.'
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      url: data.url || data.video_url || '',
      id: data.id || '',
      status: data.status || 'completed',
    });

  } catch (error: any) {
    console.error('Error generating video:', error);
    
    // Return a helpful error message
    return NextResponse.json(
      { 
        error: 'Video generation failed',
        message: error.message,
        fallback: true,
        note: 'Video generation requires a configured API service (Stability AI, Runway ML, or similar)'
      },
      { status: 500 }
    );
  }
}

