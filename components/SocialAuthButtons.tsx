// components/SocialAuthButtons.tsx
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

interface SocialAuthButtonsProps {
  onSocialAuth: (provider: 'google' | 'github') => void;
  loading: boolean;
}

export function SocialAuthButtons({ onSocialAuth, loading }: SocialAuthButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        
        onClick={() => onSocialAuth('google')}
        disabled={loading}
        className="h-11"
      >
        Google
      </Button>
      
      <Button
        type="button"
        
        onClick={() => onSocialAuth('github')}
        disabled={loading}
        className="h-11"
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}