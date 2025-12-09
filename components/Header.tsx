'use client';

import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation'; // ✅ Next.js router
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, signOut } = useAuth();
  const router = useRouter(); // ✅ valid hook in Next.js

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo / Home Click */}
        <div
          className="flex items-center gap-2 cursor-pointer transition-smooth hover:opacity-80"
          onClick={() => router.push('/')} // ✅ Next.js navigation
        >
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ReadWrite
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            {/* Create new document */}
            <Button
              variant="default"
              onClick={() => router.push('/editor/new')} // ✅ Next.js navigation
              className="shadow-soft hover:shadow-medium transition-smooth"
            >
              New Document
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
