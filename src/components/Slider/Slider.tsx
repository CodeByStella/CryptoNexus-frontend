import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const images = [
  "/assets/images/Banner-1.jpg",
  "/assets/images/Banner-2.jpg",
  "/assets/images/Banner-3.jpg",
];

const Slider: React.FC = () => {
  // currentIndex is the virtual index in the duplicated array.
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Duplicate images for infinite effect.
  const slides = [...images, ...images];

  // Get container width on mount.
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Auto slide every 3 seconds.
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex, width]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleDragEnd = (
    _: any,
    info: { offset: { x: number } }
  ) => {
    if (info.offset.x < -50) {
      handleNext();
    } else if (info.offset.x > 50) {
      handlePrev();
    }
  };

  // When the virtual index moves beyond the originals,
  // reset the index (after a short delay so that the transition finishes).
  useEffect(() => {
    if (width === 0) return;
    if (currentIndex >= images.length) {
      setTimeout(() => {
        // Without transition, reset index to equivalent position.
        setCurrentIndex(currentIndex - images.length);
      }, 400);
    } else if (currentIndex < 0) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + images.length);
      }, 400);
    }
  }, [currentIndex, images.length, width]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[175spx] overflow-hidden rounded-[5px]"
    >
      <motion.div
        className="flex"
        drag="x"
        // Allow dragging freely in both directions.
        dragConstraints={{ left: -width * (slides.length - 1), right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={{ x: -currentIndex * width }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="w-full h-full flex-shrink-0 rounded-[5px] object-cover"
          />
        ))}
      </motion.div>

      {/* Navigation Dots (only for original images) */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-[7px] h-[7px] rounded-full cursor-pointer transition-all ${
              i === (currentIndex % images.length)
                ? "bg-black scale-125"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
