"use client";
import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { countries } from "@/utils/countryList";

type Country = {
  name: string;
  code: string;
};

type CountryPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
};

const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Fix: Improved filtering logic to correctly match countries
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().startsWith(search.toLowerCase())
  );

  // Reset focused index when search changes
  useEffect(() => {
    if (filteredCountries.length > 0) {
      setFocusedIndex(0);
    } else {
      setFocusedIndex(-1);
    }
  }, [search, filteredCountries]);

  useEffect(() => {
    if (listRef.current && containerRef.current && focusedIndex >= 0) {
      const countryElement = listRef.current.children[focusedIndex] as HTMLElement;
      if (countryElement) {
        const containerHeight = containerRef.current.clientHeight;
        const elementHeight = countryElement.offsetHeight;
        const focusBoxHeight = 48; // Matches the h-12 (48px) of the highlight box
        const focusBoxCenter = containerHeight / 2;

        // Calculate position to center the item in the focus box
        const scrollPosition = 
          countryElement.offsetTop - 
          (focusBoxCenter - focusBoxHeight / 2) - 
          (elementHeight / 2 - focusBoxHeight / 2);

        listRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [focusedIndex, filteredCountries]);

  const handleCountrySelect = (country: Country, index: number) => {
    setSelectedCountry(country);
    setFocusedIndex(index);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-end">
      <div className="bg-white w-full h-80 rounded-t-2xl flex flex-col shadow-lg">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <button 
            className="text-gray-600 text-base font-normal" 
            onClick={onClose}
          >
            Cancel
          </button>
          <div className="relative flex items-center w-full">
            <Search className="absolute left-2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded-full py-1 px-8 w-36 focus:outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button 
            className="text-blue-500 text-base font-normal" 
            onClick={() => {
              if (selectedCountry) onSelect(selectedCountry);
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
        
        <div ref={containerRef} className="relative flex-1 overflow-hidden">
          <div 
            className="absolute left-0 right-0 h-12 bg-gray-100 z-0 pointer-events-none" 
            style={{ top: 'calc(50% - 24px)' }}
          ></div>
          
          <div 
            ref={listRef}
            className="absolute inset-0 overflow-y-auto py-16"
            style={{ 
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {filteredCountries.map((country, index) => (
              <div
                key={index}
                className={`py-3 text-center cursor-pointer relative z-10 ${
                  index === focusedIndex ? 'text-black font-medium' : 'text-gray-400 font-normal'
                }`}
                onClick={() => handleCountrySelect(country, index)}
              >
                {country.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryPickerModal;