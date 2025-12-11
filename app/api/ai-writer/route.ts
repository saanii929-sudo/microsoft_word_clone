import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { prompt, action, selectedText } = await request.json();

        if (!prompt && !selectedText) {
            return NextResponse.json(
                { error: 'Prompt or selected text is required' },
                { status: 400 }
            );
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {
            return NextResponse.json(
                {
                    error: 'Gemini API key not configured',
                    message: 'Please set GEMINI_API_KEY in your environment variables.'
                },
                { status: 500 }
            );
        }

        // Build prompt based on action
        let systemInstruction = '';
        let userMessage = '';

        switch (action) {
            case 'generate':
                systemInstruction = 'You are a helpful writing assistant. Generate clear, well-written content based on the user\'s prompt.';
                userMessage = prompt;
                break;
            case 'rewrite':
                systemInstruction = 'You are a helpful writing assistant. Rewrite the following text to improve clarity, grammar, and style while maintaining the original meaning.';
                userMessage = selectedText;
                break;
            case 'longer':
                systemInstruction = 'You are a helpful writing assistant. Expand the following text to make it more detailed and comprehensive while maintaining the original meaning.';
                userMessage = selectedText;
                break;
            case 'shorter':
                systemInstruction = 'You are a helpful writing assistant. Make the following text more concise while preserving the key points and meaning.';
                userMessage = selectedText;
                break;
            case 'formal':
                systemInstruction = 'You are a helpful writing assistant. Rewrite the following text in a formal, professional tone.';
                userMessage = selectedText;
                break;
            case 'casual':
                systemInstruction = 'You are a helpful writing assistant. Rewrite the following text in a casual, friendly tone.';
                userMessage = selectedText;
                break;
            case 'professional':
                systemInstruction = 'You are a helpful writing assistant. Rewrite the following text in a professional business tone.';
                userMessage = selectedText;
                break;
            case 'fix':
                systemInstruction = 'You are a helpful writing assistant. Fix grammar, spelling, and punctuation errors in the following text. Keep the original meaning and style.';
                userMessage = selectedText;
                break;
            case 'summarize':
                systemInstruction = 'You are a helpful writing assistant. Create a concise summary of the following text, capturing the main points.';
                userMessage = selectedText;
                break;
            default:
                systemInstruction = 'You are a helpful writing assistant.';
                userMessage = prompt || selectedText;
        }

        const fullPrompt = `${systemInstruction}\n\n${userMessage}`;

        // Use Gemini API - try gemini-1.5-pro first, fallback to gemini-1.5-flash
        let modelName = 'gemini-2.5-pro';
        let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000,
                }
            }),
        });

        // If model not found, try gemini-1.5-flash
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (errorData.error?.code === 404) {
                console.log('gemini-1.5-pro not found, trying gemini-1.5-flash...');
                modelName = 'gemini-1.5-flash';
                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: fullPrompt
                            }]
                        }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 1000,
                        }
                    }),
                });
            }
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', errorData);
            return NextResponse.json(
                {
                    error: 'Failed to generate text',
                    details: errorData.error?.message || `HTTP ${response.status}`,
                    fullError: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid Gemini response:', data);
            return NextResponse.json(
                { error: 'Invalid response from AI', details: data },
                { status: 500 }
            );
        }

        const generatedText = data.candidates[0].content.parts[0].text;

        return NextResponse.json({
            text: generatedText.trim(),
        });

    } catch (error: any) {
        console.error('Error in AI writer:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error.message
            },
            { status: 500 }
        );
    }
}
