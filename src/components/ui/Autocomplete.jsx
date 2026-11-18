import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

// Champ texte avec suggestions. fetchOptions(texte) peut être synchrone (liste locale) ou
// asynchrone (API) ; les appels réseau partent 250 ms après la dernière frappe.
// La saisie libre reste toujours possible.
export default function Autocomplete({
  value, onChange, fetchOptions, placeholder, icon: Icon, id, ariaLabel, maxLength, inputClassName = "", minChars = 2,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef(null);
  const timerRef = useRef(null);
  // Les réponses réseau peuvent arriver dans le désordre : on n'affiche que la plus récente,
  // sinon une suggestion pour "Pa" pouvait remplacer celle de "Paris".
  const requestIdRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    onChange(userInput);
    const requestId = ++requestIdRef.current;
    clearTimeout(timerRef.current);
    setActive(-1);

    if (userInput.trim().length < minChars || !fetchOptions) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const results = await fetchOptions(userInput);
        if (requestId !== requestIdRef.current) return;
        setSuggestions((results || []).filter((r) => r !== userInput));
        setIsOpen(true);
      } catch {
        // Service de suggestions indisponible : la saisie libre continue de fonctionner
        if (requestId === requestIdRef.current) setSuggestions([]);
      }
    }, 250);
  };

  const handleSelectOption = (option) => {
    requestIdRef.current++; // ignore une réponse encore en vol
    clearTimeout(timerRef.current);
    onChange(option);
    setIsOpen(false);
    setSuggestions([]);
    setActive(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => (i + 1) % suggestions.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1)); }
    else if (e.key === "Enter" && active >= 0) { e.preventDefault(); handleSelectOption(suggestions[active]); }
    else if (e.key === "Escape") setIsOpen(false);
  };

  const listId = id ? `${id}-suggestions` : undefined;

  return (
    <div ref={wrapperRef} className="relative w-full">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      )}
      <Input
        id={id}
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && suggestions.length > 0}
        aria-controls={listId}
        autoComplete="off"
        className={inputClassName || `h-[50px] rounded-xl bg-gray-50 dark:bg-ink-950 text-gray-900 dark:text-gray-100 dark:placeholder-gray-500 border-gray-200 dark:border-ink-700 text-base focus-visible:ring-indigo-500/50 ${Icon ? "pl-11" : "px-5"}`}
      />

      {isOpen && suggestions.length > 0 && (
        <ul id={listId} role="listbox" className="absolute z-50 w-full mt-1 bg-white dark:bg-ink-900 border border-gray-100 dark:border-ink-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <li
              key={item}
              role="option"
              aria-selected={index === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelectOption(item)}
              className={`px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 cursor-pointer transition-colors ${index === active ? "bg-indigo-50 dark:bg-indigo-500/10" : ""}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
