import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HomeBanner() {
  return (
    <div className="w-full">
      <div className="container-main mt-4 sm:mt-6 md:mt-8 lg:mt-10">
        <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] bg-[rgba(255,248,238,0.9)] rounded-2xl overflow-hidden flex items-center justify-between">
          {/* Left: Text Content */}
          <div className="z-10 py-4 sm:py-6 md:py-8 flex-1 flex flex-col justify-center pl-3 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-16 pr-3 sm:pr-4 md:pr-6 lg:pr-8 xl:pr-20">
            <h1 className="text-[24px] sm:text-[28px] md:text-[32px] lg:text-[35px] font-[500] text-[#151C4F] mb-1 sm:mb-2 tracking-tight">
              1000 BLACK UMBRELLAS
            </h1>
            <p className="text-[#151C4F] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[21px] font-[400] mb-2 max-w-5xl">
              Poems of absolute nakedness that chase the power of love. Daniel McGinn is<br className="hidden sm:block"/> one of the most admired poets in the underground American poetry scene.
            </p>
            <Button 
              className="bg-transparent border border-[#151C4F] text-[#151C4F] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[21px] w-fit px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 font-[400] rounded-md mt-2 sm:mt-3 md:mt-4 hover:bg-[#151C4F] hover:text-white transition-all duration-300 cursor-pointer"
              size="lg"
            >
              PURCHASE EBOOK
            </Button>
          </div>

          {/* Right: Book Cover */}
          <div className="hidden md:block absolute" style={{ top: '50%', right: '20px', transform: 'translateY(-50%)' }}>
            <Image
              src="/book.png"
              alt="1000 Black Umbrellas Book Cover"
              width={160}
              height={240}
              className="object-contain rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
