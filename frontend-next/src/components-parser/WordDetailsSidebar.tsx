"use client";

import React, { useState, useEffect, useRef } from 'react';

interface WordDetails {
  original: string;
  dictionary: string;
  furigana: string;
  status: string;
}

interface WordDetailsSidebarProps {
  clickedWordDetails: WordDetails | null;
  userId: string;
  url0: string;
  url1: string;
  setRevisionCount: any | null;
}

const WordDetailsSidebar: React.FC<WordDetailsSidebarProps> = ({
  clickedWordDetails,
  userId,
  url0,
  url1,
  setRevisionCount,
}) => {
  // url0 - python user specific backend
  // url1 simpleVocabUrl

  const word = clickedWordDetails?.dictionary;

  const [vocabularyData, setVocabularyData] = useState({
    original: "",
    hiragana: "",
    englishTranslations: [],
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioUrl = word ? `/d-api/v1/audio/v_${encodeURIComponent(word)}.mp3` : '';  
  //const audioUrl = word ? `/audio/jitendex_audio/v_${encodeURIComponent(word)}.mp3` : '';
  //const audioUrl: string = `/audio/jitendex_audio/v_自衛権.mp3`; // hardcoded placeholder


  const togglePlay = async (): Promise<void> => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error(`Failed to play audio file: ${audioUrl}`, error);
      }
    }
  };


  const fetchVocabularyData = async () => {
    if (word === null) {
      console.error("No word provided for fetchVocabularyData.");
      return; // Exit the function if there is no word to fetch data for
    }

    try {
      // Ensure the word is properly URL encoded
      const wordEncoded = encodeURIComponent(word ?? "");
      const response = await fetch(`${url1}/${wordEncoded}`);
      const data = await response.json();
      if (response.ok) {
        setVocabularyData({
          original: data.original,
          hiragana: data.hiragana,
          englishTranslations: data.englishTranslations,
        });
      } else {
        console.error("Failed to fetch vocabulary data:", data.error);
        setVocabularyData({
          original: 'NaN',
          hiragana: 'NaN',
          englishTranslations: [],
        });
      }
    } catch (error) {
      console.error("Error fetching vocabulary data:", error);
    }
  };

  useEffect(() => {
    if (word) {
      fetchVocabularyData();
    }
  }, [word]); // Fetch vocabulary data whenever the 'word' changes


  const handleUpdateStatus = async (status: string) => {
    if (!clickedWordDetails) return;

    const payload = {
      userId: userId,
      original: clickedWordDetails.original,
      dictionary: clickedWordDetails.dictionary,
      furigana: clickedWordDetails.furigana,
      status: status,
    };

    try {
      const response = await fetch(url0, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log(`Word status updated to "${status}" successfully.`);
        // Optionally, you can perform any additional actions upon successful update

        // increase counter in parent so we trigger another text coloring mecab refresh
        setRevisionCount((prevCount) => prevCount + 1);


      } else {
        console.error("Failed to update word status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating word status:", error);
    }
  };

  return (
    <div className="bg-white p-6 shadow-md rounded-lg text-gray-800 mb-4">
      <h2 className="text-2xl font-bold mb-4">Word Details</h2>
      {clickedWordDetails ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-3xl font-bold text-blue-700">
              {clickedWordDetails.dictionary}
            </h3>
            <button
              onClick={togglePlay}
              className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full px-4 py-1 shadow-md transition ease-in-out duration-150 text-sm"
            >
              {isPlaying ? "Pause Audio" : "Play Audio"}
            </button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              onError={() => console.error(`Failed to load audio file: ${audioUrl}`)}
            />
          </div>

          {/* <div className="text-2xl mt-2 font-semibold text-slate-500">
            <span className="font-medium">English:</span>{" "}
            {vocabularyData.englishTranslations.join(", ")}
          </div> */}

          <div className="text-2xl mt-2 font-semibold text-slate-500">
            <span className="text-base font-semibold text-slate-500">English:</span>{" "}
            <span className="text-lg text-gray-700">{vocabularyData.englishTranslations.join(", ")}</span>
          </div>


          <hr className="my-6 border-gray-300" />




          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">JapanDict.com:</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <p className="mb-1">
                <span className="font-medium">Original:</span>{" "}
                <a
                  href={`https://www.japandict.com/?s=${encodeURIComponent(clickedWordDetails.original)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {clickedWordDetails.original}
                </a>
              </p>
              <p className="mb-1">
                <span className="font-medium">Dictionary:</span>{" "}
                <a
                  href={`https://www.japandict.com/?s=${encodeURIComponent(clickedWordDetails.dictionary)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                >
                  {clickedWordDetails.dictionary}
                </a>
              </p>
            </div>
          </div>




          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Mecab Data:</h4>
            <div className="grid grid-cols-2 gap-x-4">
              <p className="mb-1">
                <span className="font-medium">Original:</span>{" "}
                {clickedWordDetails.original}
              </p>
              <p className="mb-1">
                <span className="font-medium">Dictionary:</span>{" "}
                {clickedWordDetails.dictionary}
              </p>
              <p className="mb-1">
                <span className="font-medium">Furigana:</span>{" "}
                {clickedWordDetails.furigana}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span>{" "}
                {clickedWordDetails.status}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">JMDICT Data:</h4>
            {vocabularyData && (
              <>
                <div className="mt-2">
                  <span className="font-medium">Japanese:</span>{" "}
                  {vocabularyData.original}
                </div>
                <div className="mt-2">
                  <span className="font-medium">Simplified:</span>{" "}
                  {vocabularyData.hiragana}
                </div>
                <div className="mt-2">
                  <span className="font-medium">English:</span>{" "}
                  {vocabularyData.englishTranslations.join(", ")}
                </div>
              </>
            )}
          </div>

          <p className="text-xs text-gray-600 my-3">
            We should add a hook to get translations from JMDICT, so we have
            quick info about the clicked word.
          </p>

          {/* Buttons to update word status */}
          <div className="flex space-x-2 text-xs">
            <button
              onClick={() => handleUpdateStatus("known")}
              className="bg-slate-300 text-green-800 px-3 py-1 rounded-md hover:bg-slate-400 focus:outline-none focus:ring focus:ring-green-300"
            >
              Mark as Known
            </button>
            <button
              onClick={() => handleUpdateStatus("unknown")}
              className="bg-orange-300 text-orange-800 px-3 py-1 rounded-md hover:bg-orange-400 focus:outline-none focus:ring focus:ring-orange-300"
            >
              Mark as Unknown
            </button>
            <button
              onClick={() => handleUpdateStatus("seen")}
              className="bg-blue-300 text-blue-800 px-3 py-1 rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300"
            >
              Mark as Seen
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No word clicked</p>
      )}
    </div>
  );
};


export default WordDetailsSidebar;