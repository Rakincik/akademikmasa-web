"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div 
        className="w-full rounded-[2.5rem] border-8 border-slate-800 shadow-2xl relative z-10 flex items-center justify-center bg-slate-800 text-slate-500 font-bold"
        style={{ aspectRatio: '3/4' }}
      >
        Görsel Bulunmuyor
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt={title} 
        className="w-full object-cover rounded-[2.5rem] border-8 border-slate-800 shadow-2xl relative z-10" 
        style={{ aspectRatio: '3/4' }}
      />
    );
  }

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full z-10 flex flex-col gap-4">
      {/* Main Slider Display */}
      <div className="relative w-full rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-950 group" style={{ aspectRatio: '3/4' }}>
        <img 
          src={images[activeIndex]} 
          alt={`${title} - Görsel ${activeIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-500 ease-in-out transform scale-100" 
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={handlePrev}
          type="button"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Floating Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-6 bg-brand-500' : 'w-2.5 bg-white/60 hover:bg-white'}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails list below main image */}
      <div className="flex gap-2.5 overflow-x-auto py-2 shrink-0 scrollbar-none justify-center">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeIndex === idx ? 'border-brand-500 scale-105 shadow-md shadow-brand-500/20' : 'border-slate-300 opacity-60 hover:opacity-100'}`}
          >
            <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
