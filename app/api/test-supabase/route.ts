import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection by trying to get session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.status,
        details: error
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      hasSession: !!data.session,
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xewgwdndrkhpjezyspvq.supabase.co',
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      details: error
    }, { status: 500 });
  }
}

