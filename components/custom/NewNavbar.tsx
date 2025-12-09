"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  FileEdit,
  AtSign,
  Eraser,
  CaseSensitive,
  Moon,
  SquarePen
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NewNavbarProps {
  className?: string;
}

export default function NewNavbar({ className = "" }: NewNavbarProps) {
  const pathname = usePathname();

  // Navigation icons on the left
  const navItems: Array<{
    icon?: React.ComponentType<{ size?: number }>;
    path: string;
    label: string;
    image?: string;
  }> = [
    { path: "#", label: "Home", image: "/home.png" },
    { path: "/creator", label: "Studio", image: "/notebook.png" },
    { icon: FileEdit, path: "/creator/studio", label: "Editor" },
    { icon: AtSign, path: "#", label: "Mentions" },
    { icon: Eraser, path: "#", label: "Enhance" },
    { icon: CaseSensitive, path: "#", label: "Fonts" },
  ];

  const isActive = (path: string) => {
    if (path === "#") {
      return false;
    }
    if (path === "/creator") {
      return pathname === "/creator";
    }
    if (path === "/creator/studio") {
      return pathname?.startsWith("/creator/studio");
    }
    return pathname?.startsWith(path);
  };

  return (
    <nav className={cn("w-full bg-background border-b border-border", className)}>
      <div className="container-main h-[64px] flex items-center justify-between">
        {/* Left Side - Navigation Icons */}
        <div className="flex items-center gap-2">
          {/* Navigation Icon Buttons */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = typeof item.icon !== 'string' ? item.icon : null;
              const isHome = item.label === "Home";
              const active = isHome ? true : isActive(item.path);
              return (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.path}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                        active 
                          ? 'text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                      style={active ? { backgroundColor: '#1A237E' } : undefined}
                    >
                      {item.image ? (
                        <Image 
                          src={item.image} 
                          alt={item.label}
                          width={20}
                          height={20}
                          className={cn("object-contain", active && "brightness-0 invert")}
                          unoptimized
                        />
                      ) : Icon ? (
                        <Icon size={20} />
                      ) : null}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            disabled
          >
            <Moon size={20} />
          </Button>

          {/* Profile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0 hidden sm:flex"
          >
            <Avatar className="h-10 w-10 border-2 border-border hover:border-primary transition-colors">
              <AvatarImage src="/avatar.png" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>

          {/* Create Button */}
          <Link href="/creator">
            <Button
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
              size="default"
              style={{ backgroundColor: '#1A237E' }}
            >
              <SquarePen size={20} />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </Link>

        </div>
      </div>
    </nav>
  );
}

