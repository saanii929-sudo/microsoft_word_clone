'use client';

import { Bell, Menu } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useSearch } from '@/contexts/SearchContext';

export default function Navbar({
  setDrawerOpen,
}: {
  setDrawerOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const { searchTerm, setSearchTerm, clearSearch } = useSearch();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex items-center justify-between w-full h-[52px] xs:h-[56px] sm:h-[64px] md:h-[75px] bg-white px-2 xs:px-3 sm:px-4 md:px-6 lg:px-10">
      {/* Hamburger menu for mobile */}
      {setDrawerOpen && (
        <button
          className="md:hidden mr-1 xs:mr-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
          onClick={() => setDrawerOpen((prev: boolean) => !prev)}
          aria-label="Toggle recent designs menu"
        >
          <Menu size={22} className="xs:w-6 xs:h-6 w-5 h-5" />
        </button>
      )}
      <div className="hidden sm:flex flex-1 justify-end mr-1 xs:mr-2 sm:mr-4 md:mr-8 lg:mr-16 xl:mr-32">
        <div className="flex items-center bg-[#F2F4F8] rounded-lg p-1 xs:p-1.5 sm:p-2 md:p-3 min-w-[140px] xs:min-w-[180px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[350px]">
          <Search size={15} className="text-[#6B7280] mr-1 xs:mr-1.5 sm:mr-2" />
          <Input
            type="text"
            placeholder="Search ebooks, folders, and uploads"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-transparent text-[#6B7280] text-[11px] xs:text-xs sm:text-sm md:text-base w-full focus-visible:ring-0 focus-visible:ring-offset-0 border-0 focus:border-0"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="ml-1 text-gray-400 hover:text-gray-600 text-sm"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <div className="relative cursor-pointer">
          <Bell
            size={16}
            className="text-[#222] xs:text-[18px] sm:text-[20px] md:text-[22px]"
          />
          <span className="absolute top-[-2px] right-0 w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-[#FF3B30] rounded-full border-[1.5px] border-white" />
        </div>
        <div className="flex items-center cursor-pointer">
          <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-[#FFD600] flex items-center justify-center font-semibold text-[#222] text-[10px] xs:text-xs sm:text-sm relative z-10">
            D
          </div>
          <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#222] cursor-pointer -ml-2 relative z-0">
            +
          </div>
        </div>
        <Link href="/creator">Creator</Link>
        <Link href="/marketplace/artists">Marketplace</Link>
      </div>
    </div>
  );
}