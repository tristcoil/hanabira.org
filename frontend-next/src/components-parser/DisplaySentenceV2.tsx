"use client";

import React, { useState, useEffect } from "react";


interface DisplaySentencePropsV2 {
    sentence: { original: string }[] | null;
    url: string;
  }
  
  const DisplaySentenceV2: React.FC<DisplaySentencePropsV2> = ({ sentence, url }) => {
    const [furiganaTranslation, setFuriganaTranslation] = useState<string | null>(
      null
    );
  
    useEffect(() => {
      if (sentence && sentence.length > 0) {
        const fetchTranslation = async () => {
          const sentenceText = sentence.map((word) => word.original).join(" ");
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: sentenceText }),
            });
            const data = await response.json();
            setFuriganaTranslation(data.furigana);
          } catch (error) {
            console.error("Error fetching translation:", error);
          }
        };
  
        fetchTranslation();
      }
    }, [sentence]);
  
    return (
      <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
        <div>
          Sentence:{" "}
          {sentence && sentence.length > 0
            ? sentence.map((word, index) => (
              <span key={index}>{word.original + " "}</span>
            ))
            : "Hover over a sentence to see it here."}
        </div>
        <div className="mt-4 text-lg">
          Furigana Transliteration:
          {furiganaTranslation ? (
            <div
              className="mt-2 text-2xl leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: furiganaTranslation }}
            ></div>
          ) : (
            "Loading transliteration..."
          )}
        </div>
      </div>
    );
  };
  
export default DisplaySentenceV2;