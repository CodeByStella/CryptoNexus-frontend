import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "/assets/images/Banner-1.jpg",
  "/assets/images/Banner-2.jpg",
  "/assets/images/Banner-3.jpg",
];

const Slider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Update width on window resize and initial load
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    
    // Initial update
    updateWidth();
    
    // Add resize listener
    window.addEventListener('resize', updateWidth);
    
    // Set loaded after a slight delay to ensure images are processed
    const timer = setTimeout(() => setIsLoaded(true), 500);
    
    return () => {
      window.removeEventListener('resize', updateWidth);
      clearTimeout(timer);
    };
  }, []);

  // Auto slide every 3 seconds, but only after width is determined
  useEffect(() => {
    if (width === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    
    return () => clearInterval(interval);
  }, [currentIndex, width]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[175px] overflow-hidden rounded-[5px]"
    >
      {isLoaded && width > 0 && (
        <motion.div
          className="flex relative h-full"
          drag="x"
          dragConstraints={{ left: -width * (images.length - 1), right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentIndex * width }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {images.map((src, i) => (
            <div key={i} className="relative flex-shrink-0" style={{ width: `${width}px`, height: '100%' }}>
              <Image 
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className="object-cover rounded-[5px]"
                priority={i === 0}
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-[7px] h-[7px] rounded-full cursor-pointer transition-all ${
              i === currentIndex ? "bg-black scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;