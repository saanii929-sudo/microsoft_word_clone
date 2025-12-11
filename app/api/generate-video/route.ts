import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration = 5 } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const stabilityApiKey = process.env.STABILITY_API_KEY;

    if (!stabilityApiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    console.log('Generating image for:', prompt);
    
    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/ultra',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stabilityApiKey}`,
          'Accept': 'application/json',
        },
        body: (() => {
          const formData = new FormData();
          formData.append('prompt', prompt);
          formData.append('output_format', 'jpeg');
          formData.append('aspect_ratio', '16:9');
          return formData;
        })(),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const imageData = await response.json();
    const base64Image = imageData.image;
    
    if (!base64Image) {
      throw new Error('No image data received');
    }

    // Create a filename
    const timestamp = Date.now();
    const filename = `image_${timestamp}_${imageData.seed}.jpg`;
    const filepath = path.join(uploadsDir, filename);
    
    // Save the image to file system
    const buffer = Buffer.from(base64Image, 'base64');
    fs.writeFileSync(filepath, buffer);
    
    // Create the public URL
    const publicUrl = `/uploads/${filename}`;
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      revised_prompt: prompt,
      source: 'stability-ai',
      duration: duration,
      seed: imageData.seed,
      local_path: filepath
    });

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Generation failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}