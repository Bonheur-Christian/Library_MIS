"use client";

import { JSX, useState } from "react";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

interface LibraryItem {
  icon: JSX.Element;
  link: string;
}

interface AccordionProps {
  items: LibraryItem[];
  title: string;
  initiallyOpen?: boolean; // New prop to control initial state
}

const LibraryAccordion = ({
  items,
  title,
  initiallyOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen); // Use initiallyOpen to set default state

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-white font-semibold"
      >
        <span>{title}</span>
        <span>
          {isOpen ? (
            <TiArrowSortedUp size={30} />
          ) : (
            <TiArrowSortedDown size={30} />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white p-4 outline-none">
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li
                key={index}
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-200  px-3 py-2 hover:border-l-4 border-indigo-900 cursor-pointer"
              >
                {item.icon}
                <span>{item.link}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LibraryAccordion;
