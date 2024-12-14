"use client";

import React, { useState } from "react";

// New separate component for displaying the hovered word
interface DisplayHoveredWordProps {
  hoveredWord: string | null;
}

const DisplayHoveredWord: React.FC<DisplayHoveredWordProps> = ({
  hoveredWord,
}) => {
  const [lastHoveredWord, setLastHoveredWord] = useState<string | null>(null);

  // Update the last hovered word only when a valid word is passed
  React.useEffect(() => {
    if (hoveredWord) {
      setLastHoveredWord(hoveredWord);
    }
  }, [hoveredWord]);

  const handleButtonClick = () => {
    if (lastHoveredWord) {
      const language = "Japanese"; // You can make this dynamic if needed
      const url = `/word-relations?language=${encodeURIComponent(
        language
      )}&word=${encodeURIComponent(lastHoveredWord)}`;
      window.open(url, "_blank");
    } else {
      alert("No word is available to send as a parameter!");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
      <div className="text-gray-700 text-lg">Hovered Word:</div>
      <div className="text-2xl font-bold text-blue-600 mt-2">
        {hoveredWord || lastHoveredWord || "Hover over a word..."}
      </div>
      <button
        onClick={handleButtonClick}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Open Word Relations
      </button>
    </div>
  );
};

export default DisplayHoveredWord;





// --- //



// "use client";

// import React, { useState, useEffect } from "react";

// // New separate component for displaying the hovered word
// interface DisplayHoveredWordProps {
//     hoveredWord: string | null;
//   }
  
//   const DisplayHoveredWord: React.FC<DisplayHoveredWordProps> = ({
//     hoveredWord,
//   }) => {
//     return (
//       <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
//         <div>Hovered Word: {hoveredWord || "Hover over a word..."}</div>
//       </div>
//     );
//   };

// export default DisplayHoveredWord;