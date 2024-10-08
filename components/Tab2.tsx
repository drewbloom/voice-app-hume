import React from "react";
import { casesByCourse } from "../utils/casesByCourse";

interface SecondTabProps {
  selectedCourse: string;
  onSelectCase: (caseItem: string) => void;
}

const SecondTab = ({ selectedCourse, onSelectCase }: SecondTabProps) => {
  const cases = casesByCourse[selectedCourse] || [];

  return (
    <div className="mt-4 ml-4">
      <ul className="list-none">
        {cases.map((caseItem, index) => (
          <li
            key={index}
            className="mb-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectCase(caseItem)}
          >
            <span className="text-lg">{caseItem}</span>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 button-back text-white py-2 px-4"
        onClick={() => onSelectCase("Back")}
      >
        Back
      </button>
    </div>
  );
};

export default SecondTab;