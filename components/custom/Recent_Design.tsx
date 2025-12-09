import Image from "next/image";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

// Sample data for recent designs
const recentDesigns = [
  {
    icon: "/recent-image-1.png",
    title: "Good morning Gabe ...",
  },
  {
    icon: "/recent-image-2.png",
    title: "Daphne's first eBook...",
  },
  {
    icon: "/recent-image-3.png",
    title: "Story of my life (Story...",
  },
  {
    icon: "/recent-image-4.png",
    title: "Good morning Gabe ...",
  },
  {
    icon: "/recent-image-5.png",
    title: "A fantastic saga, the...",
  },
];

export default function RecentDesign({
  drawerOpen,
}: {
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean) => void;
}) {
  // Mobile drawer styles
  const mobileDrawer = drawerOpen !== undefined;
  return (
    <div
      className={
        mobileDrawer
          ? `fixed top-0 left-0 h-full w-[85vw] max-w-xs bg-white border-r border-[#D9D7D7] z-40 transform transition-transform duration-300 ease-in-out flex flex-col justify-between  md:transform-none md:w-[300px] md:max-w-none md:h-screen md:border-t-0 md:border-r md:relative md:translate-x-0 ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`
          : "bg-white border-t md:border-t-0 md:border-r border-[#D9D7D7] w-full md:w-[300px] flex flex-col h-auto md:h-screen justify-between p-4 md:px-4 md:pt-6 md:pb-4"
      }
      style={mobileDrawer ? { padding: 16, paddingTop: 24 } : {}}
    >
      <div className="mt-[52px] md:mt-0">
        <div className="text-[#27275A] text-[12px] sm:text-[14px] font-[400] mb-2 pl-1">
          Recent designs
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-2">
          {recentDesigns.map((design, idx) => (
            <Link
              href={"/creator/reader"}
              key={idx}
              className="flex items-center bg-white rounded-lg py-2 px-2 hover:bg-[#F5F6FA] group transition cursor-pointer"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center mr-2">
                <Image
                  src={design.icon}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                />
              </div>
              {/* Design Title */}
              <span className="flex-1 text-[10px] sm:text-[12px] text-[#27275A] truncate max-w-[120px] sm:max-w-[140px] md:max-w-[160px] font-[400]">
                {design.title}
              </span>
              {/* Action Buttons */}
              {/* <div className="ml-auto">
                <Button variant="ghost" size="icon" className="h-8 sm:h-9 md:h-10 w-8 sm:w-9 md:w-10 p-1">
                  <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 pr-2 sm:pr-3 md:pr-5">
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-[#e6e6e8]">
                      <ExternalLink className="text-[#27275A] bg-[#f2f2f3] border border-gray-200 rounded-[4px] p-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-[#e6e6e8]">
                      <Ellipsis className="text-[#27275A] bg-[#f2f2f3] border border-gray-200 rounded-[4px] p-1 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </Button>
                  </div>
                </Button>
              </div> */}
            </Link>
          ))}
        </div>
      </div>
      {/* Trash Section pinned to the very bottom */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-2 hover:bg-[#F5F6FA] rounded-lg w-full justify-start mb-2"
      >
        <Link href="/creator/trash" className="flex items-center gap-2">
          <Trash2 className="text-[#27275A] w-[14px] sm:w-[16px] md:w-[20px]" />
          <span className="text-[#27275A] text-[12px] sm:text-[13px] md:text-[14px] font-[400]">
            Trash
          </span>
        </Link>
      </Button>
    </div>
  );
}
