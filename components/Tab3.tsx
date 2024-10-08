import React from "react";
import { interactionsByCase } from "../utils/interactionsByCase";

interface ThirdTabProps {
  selectedCase: string;
  onSelectInteraction: (interactionItem: string) => void;
}

const ThirdTab = ({ selectedCase, onSelectInteraction }: ThirdTabProps) => {
  const interactions = interactionsByCase[selectedCase] || [];

  return (
    <div className="mt-4 ml-4">
      <ul className="list-none">
        {interactions.map((interactionItem, index) => (
        <li
          key={index}
          className="mb-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectInteraction(interactionItem)}
        >
          <span className="text-lg">{interactionItem}</span>
        </li>
        ))}
      </ul>
      <button
        className="mt-4 button-back text-white py-2 px-4"
        onClick={() => onSelectInteraction("Back")}
      >
        Back
      </button>
    </div>
  );
};

export default ThirdTab;