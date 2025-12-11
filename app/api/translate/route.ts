import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text, targetLanguage, sourceLanguage } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            return NextResponse.json(
                { error: 'Target language is required' },
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

        // Language code mapping
        const languageNames: { [key: string]: string } = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese',
            'ar': 'Arabic',
            'hi': 'Hindi',
            'nl': 'Dutch',
            'pl': 'Polish',
            'tr': 'Turkish',
        };

        const targetLangName = languageNames[targetLanguage.split('-')[0]] || targetLanguage;
        const sourceLangName = sourceLanguage ? (languageNames[sourceLanguage.split('-')[0]] || sourceLanguage) : 'the source language';

        const systemInstruction = `You are a professional translator. Translate the following text from ${sourceLangName} to ${targetLangName}. Provide only the translation, no explanations or additional text. Maintain the original formatting, tone, and meaning.`;

        let modelName = 'gemini-2.5-pro';
        let apiVersion = 'v1';
        
        let response = await fetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${geminiApiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${systemInstruction}\n\nText to translate:\n${text}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 2000,
                    }
                }),
            }
        );

        let errorData = {};
        
        // Handle response
        if (!response.ok) {
            try {
                errorData = await response.json();
            } catch {
                errorData = { error: { message: `HTTP ${response.status}` } };
            }

            // If 404, try gemini-1.0-pro as fallback
            if (response.status === 404) {
                console.log(`${modelName} not found, trying gemini-1.0-pro-latest...`);
                modelName = 'gemini-1.0-pro-latest';
                
                response = await fetch(
                    `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${geminiApiKey}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: `${systemInstruction}\n\nText to translate:\n${text}`
                                }]
                            }],
                            generationConfig: {
                                temperature: 0.3,
                                maxOutputTokens: 2000,
                            }
                        }),
                    }
                );
                
                if (!response.ok) {
                    try {
                        errorData = await response.json();
                    } catch {
                        errorData = { error: { message: `HTTP ${response.status}` } };
                    }
                }
            }
        }

        // Final error check
        if (!response.ok) {
            console.error('Gemini API Error:', errorData);
            
            // More specific error messages
            if (response.status === 401 || response.status === 403) {
                return NextResponse.json(
                    {
                        error: 'Authentication failed',
                        message: 'Please check your GEMINI_API_KEY is valid and has proper permissions.',
                    },
                    { status: 401 }
                );
            }
            
            if (response.status === 404) {
                return NextResponse.json(
                    {
                        error: 'Model not found',
                        message: `The model '${modelName}' is not available. Please check available models in your Google AI Studio.`,
                        details: errorData
                    },
                    { status: 404 }
                );
            }
            
            return NextResponse.json(
                {
                    error: 'Translation failed',
                    message: errorData.error?.message || `HTTP ${response.status}`,
                    details: errorData
                },
                { status: response.status || 500 }
            );
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid Gemini response:', data);
            return NextResponse.json(
                { 
                    error: 'Invalid response from Gemini API', 
                    details: data 
                },
                { status: 500 }
            );
        }

        const translatedText = data.candidates[0].content.parts[0].text.trim();

        return NextResponse.json({
            translatedText,
            sourceLanguage: sourceLanguage || 'auto',
            targetLanguage,
        });

    } catch (error: any) {
        console.error('Error translating text:', error);
        return NextResponse.json(
            {
                error: 'Translation failed',
                message: error.message || 'An unexpected error occurred',
            },
            { status: 500 }
        );
    }
}