"use client";

import React, { useState, useEffect } from "react";
import Link from 'next/link';
import Head from "next/head";
import axios from "axios";

interface CreateReadingFlashcardProps {
  word: string | null;
  wordDictForm: string | null;
  sentence: { original: string }[] | null;
  userId: string;
  url0: string;
  url1: string;
  url2: string;
  url3: string;
  url4: string;
}

// TODO: I think we should use audio for dictionary version of the word


const CreateReadingFlashcard: React.FC<CreateReadingFlashcardProps> = ({
  word,
  wordDictForm,
  sentence,
  userId,
  url0,
  url1,
  url2,
  url3,
  url4,
}) => {
  // sends text mining flashcards data to backend
  // we do not worry now about dict form, translation and romaji
  // and romaji for sentences now, this will be handled by custom functions
  // calling appropriate endpoints, we just want main bare functionality now


  // Add new state for notes at the top where states are defined
  const [notes, setNotes] = useState<string>("");

  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [manualTranslation, setManualTranslation] = useState<string>("");
  const [romaji, setRomaji] = useState<string>("xxx");
  const [difficulty, setDifficulty] = useState<string>("unknown");
  const [sTag, setSTag] = useState<string>("verbs-1");
  //const [userId, setUserId] = useState<string>("testUser");

  const [vocabularyData, setVocabularyData] = useState({
    original: "",
    hiragana: "",
    englishTranslations: [],
  });

  // url0 deeplUrl
  // url1 simpleVocabUrl
  // url2 convertHiraganaUrl
  // url3 storeVocabUrl
  // url3 gptTranslateUrl

  const fetchVocabularyData = async () => {

    if (word === null) {
      console.error("No word provided for fetchVocabularyData.");
      return; // Exit the function if there is no word to fetch data for
    }

    try {
      //const wordEncoded = encodeURIComponent(word); // Ensure the word is properly URL encoded
      const wordEncoded = encodeURIComponent(wordDictForm ?? ""); // Ensure the word is properly URL encoded
      const response = await fetch(
        `${url1}/${wordEncoded}`
      );
      const data = await response.json();
      if (response.ok) {
        setVocabularyData({
          original: data.original,
          hiragana: data.hiragana,
          englishTranslations: data.englishTranslations,
        });
      } else {
        console.error("Failed to fetch vocabulary data:", data.error);
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

  useEffect(() => {
    // Clear translated text when new sentence props are received
    setTranslatedText(null);
    fetchRomaji(getTextFromSentence(sentence));
  }, [sentence]);



  const getTextFromSentence = (sentence: { original: string }[] | null) => {
    if (!sentence) return "";
    return sentence.map((word) => word.original).join("");
  };

  const handleTranslate = async () => {
    const japaneseText = getTextFromSentence(sentence);
    try {
      const response = await fetch(url0, {
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

  const handleTranslateGPT = async () => {
    // Extract Japanese text from the sentence
    const japaneseText = getTextFromSentence(sentence);
    try {
      // Make a POST request to your translation API
      const response = await fetch(url4, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: japaneseText }), // Adjusted body format
      });

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        // Extract the translated text from the API response
        const translatedText = data.choices[0].message.content;
        setTranslatedText(translatedText);
      } else {
        console.error("Failed to translate:", data.error);
      }
    } catch (error) {
      console.error("Error translating:", error);
    }
  };




  const handleManualTranslationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setManualTranslation(e.target.value);
  };


  const fetchRomaji = async (text: string) => {
    // there is romaji field in the cards hardcoded (key name)
    // so we need to use that key for any transliteration
    try {
      const response = await fetch(url2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (response.ok) {
        setRomaji(data.hiragana);
      } else {
        console.error("Failed to fetch romaji/hiragana:", data.error);
      }
    } catch (error) {
      console.error("Error fetching romaji:", error);
    }
  };

  const handleSubmitToBackend = async () => {
    const japaneseText = getTextFromSentence(sentence);

    // Use manualTranslation if it's not empty or just whitespaces, otherwise use translatedText
    //const sentenceEnglish = manualTranslation.trim() !== "" ? manualTranslation : translatedText;
    // Use manualTranslation if it’s not empty; otherwise use translatedText or fall back to ""
    const sentenceEnglish = manualTranslation.trim() !== "" ? manualTranslation : (translatedText || "");

    // Construct the sentences structure
    const sentencesArray = sentence
      ? [
        {
          key: word + "_",
          sentence_audio: "",
          sentence_english: sentenceEnglish, // Use the determined value here
          sentence_original: japaneseText,
          sentence_picture: "",
          sentence_romaji: romaji,
          sentence_simplified: manualTranslation,
        },
      ]
      : [];


    const payload = {
      difficulty,
      p_tag: "sentence_mining",
      s_tag: sTag,
      lang: 'jp',
      sentences: sentencesArray,
      userId,
      vocabulary_audio: `/audio/jitendex_audio/v_${word}.mp3`,
      vocabulary_english: vocabularyData.englishTranslations.join(", "),
      vocabulary_original: vocabularyData.original,
      vocabulary_simplified: vocabularyData.hiragana,
      word_type: "",
      notes,
    };


    try {
      const response = await fetch(
        url3,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Data submitted successfully");
      } else {
        console.error("Failed to submit:", data.error);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };


  return (
    <div className="bg-white p-4 shadow-md rounded-md text-black w-full max-w-lg mx-auto">
      <h1 className="text-base font-semibold text-gray-900 mb-2">Sentence Mining - Flashcard Creation</h1>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs text-gray-900 font-medium">Clicked Word:</div>
          <div className="text-sm text-gray-700">{word || "None"}</div>

          <div className="text-xs text-gray-900 font-medium">Clicked WordDictForm:</div>
          <div className="text-sm text-gray-700">{wordDictForm || "None"}</div>

          <div className="text-xs text-gray-900 font-medium">Word Sentence:</div>
          <div className="text-sm text-gray-700 col-span-1">
            {sentence && sentence.length > 0
              ? sentence.map((word, index) => (
                <span key={index}>{word.original + " "}</span>
              ))
              : "Click a word to see its sentence."}
          </div>

          {translatedText && (
            <>
              <div className="text-sm text-gray-900 font-medium">Translated Text</div>
              <div className="text-sm text-gray-700 col-span-1">
                {translatedText}
                <button
                  onClick={() => setManualTranslation(translatedText)}
                  className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
                >
                  Use
                </button>
              </div>
            </>
          )}

          <div className="col-span-2">
            <label
              htmlFor="manualTranslation"
              className="block text-xs font-medium text-gray-700"
            >
              Manual Translation (optional):
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

          {/* // Add the Notes input field in the return JSX, under the "Manual Translation" input */}
          <div className="col-span-2">
            <label
              htmlFor="notes"
              className="block text-xs font-medium text-gray-700"
            >
              Notes (optional):
            </label>
            <input
              type="text"
              id="notes"
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>





          {romaji && (
            <>
              <div className="text-xs text-gray-900 font-medium">Sentence Romaji/Hiragana:</div>
              <div className="text-sm text-gray-700 col-span-1">{romaji}</div>
            </>
          )}

          {vocabularyData && (
            <>
              <div className="text-xs text-gray-900 font-medium">Vocabulary Japanese:</div>
              <div className="text-sm text-gray-700 col-span-1">{vocabularyData.original}</div>

              <div className="text-xs text-gray-900 font-medium">Vocabulary Simplified:</div>
              <div className="text-sm text-gray-700 col-span-1">{vocabularyData.hiragana}</div>

              <div className="text-xs text-gray-900 font-medium">Vocabulary English:</div>
              <div className="text-sm text-gray-700 col-span-1">{vocabularyData.englishTranslations.join(", ")}</div>
            </>
          )}
        </div>

        <div className="flex space-x-2 mt-2">
          <button
            onClick={handleTranslate}
            className="bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            DEEPL Translate Sentence
          </button>

          <button
            onClick={handleTranslateGPT}
            className="bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Chat GPT Translate Sentence
          </button>

          <button
            onClick={handleSubmitToBackend}
            className="bg-slate-500 text-white text-xs px-4 py-2 rounded-md hover:bg-slate-600 focus:outline-none focus:ring focus:ring-blue-500"
          >
            Send to Flashcard
          </button>
        </div>



        <div className="flex space-x-2 mt-2">
          <Link href="/my-vocabulary" className="text-blue-500 text-xs underline hover:text-blue-600">
            My Vocabulary
          </Link>

          <Link href="/japanese/flashcards-words" className="text-blue-500 text-xs underline hover:text-blue-600">
            Japanese Flashcards Words
          </Link>
        </div>



      </div>
    </div>
  );
};



export default CreateReadingFlashcard;
