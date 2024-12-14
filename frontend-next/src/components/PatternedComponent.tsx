import React from "react";

const PatternedComponent = () => {
  const backgroundColor = "#ffffff";
  const svgPattern = `url("data:image/svg+xml,%3Csvg width='44' height='12' viewBox='0 0 44 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 12v-2L0 0v10l4 2h16zm18 0l4-2V0L22 10v2h16zM20 0v8L4 0h16zm18 0L22 8V0h16z' fill='%239C92AC' fill-opacity='0.09' fill-rule='evenodd'/%3E%3C/svg%3E")`;

  return (
    <div
      className="w-full h-64 flex items-center justify-center text-xl text-black dark:text-black"
      style={{ backgroundColor: backgroundColor, backgroundImage: svgPattern }}
    >
      Your Content Here
    </div>
  );
};

export default PatternedComponent;

