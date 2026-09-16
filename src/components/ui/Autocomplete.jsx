import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export default function Autocomplete({ value, onChange, fetchOptions, placeholder, icon: Icon }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleInputChange = async (e) => {
    const userInput = e.target.value;
    onChange(userInput);

    if (userInput.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    if (fetchOptions) {
      try {
        const results = await fetchOptions(userInput);
        setSuggestions(results || []);
        setIsOpen(true);
      } catch (error) {
        console.error("Erreur lors de la récupération des suggestions", error);
      }
    }
  };

  const handleSelectOption = (option) => {
    onChange(option);
    setIsOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      )}
      <Input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        className={`h-[50px] rounded-xl bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 border-gray-200 dark:border-[#333537] text-base focus-visible:ring-indigo-500/50 ${Icon ? "pl-11" : "px-5"}`}
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-[#1e1f20] border border-gray-100 dark:border-[#333537] rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelectOption(item)}
              className="px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}