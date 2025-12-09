'use client';
import Image from "next/image";
import { Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearch } from '@/contexts/SearchContext';

const books = [
  {
    id: "1",
    title: "Brutal",
    author: "Hoosh Ink",
    price: "$4.99",
    cover: "/book8.png",
    type: "Ebook",
    category: "ebooks",
    mediaType: "ebook",
    description: "A brutal and gripping story of survival",
  },
  {
    id: "2",
    title: "Authority",
    author: "Jeff Vandermeer",
    price: "$11.99",
    cover: "/book9.png",
    type: "Ebook",
    category: "ebooks",
    mediaType: "ebook",
    description: "Thrilling authority and power dynamics",
  },
  {
    id: "3",
    title: "Babe Hager",
    author: "Babe Hager",
    price: "$2.99",
    cover: "/book10.png",
    type: "Ebook",
    category: "ebooks",
    mediaType: "ebook",
    description: "Personal stories and life lessons",
  },
  {
    id: "4",
    title: "Never Flinch",
    author: "Stephen King",
    price: "$16.99",
    cover: "/book11.png",
    type: "Audiobook",
    category: "audiobooks",
    mediaType: "audio",
    description: "Masterful horror that never lets you flinch",
  },
  {
    id: "5",
    title: "The Obsession",
    author: "Jesse Q. Sutanto",
    price: "$8.99",
    cover: "/book12.png",
    type: "Ebook",
    category: "ebooks",
    mediaType: "ebook",
    description: "A story of dangerous obsession and love",
  },
  {
    id: "6",
    title: "Unlikely Story",
    author: "Ali Rosen",
    price: "$2.99",
    cover: "/book13.png",
    type: "Ebook",
    category: "ebooks",
    mediaType: "ebook",
    description: "An unlikely but heartwarming tale",
  },
  {
    id: "7",
    title: "Thrill Ride",
    author: "Amy Ratcliffe",
    price: "$9.99",
    cover: "/book14.png",
    type: "Audiobook",
    category: "audiobooks",
    mediaType: "audio",
    description: "Non-stop action and thrilling adventures",
  },
];

export default function NewRelease() {
  const { searchTerm, activeCategory } = useSearch();

  const filteredBooks = books.filter((book) => {
    if (searchTerm) {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeCategory) {
        const matchesCategory =
          book.category.toLowerCase() === activeCategory.toLowerCase() ||
          book.type.toLowerCase() === activeCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      }
      return matchesSearch;
    }
    if (activeCategory) {
      return (
        book.category.toLowerCase() === activeCategory.toLowerCase() ||
        book.type.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    return true;
  });

  const shouldShowComponent =
    (!searchTerm && !activeCategory) || filteredBooks.length > 0;

  if (!shouldShowComponent) {
    return null;
  }

  return (
    <div className="w-full py-4 sm:py-6 md:py-8">
      <div className="container-main">
        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-[14px] sm:text-[15px] font-[600] text-[#151C4F]">
            New Release
            {(searchTerm || activeCategory) && (
              <span className="text-[12px] text-gray-500 font-normal ml-2">
                ({filteredBooks.length} result
                {filteredBooks.length !== 1 ? "s" : ""})
              </span>
            )}
          </h2>
          <a
            href="#"
            className="text-[#4F8CFF] text-[14px] sm:text-[16px] font-[400] hover:underline flex items-center gap-1"
          >
            See more <ChevronRight size={16} />
          </a>
        </div>
        <div className="border-b-2 border-[#D1D5DB] mb-4 sm:mb-6 w-full" />

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-6">
            {filteredBooks.map((book) => (
              <Link key={book.id} href={"/creator"}>
                <div className="flex flex-col w-full group cursor-pointer">
                  <div className="relative w-full aspect-[2/3] flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={book.cover}
                      alt={book.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition group-hover:scale-105 duration-200"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, (max-width: 1536px) 16vw, 14vw"
                    />
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {book.type}
                    </div>
                  </div>
                  <div className="px-1 pt-2 flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span
                        className="font-[400] text-[12px] sm:text-[14px] text-[#151C4F] truncate"
                        title={book.title}
                      >
                        {book.title}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-pink-500 transition" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] sm:text-[12px] text-[#555979] font-[400] truncate">
                        <span className="capitalize">{book.author}</span>
                      </span>
                      <span className="font-[700] text-[#151C4F] text-[12px] sm:text-[14px] whitespace-nowrap">
                        {book.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              No best sellers match your current search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
