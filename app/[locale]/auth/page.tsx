'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BookOpen, AlertCircle, ArrowRight, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const t = useTranslations('Auth');
  const tCommon = useTranslations('Common');

  useEffect(() => {
    // Check if Supabase keys are configured and test connection
    if (!supabase) {
      setIsSupabaseConfigured(false);
      console.error('Supabase client is not initialized');
      return;
    }

    // Test Supabase connection
    const testConnection = async () => {
      try {
        // Try to get current session to test connection
        const { error } = await supabase.auth.getSession();
        if (error && error.message.includes('Invalid API key')) {
          console.error('Invalid Supabase API key detected:', error);
          setIsSupabaseConfigured(false);
          toast.error('Invalid Supabase API key. Please check your Supabase dashboard and update the key.');
        } else {
          console.log('Supabase connection test successful');
          setIsSupabaseConfigured(true);
        }
      } catch (err: any) {
        console.error('Supabase connection test failed:', err);
        if (err?.message?.includes('Invalid API key') || err?.message?.includes('JWT')) {
          setIsSupabaseConfigured(false);
          toast.error('Invalid Supabase API key. Please verify your API key in the Supabase dashboard.');
        }
      }
    };

    testConnection();
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      toast.error("Supabase is not configured. Please check your configuration.");
      console.error('Supabase check failed:', { isSupabaseConfigured, supabase });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        console.log('Attempting to sign in with email:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          console.error('Sign in error:', error);

          // Provide more specific error messages
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials or sign up if you don\'t have an account.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please check your email and verify your account before signing in.');
          } else {
            throw error;
          }
        }

        console.log('Sign in successful:', data);
        toast.success(t('welcomeBack'));
        // Wait a bit for session to be set
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        console.log('Attempting to sign up...');
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: fullName.trim() || undefined,
            },
          },
        });

        if (error) {
          console.error('Sign up error:', error);
          throw error;
        }

        console.log('Sign up response:', data);

        // Check if email confirmation is required
        if (data.user && !data.session) {
          toast.success('Account created! Please check your email to verify your account.');
          // Don't redirect if email confirmation is required
          setEmail('');
          setPassword('');
          setFullName('');
        } else if (data.session) {
          toast.success(tCommon('success'));
          router.push('/');
        } else {
          toast.success('Account created! Please check your email.');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);

      // Handle specific error types with helpful messages
      if (error?.message?.includes('Invalid API key') || error?.message?.includes('JWT')) {
        toast.error('Invalid Supabase API key. Please check your Supabase dashboard and update the API key.');
        setIsSupabaseConfigured(false);
      } else if (error?.message?.includes('Invalid login credentials') || error?.message?.includes('Invalid email or password')) {
        // More helpful message for login errors
        const message = isLogin
          ? 'Invalid email or password. Please check your credentials or click "Sign up" if you don\'t have an account yet.'
          : error.message || 'Invalid email or password';
        toast.error(message);
      } else if (error?.message?.includes('Email not confirmed')) {
        toast.error('Please check your email and verify your account before signing in.');
      } else if (error?.message?.includes('User already registered')) {
        toast.error('This email is already registered. Please sign in instead.');
      } else if (error?.message?.includes('Email rate limit exceeded')) {
        toast.error('Too many requests. Please try again later.');
      } else if (error?.message?.includes('Password should be at least')) {
        toast.error('Password is too short. Please use at least 6 characters.');
      } else {
        const errorMessage = error?.message || error?.error_description || 'An error occurred';
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    toast.success("Entering Demo Mode");
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-100 dark:bg-slate-950">

      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-3xl z-0" />
      </div>


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">
          {/* Decorative Header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg shadow-indigo-500/30 text-white mb-2">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {isLogin ? t('welcomeBack') : t('createAccount')}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                {isLogin ? t('enterDetails') : 'Start your creative journey today'}
              </p>
            </div>
          </div>

          {!isSupabaseConfigured && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium mb-1">Missing Configuration</p>
                <p className="text-amber-700 dark:text-amber-300 opacity-90">
                  Supabase keys are missing. Authentication is disabled.
                </p>
                <Button
                  variant="link"
                  className="text-amber-900 dark:text-amber-100 p-0 h-auto mt-2 font-semibold hover:underline"
                  onClick={handleDemoLogin}
                >
                  {t('demoMode')} &rarr;
                </Button>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <Label htmlFor="fullName" className="text-xs font-semibold uppercase text-slate-500">{t('fullName')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    className="bg-white/50 dark:bg-black/20 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase text-slate-500">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/50 dark:bg-black/20 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-semibold uppercase text-slate-500">{t('password')}</Label>
                {isLogin && <a href="#" className="text-xs text-indigo-500 hover:text-indigo-600 font-medium">Forgot?</a>}
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/50 dark:bg-black/20 border-slate-200/60 focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading || !isSupabaseConfigured}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  {tCommon('loading')}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  {isLogin ? t('signIn') : t('signUp')}
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-white/10 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
              >
                {isLogin ? t('signUp') : t('signIn')}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}