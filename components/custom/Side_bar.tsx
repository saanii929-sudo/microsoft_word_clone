"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";


const links = [
  {
    icon: "/home-icon.png",
    label: "Home",
    path: "/"
  },
  {
    icon: "/design-icon.png",
    label: "Design St.",
    path: "/creator/studio"
  }
];


export default function Sidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`fixed md:relative bg-[#050616] w-full md:w-[80px] h-[60px] md:h-screen bottom-0 left-0 right-0 md:top-0 transition-all duration-300 ease-in-out z-20 ${isMenuOpen ? 'md:w-[200px]' : ''}`}>
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center justify-between px-4 h-full">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-transparent"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
        
        {/* Mobile Navigation Links: show only first two, centered */}
        <div className="flex flex-1 items-center justify-center gap-8">
          {links.slice(0, 2).map((link) => (
            <Link
            href={link.path}
              key={link.path}
              // variant="ghost"
              // size="icon"
              className={`flex cursor-pointer flex-col items-center justify-center flex-1 p-2 rounded-lg transition-colors duration-200 ${
                pathname === link.path ? 'bg-[#1a1c2b]' : 'hover:bg-transparent'
              }`}
            >
              <Image 
                src={link.icon} 
                alt={link.label} 
                width={24} 
                height={24} 
                className="hover:opacity-80 transition-opacity duration-200 mb-1"
                priority={link.path === "/"}
              />
              <span className="text-white text-xs">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-col items-center justify-center gap-4 p-4 md:pt-10">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="mb-5 hover:bg-transparent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
          
          {/* Desktop Navigation Links */}
          {links.map((link) => (
            <Link href={link.path} 
              key={link.path} 
              className="flex flex-col items-center cursor-pointer group"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  pathname === link.path ? 'bg-[#1a1c2b]' : 'group-hover:bg-transparent'
                }`}
              >
                <Image 
                  src={link.icon} 
                  alt={link.label} 
                  width={24} 
                  height={24} 
                  className="group-hover:opacity-80 transition-opacity duration-200"
                  priority={link.path === "/"}
                />
              </Button>
              
              <p className={`text-white text-xs mt-1 transition-all duration-300 ease-in-out ${
                isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              } group-hover:opacity-80 hidden md:block`}>
                {link.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}