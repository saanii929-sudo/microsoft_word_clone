"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Bell, Heart, ShoppingCart, SquarePen, Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useSearch } from '@/contexts/SearchContext';

function MarketplaceNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { searchTerm, setSearchTerm, clearSearch } = useSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <nav className="w-full bg-[#010313]">
      <div className="container-main h-[56px] flex items-center justify-between px-4 md:px-6">
        {/* Logo and Brand */}
        <Link
          href={"/"}
          className="flex items-center text-white gap-2 min-w-[120px] md:min-w-[180px]"
        >
          <h1 className="text-lg font-bold hidden sm:block">ScribeMatrix</h1>
          <span className="text-lg font-bold block sm:hidden">SM</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center">
          <div
            className="flex items-center bg-[#F2F4F8] rounded-[8px] px-4 relative"
            style={{ width: 400, height: 40, gap: 8 }}
          >
            <svg
              className="text-[#6B7280] mr-2"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8.5" cy="8.5" r="5.75" />
              <path d="M16 16l-3.5-3.5" />
            </svg>
            <Input
              type="text"
              placeholder="Search images, videos, fonts, graphics and more"
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent text-[#6B7280] text-base w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full pr-8"
              style={{ height: 40 }}
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Side Icons and Profile - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 min-w-[320px] lg:min-w-[420px] justify-end">
          {/* Notifications */}
          <div className="relative cursor-pointer flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <Bell size={22} className="text-white" />
              <span className="absolute -top-1 -right-1 w-[9px] h-[9px] bg-[#FF3B30] rounded-full border-[1.5px] border-[#020316]" />
            </div>
            <span className="text-xs text-white mt-1">Notifications</span>
          </div>
          {/* Favorites */}
          <div className="cursor-pointer flex flex-col items-center justify-center">
            <Heart size={22} className="text-white" />
            <span className="text-xs text-white mt-1">Favorites</span>
          </div>
          {/* Cart */}
          <div className="cursor-pointer flex flex-col items-center justify-center">
            <ShoppingCart size={22} className="text-white" />
            <span className="text-xs text-white mt-1">Cart</span>
          </div>
          {/* Profile */}
          <div className="cursor-pointer flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <Avatar className="w-6 h-6">
                <AvatarImage src="/avatar.png" alt="Profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-white mt-1">My Profile</span>
          </div>
          {/* Create Button */}
          <Link href="/creator">
            <Button
              className="flex items-center gap-2 bg-[#0093A5] text-white px-3 md:px-5 py-2 rounded-lg font-medium text-sm md:text-base transition-colors ml-2 md:ml-4 hover:bg-[#007a87] cursor-pointer"
              type="button"
            >
              <SquarePen size={18} />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <div
          className={`absolute top-[56px] left-0 right-0 bg-[#010313] z-50 md:hidden transition-all duration-300 ease-in-out transform ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container-main py-4">
            {/* Mobile Search */}
            <div
              className="flex items-center bg-[#F2F4F8] rounded-[8px] px-4 mb-4 relative"
              style={{ height: 40, gap: 8 }}
            >
              <svg
                className="text-[#6B7280] mr-2"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="8.5" cy="8.5" r="5.75" />
                <path d="M16 16l-3.5-3.5" />
              </svg>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="bg-transparent text-[#6B7280] text-base w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full pr-8"
                style={{ height: 40 }}
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {/* Mobile Menu Items */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white">
                <Bell size={20} />
                <span>Notifications</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Heart size={20} />
                <span>Favorites</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <ShoppingCart size={20} />
                <span>Cart</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="/avatar.png" alt="Profile" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span>My Profile</span>
              </div>
              <Link href="/creator" className="w-full">
                <Button className="w-full flex items-center justify-center gap-2 bg-[#0093A5] text-white py-2 rounded-lg font-medium text-base transition-colors hover:bg-[#007a87]">
                  <SquarePen size={18} />
                  Create
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


function MarketplaceSecondaryMenu() {
  const { activeCategory, setActiveCategory, clearSearch } = useSearch();

  const categories = [
    { id: 'images', label: 'Images' },
    { id: 'videos', label: 'Videos' },
    { id: 'audios', label: 'Audios' },
    { id: 'gifs', label: 'Gifs' },
    { id: 'fonts', label: 'Fonts' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory('');
    } else {
      // Set new active category
      setActiveCategory(categoryId);
    }
  };

  const handleClearAll = () => {
    clearSearch();
  };

  return (
    <div className="w-full bg-[#010313] border-t border-white/20">
      <div className="container-main flex items-center h-7 p-0 md:p-5 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-4 md:gap-10 text-white text-sm font-normal whitespace-nowrap w-max md:w-full">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`cursor-pointer transition-colors ${
                activeCategory === category.id
                  ? 'text-[#0093A5] font-semibold'
                  : 'text-white hover:text-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
          {(activeCategory) && (
            <button
              onClick={handleClearAll}
              className="text-[#FF6B6B] hover:text-[#FF5252] text-xs ml-4 px-2 py-1 rounded border border-[#FF6B6B] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MarketplaceNavbarWithMenu() {
  return (
    <>
      <MarketplaceNavbar />
      <MarketplaceSecondaryMenu />
    </>
  );
}
