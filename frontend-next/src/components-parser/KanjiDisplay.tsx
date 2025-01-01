"use client";

// components/KanjiDisplay.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";

interface KanjiDetail {
  literal?: string;
  readings?: { type: string; value: string }[];
  meanings?: string[];
  stroke_count?: number;
  grade?: number;
  jlpt_level?: number;
  frequency?: number;
}

interface KanjiDisplayProps {
  word: string;
  url0: string;
  url1: string;
}

const KanjiDisplay: React.FC<KanjiDisplayProps> = ({ word, url0, url1 }) => {
  const [kanjiDetails, setKanjiDetails] = useState<KanjiDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchKanji = async (): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        const encodedWord = encodeURIComponent(word);
        const response = await axios.get(
          `${url0}?word=${encodedWord}`
        );
        const kanjiArray: string[] = response.data.kanji;
        const detailsPromises = kanjiArray.map((kanji) =>
          fetchKanjiDetails(kanji)
        );
        const details = await Promise.all(detailsPromises);
        setKanjiDetails(details.filter((detail) => detail !== null));
      } catch (err) {
        console.error("Failed to fetch kanji:", err);
        setError("Failed to fetch kanji. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKanji();
  }, [word]);

  const fetchKanjiDetails = async (
    kanji: string
  ): Promise<KanjiDetail | null> => {
    const encodedKanji = encodeURIComponent(kanji);
    try {
      const response = await axios.get(
        `${url1}/${encodedKanji}`
      );
      return response.data;
    } catch (err) {
      console.error("Failed to fetch details for kanji:", kanji, err);
      setError(
        `Failed to fetch details for kanji: ${kanji}. Please try again.`
      );
      return null;
    }
  };

//   return (
//     <div className="mt-8 space-y-6">
//       <h2 className="text-xl font-semibold">Kanji Details:</h2>
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500 text-center">{error}</p>
//       ) : (
//         kanjiDetails.map((kanji, index) => (
//           <div
//             key={index}
//             className="border bg-gray-200 text-gray-700 p-6 rounded-lg shadow-lg space-y-2"
//           >
//             <h3 className="text-4xl font-bold">{kanji.literal}</h3>
//             <p>
//               <strong>Readings:</strong>{" "}
//               {kanji.readings
//                 ?.map((reading) => `${reading.type}: ${reading.value}`)
//                 .join(", ")}
//             </p>
//             <p>
//               <strong>Meanings:</strong> {kanji.meanings?.join(", ")}
//             </p>
//             <p>
//               <strong>Stroke Count:</strong> {kanji.stroke_count}
//             </p>
//             <p>
//               <strong>Grade:</strong> {kanji.grade}
//             </p>
//             <p>
//               <strong>JLPT Level:</strong> {kanji.jlpt_level}
//             </p>
//             <p>
//               <strong>Frequency:</strong> {kanji.frequency}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };


return (
  <div className="mt-2 max-h-[80vh] overflow-y-auto">
    <h2 className="text-xl font-semibold mb-2">Kanji Details:</h2>
    <div className="mb-12">
    {isLoading ? (
      <p>Loading...</p>
    ) : error ? (
      <p className="text-red-500 text-center">{error}</p>
    ) : (
      kanjiDetails.map((kanji, index) => (
        <div
          key={index}
          className="border bg-gray-200 text-gray-700 p-6 rounded-lg shadow-lg space-y-2 mb-2"
        >
          <h3 className="text-4xl font-bold">{kanji.literal}</h3>
          <p>
            <strong>Readings:</strong>{" "}
            {kanji.readings
              ?.map((reading) => `${reading.type}: ${reading.value}`)
              .join(", ")}
          </p>
          <p>
            <strong>Meanings:</strong> {kanji.meanings?.join(", ")}
          </p>
          <p>
            <strong>Stroke Count:</strong> {kanji.stroke_count}
          </p>
          <p>
            <strong>Grade:</strong> {kanji.grade}
          </p>
          <p>
            <strong>JLPT Level:</strong> {kanji.jlpt_level}
          </p>
          <p>
            <strong>Frequency:</strong> {kanji.frequency}
          </p>
        </div>

      ))
    )}
          </div>
  </div>
);
};


export default KanjiDisplay;
