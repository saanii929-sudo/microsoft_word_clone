# AI Image and Video Generation Setup Guide

This guide explains how to set up real AI-powered image and video generation in your application.

## Features

- **Image Generation**: Generate images using OpenAI DALL-E API
- **Video Generation**: Generate videos using Stability AI API (optional)
- **AI Sidebar**: Access AI generation from the sidebar
- **Image Upload Dialog**: Generate images directly from the image upload dialog

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of your project (or add to your existing `.env` file):

```env
# OpenAI API Key (Required for image generation)
OPENAI_API_KEY=your_openai_api_key_here

# Stability AI API Key (Optional, for video generation)
STABILITY_API_KEY=your_stability_api_key_here
```

### 2. Get API Keys

#### OpenAI API Key (Required for Images)
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

**Note**: OpenAI DALL-E API requires credits. Check pricing at [OpenAI Pricing](https://openai.com/pricing)

#### Stability AI API Key (Optional, for Videos)
1. Go to [Stability AI Platform](https://platform.stability.ai/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

**Note**: Video generation is currently in beta and may require specific API access.

### 3. Restart Your Development Server

After adding the environment variables, restart your Next.js development server:

```bash
npm run dev
```

## Usage

### Generating Images

#### Method 1: AI Sidebar
1. Click the AI sidebar button (usually in the ribbon)
2. Select "Generate Image" from the media type dropdown
3. Enter your prompt describing the image you want
4. Click "Generate"
5. Once generated, click "Insert" on the generated image

#### Method 2: Image Upload Dialog
1. Click the "Image" button in the ribbon
2. Navigate to the "AI Generate" tab
3. Enter your prompt
4. Click "Generate Image" or press Ctrl+Enter (Cmd+Enter on Mac)
5. The image will be automatically inserted into your document

### Generating Videos

1. Open the AI Sidebar
2. Select "Generate Video" from the media type dropdown
3. Enter your prompt
4. Click "Generate"
5. Once generated, click "Insert" to add the video to your document

**Note**: Video generation requires a configured API service. If not configured, you'll see an error message.

## API Endpoints

The application uses the following API routes:

- `/api/generate-image` - Generates images using OpenAI DALL-E
- `/api/generate-video` - Generates videos using Stability AI (or other services)

## Troubleshooting

### "OpenAI API key not configured" Error
- Make sure you've added `OPENAI_API_KEY` to your `.env.local` file
- Restart your development server after adding the key
- Check that the key is valid and has credits

### "Video generation requires API configuration" Error
- Video generation is optional and requires `STABILITY_API_KEY`
- You can still use image generation without video generation
- Check the Stability AI API documentation for setup instructions

### Images Not Generating
- Check your OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check the browser console for detailed error messages
- Verify the API endpoint is accessible

## Cost Considerations

- **OpenAI DALL-E**: Charges per image generated
  - DALL-E 3: ~$0.04 per image (1024x1024)
  - DALL-E 2: ~$0.02 per image
- **Stability AI**: Check their pricing for video generation

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure
- Consider implementing rate limiting for production use
- Monitor API usage to avoid unexpected costs

## Future Enhancements

Potential improvements:
- Support for additional image generation services (Stable Diffusion, Midjourney)
- Image editing capabilities (inpainting, outpainting)
- Batch generation
- Image style presets
- Video editing features

