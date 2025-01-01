"use client";

import React, { useState, useEffect, useRef } from "react";

interface Word {
  original: string;
  dictionary: string;
  furigana: string;
  status: string;
}

interface WordDetails {
  original: string;
  dictionary: string;
  furigana: string;
  status: string;
}

interface JapaneseTextParserProps {
  inputText: String | null;
  inputMode: String;
  revisionCount: Number;
  userId: String;
  setClickedWord: React.Dispatch<React.SetStateAction<string | null>>;
  setClickedWordDictForm: React.Dispatch<React.SetStateAction<string | null>>;
  setHoveredWord: React.Dispatch<React.SetStateAction<string | null>>;
  setHoveredSentence: React.Dispatch<React.SetStateAction<Word[] | null>>;
  setClickedWordSentence: React.Dispatch<React.SetStateAction<Word[] | null>>;
  setClickedWordDetails: React.Dispatch<React.SetStateAction<WordDetails | null>>;
}

const JapaneseTextParser: React.FC<JapaneseTextParserProps> = ({
  inputText,
  inputMode,
  revisionCount,
  userId,
  setClickedWord,
  setClickedWordDictForm,
  setHoveredWord,
  setHoveredSentence,
  setClickedWordSentence,
  setClickedWordDetails,
}) => {

  const [parsedData, setParsedData] = useState<string | null>(null); // State to store parsed data
  const [enhancedData, setEnhancedData] = useState<any | null>(null); // State to store enhanced data

  const mecabApiUrl = "/d-api/v1/parse-split";
  const userVocabApiUrl = "/f-api/v1/enhance-vocabulary";
  //const [userId] = useState("testuserId"); // Define userId


console.log('userId:')
console.log(userId)

  // --- text enhancement --- //

  useEffect(() => {
    const fetchData = async () => {
      //if (!inputText) return;
      if (!inputText || !userId.trim()) return; // Guard clause for inputText and userId

      try {
        const response = await fetch(mecabApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText, mode: inputMode }),
        });

        const data = await response.json();
        setParsedData(data);
        enhanceData(data);
      } catch (error) {
        console.error("Error fetching parsed data:", error);
      }
    };

    fetchData();
  }, [inputText, inputMode, revisionCount, userId]);

  const enhanceData = async (parsedData: any) => {
    const response = await fetch(userVocabApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, data: parsedData }), // Include userId and parsed data
    });
    const enhancedData = await response.json();
    setEnhancedData(enhancedData);
  };

  // Function to handle clicking on a word
  const handleClickWord = (word: any) => {
    // Search for the clicked word in parsedData or enhancedData
    let clickedWordData = null;
    // let clickedWordData = {
    //   original: "彼女",
    //   dictionary: "彼女",
    //   furigana: "かのじょ",
    //   status: "xxx",
    // }; //placeholder              TODO: looks like making lots of issues

    if (Array.isArray(parsedData)) {
      const sentence = parsedData.find((sentence) =>
        sentence.find((w: any) => w.original === word)
      );
      if (sentence) {
        clickedWordData = sentence.find((w: any) => w.original === word);
      }
    }

    if (Array.isArray(enhancedData)) {
      const sentence = enhancedData.find((sentence) =>
        sentence.find((w: any) => w.original === word)
      );
      if (sentence) {
        clickedWordData = sentence.find((w: any) => w.original === word);
      }
    }

    // Set the clicked word details
    setClickedWordDetails(clickedWordData);
    console.log("clickedWordData:");
    console.log(clickedWordData);
  };

  // --- end of text enhancement --- //


  return (
    <div className="h-full bg-gray-50 font-serif text-2xl p-6 rounded-lg shadow-lg w-full mb-6">
      {enhancedData ? (
        enhancedData.map((words: any, sentenceIndex: any) => (
          <div
            key={sentenceIndex}
            className="bg-gray-100 p-1 rounded-lg mb-3 flex flex-wrap"
            onMouseEnter={() => setHoveredSentence(words)}
            onMouseLeave={() => setHoveredSentence(null)}
          >
            {words.map((word: any, wordIndex: any) => (
              <span
                key={wordIndex}
                className="relative group mx-1 my-3"
                onClick={() => {
                  setClickedWord(word.original);
                  setClickedWordDictForm(word.dictionary);
                  setClickedWordSentence(words);
                  handleClickWord(word.original);
                }}
                onMouseEnter={() => setHoveredWord(word.original)}
                onMouseLeave={() => setHoveredWord(null)}
              >
                <span
                  className={`absolute -top-6 left-0 right-0 mx-auto w-auto text-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-black z-10`}
                >
                  {word.furigana}
                </span>

                <span
                  className={`inline-flex items-center justify-center py-1 px-1 rounded transition-transform duration-300 cursor-pointer ${/^[a-zA-Z0-9'"=?!,.。、「」『』〜・（）［］〈〉《》―‥…;&:%@$#()\[\]{}\-_/\\]+$/.test(word.original)
                    ? ""
                    : word.status === "known"
                      ? "bg-transparent border border-gray-300 hover:border-gray-500 text-gray-800"
                      : word.status === "unknown"
                        ? "bg-orange-200 hover:bg-orange-300 text-gray-800"
                        : "bg-blue-200 hover:bg-blue-300 text-gray-800"
                    } hover:scale-105`}
                >
                  {word.original}
                </span>

              </span>
            ))}
          </div>
        ))
      ) : (
        <p className="text-red-500">
          No text to analyze. Input text to the text input field above.
        </p>
      )}
    </div>
  );
};

export default JapaneseTextParser;