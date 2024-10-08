import React from "react";
import MenuItem from "./icons/MenuItem";

const courses = [
  { name: "Family Medicine", icon: <MenuItem/> },
  { name: "Geriatrics", icon: <MenuItem/> },
  { name: "Internal Medicine", icon: <MenuItem/> },
  { name: "Pediatrics", icon: <MenuItem/> },
  { name: "Radiology", icon: <MenuItem/> },
];

interface FirstTabProps {
    onSelectCourse: (course: string) => void;
  }
  
  const FirstTab = ({ onSelectCourse }: FirstTabProps) => {
    return (
      <div className="mt-4 ml-4">
        <ul className="list-none">
          {courses.map((course) => (
            <li
              key={course.name}
              className="flex items-center mb-2 cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectCourse(course.name)}
            >
              <MenuItem/>
              <span className="text-lg">{course.name}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FirstTab;