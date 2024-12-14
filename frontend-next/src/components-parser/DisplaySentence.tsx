"use client";

import React, { useState, useEffect } from "react";

interface DisplaySentenceProps {
  sentence: { original: string; furigana: string }[] | null;
}

const DisplaySentence: React.FC<DisplaySentenceProps> = ({ sentence }) => {
  const [lastSentence, setLastSentence] = useState<
    { original: string; furigana: string }[] | null
  >(null);

  // Update the last sentence only when a valid sentence is passed
  useEffect(() => {
    if (sentence && sentence.length > 0) {
      setLastSentence(sentence);
    }
  }, [sentence]);

  // Handle sending the sentence to the specified URL
  const handleSendSentence = () => {
    if (lastSentence && lastSentence.length > 0) {
      const language = "japanese"; // Language parameter
      const sentenceString = lastSentence.map((word) => word.original).join("");
      const url = `/grammar-graph?sentence=${encodeURIComponent(
        sentenceString
      )}&language=${encodeURIComponent(language)}`;
      window.open(url, "_blank");
    } else {
      alert("No sentence is available to send.");
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
      <div className="text-gray-700 text-lg">Sentence:</div>
      <div className="text-xl font-medium text-blue-600 mt-2">
        {lastSentence && lastSentence.length > 0
          ? lastSentence.map((word, index) => (
              <span key={index} className="mr-2">
                <ruby>
                  {word.original}
                  <rt>{word.furigana}</rt>
                </ruby>
              </span>
            ))
          : "Hover over a sentence to see it here."}
      </div>

      <button
        onClick={handleSendSentence}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Open Grammar Graph
      </button>
    </div>
  );
};

export default DisplaySentence;










// --- //

// "use client";

// interface DisplaySentenceProps {
//     sentence: { original: string }[] | null;
//   }
  
//   const DisplaySentence: React.FC<DisplaySentenceProps> = ({ sentence }) => {

//     console.log(sentence);

// // Array(4) [ {…}, {…}, {…}, {…} ]
// // 0: Object { dictionary: "酔う", furigana: "よい", original: "酔い", … }
// // 1: Object { dictionary: "も", original: "も", status: "known", … }
// // 2: Object { dictionary: "する", original: "せ", status: "known", … }
// // 3: Object { dictionary: "ぬ", original: "ず", status: "known", … }


//     return (
//       <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
//         <div>
//           Sentence:{" "}
//           {sentence && sentence.length > 0
//             ? sentence.map((word, index) => (
//               <span key={index}>{word.original + " "}</span>
//             ))
//             : "Hover over a sentence to see it here."}
//         </div>
  
//         <p>add automatic sentence translation to furigana as well</p>
//       </div>
//     );
//   };

//   export default DisplaySentence;