"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft, Download } from "lucide-react"; // Added Download
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  const router = useRouter();

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, images.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isHovered) {
      // Only set timer if not hovered
      timer = setTimeout(() => {
        goToNext();
      }, 5000); // Change image every 5 seconds
    }
    return () => clearTimeout(timer);
  }, [currentIndex, images.length, isHovered, goToNext]); // Added isHovered and goToNext to dependency array

  const handleDownloadAll = async () => {
    if (!images || images.length === 0) return;
    setIsDownloading(true);
    const zip = new JSZip();
    try {
      for (let i = 0; i < images.length; i++) {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        // Extract filename from path, or use index as fallback
        const filename =
          images[i].substring(images[i].lastIndexOf("/") + 1) ||
          `image_${i + 1}.png`;
        zip.file(filename, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "images.zip");
    } catch (error) {
      console.error("Error zipping images:", error);
      // Handle error (e.g., show a notification to the user)
    } finally {
      setIsDownloading(false);
    }
  };

  if (!images || images.length === 0) {
    return <p>No images to display.</p>;
  }

  return (
    <div
      className="relative w-full max-w-2xl mx-auto flex flex-col items-center rounded-lg shadow-lg bg-gray-100 dark:bg-gray-700 p-4"
      onMouseEnter={() => setIsHovered(true)} // Set hovered to true
      onMouseLeave={() => setIsHovered(false)} // Set hovered to false
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-black bg-black bg-opacity-50 hover:bg-opacity-75 z-10" // Added z-10
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownloadAll}
        disabled={isDownloading}
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-black hover:bg-opacity-75 z-10"
        aria-label="Download all images"
      >
        {isDownloading ? (
          <svg
            className="animate-spin h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <Download className="h-6 w-6" />
        )}
      </Button>
      <div className="relative w-full overflow-hidden rounded-t-lg mt-12">
        {" "}
        {/* Added mt-12 to make space for back button */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="w-full flex-shrink-0 h-96 relative">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill // Changed from layout="fill"
                objectFit="contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-75"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center justify-center space-x-2 pt-4 pb-1">
        {" "}
        {/* Changed py-4 to pt-4 pb-1 to move dots lower */}
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index
                ? "bg-blue-500"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
