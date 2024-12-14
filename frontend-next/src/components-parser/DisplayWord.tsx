"use client";

import React, { useState, useEffect } from "react";



interface DisplayWordProps {
    word: string | null;
    sentence: { original: string }[] | null;
    url: string;
  }
  const DisplayWord: React.FC<DisplayWordProps> = ({ word, sentence, url }) => {
    const [translatedText, setTranslatedText] = useState<string | null>(null);
    const [manualTranslation, setManualTranslation] = useState<string>("");
  
    const getTextFromSentence = (sentence: { original: string }[] | null) => {
      if (!sentence) return "";
      return sentence.map((word) => word.original).join("");
    };
  
    const handleTranslate = async () => {
      const japaneseText = getTextFromSentence(sentence);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ japaneseText }),
        });
        const data = await response.json();
        if (response.ok) {
          setTranslatedText(data.translatedText);
        } else {
          console.error("Failed to translate:", data.error);
        }
      } catch (error) {
        console.error("Error translating:", error);
      }
    };
  
    useEffect(() => {
      // Clear translated text when new sentence props are received
      setTranslatedText(null);
    }, [sentence]);
  
    const handleManualTranslationChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      setManualTranslation(e.target.value);
    };
  
    return (
      <div className="bg-white p-4 shadow-lg rounded-md text-black mb-4 w-full">
        <div>Clicked Word: {word || "None"}</div>
        <div>
          Word Sentence:
          {sentence && sentence.length > 0
            ? sentence.map((word, index) => (
              <span key={index}>{word.original + " "}</span>
            ))
            : "Click a word to see its sentence."}
        </div>
  
        {translatedText && (
          <div className="mt-2">
            Translated Text: {translatedText}
            <br />
            <button
              onClick={() => setManualTranslation(translatedText)}
              className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
            >
              Use Translated Text
            </button>
          </div>
        )}
  
        <div className="mt-2">
          <label
            htmlFor="manualTranslation"
            className="block text-sm font-medium text-gray-700"
          >
            Manual Translation:
          </label>
          <input
            type="text"
            id="manualTranslation"
            name="manualTranslation"
            value={manualTranslation}
            onChange={handleManualTranslationChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
  
        <p className="text-xs">
          add kuromoji analysis, word translation from dict, add title as p_tag
          and button to send to flashcard,
        </p>
  
        {word && (
          <button
            onClick={handleTranslate}
            className="mt-2 bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            DEEPL Translate
          </button>
        )}
      </div>
    );
  };


  export default DisplayWord;