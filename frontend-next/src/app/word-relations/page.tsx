"use client";

import React, { useState, useEffect } from "react";
import VocabularyMap from "@/components-parser/VocabularyMap";

//import { useSearchParams } from "next/navigation";

// example call with GET param word as:
// https://localhost/word-relations?word=食べる
// https://localhost/word-relations?language=Japanese&word=%E9%A3%9F%E3%81%B9%E3%82%8B

// API base URL
const apiBaseUrl = "/d-api/v1";

const HomePage = () => {
  // State for form inputs
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("Japanese"); // Default language
  const [userId, setUserId] = useState("");
  const [wordType, setWordType] = useState("verb conjugation"); // Default word type

  // Loading state
  const [loading, setLoading] = useState(false);

  // State for submitted data and API response
  const [submittedData, setSubmittedData] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); // Holds the API response
  //const [vocabularyMapData, setVocabularyMapData] = useState(null); // Holds the data for VocabularyMap
  const [vocabularyMapData, setVocabularyMapData] = useState(
    defaultVocabularyMapData
  );

  // Example words for each language
  const exampleWords = {
    Japanese: "食べる", // "to eat"
    Korean: "먹다", // "to eat"
    japanese: "食べる", // "to eat"
    korean: "먹다", // "to eat"
  };

  // Map for word types to corresponding API endpoints
  const apiEndpoints = {
    "verb conjugation": `${apiBaseUrl}/verb-conjugation`,
    "word similarity": `${apiBaseUrl}/word-similarity`,
    synonyms: `${apiBaseUrl}/synonyms`,
    antonyms: `${apiBaseUrl}/antonyms`,
    hypernyms: `${apiBaseUrl}/hypernyms`,
    hyponims: `${apiBaseUrl}/hyponyms`,
    collocations: `${apiBaseUrl}/collocations`,
    "part of speech": `${apiBaseUrl}/part-of-speech`,
    idioms: `${apiBaseUrl}/idioms`,
    "pronounciation/kanji similarity": `${apiBaseUrl}/pronounciation-similarity`,
  };

//  const searchParams = useSearchParams();

//   useEffect(() => {
//     // Get the word and language from the URL query parameters
//     const wordParam = searchParams.get("word");
//     const languageParam = searchParams.get("language");

//     // Helper function to normalize language to title case
//     const normalizeLanguage = (lang) => {
//       if (!lang) return null;
//       const lowerLang = lang.toLowerCase();
//       if (lowerLang === "japanese" || lowerLang === "korean") {
//         return lowerLang.charAt(0).toUpperCase() + lowerLang.slice(1);
//       }
//       return null;
//     };

//     // Set the initial word based on the query parameter or the default language
//     if (wordParam) {
//       setWord(decodeURIComponent(wordParam));
//     } else {
//       setWord(exampleWords[language]);
//     }

//     // Normalize and set the language
//     const normalizedLanguage = normalizeLanguage(languageParam);
//     if (normalizedLanguage) {
//       setLanguage(normalizedLanguage);
//     }

//     // Pre-populate the user ID
//     const savedUserId = localStorage.getItem("userId");
//     if (savedUserId) {
//       setUserId(savedUserId);
//     } else {
//       const newUserId = `user-${Math.random().toString(36).substring(2, 15)}`;
//       setUserId(newUserId);
//       localStorage.setItem("userId", newUserId);
//     }

//     // Set default data for the graph
//     setVocabularyMapData(defaultVocabularyMapData);
//  // }, [searchParams, language, exampleWords]);
// }, []);


useEffect(() => {
  // Check if window is defined (it won't be during SSR)
  if (typeof window !== "undefined") {
    // Use the standard browser API to get query parameters
    const params = new URLSearchParams(window.location.search);
    const wordParam = params.get("word");
    const languageParam = params.get("language");

    // Helper function to normalize language to title case
    const normalizeLanguage = (lang) => {
      if (!lang) return null;
      const lowerLang = lang.toLowerCase();
      if (lowerLang === "japanese" || lowerLang === "korean") {
        return lowerLang.charAt(0).toUpperCase() + lowerLang.slice(1);
      }
      return null;
    };

    // Set the initial word based on the query parameter or the default language
    if (wordParam) {
      setWord(decodeURIComponent(wordParam));
    } else {
      setWord(exampleWords[language]);
    }

    // Normalize and set the language
    const normalizedLanguage = normalizeLanguage(languageParam);
    if (normalizedLanguage) {
      setLanguage(normalizedLanguage);
    }

    // Pre-populate the user ID
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      const newUserId = `user-${Math.random().toString(36).substring(2, 15)}`;
      setUserId(newUserId);
      localStorage.setItem("userId", newUserId);
    }

    // Set default data for the graph
    setVocabularyMapData(defaultVocabularyMapData);
  }
}, []);
























  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (word.length > 50) {
      alert("Word cannot exceed 50 characters.");
      return;
    }

    setLoading(true);

    // Reset vocabularyMapData before fetching new data
    //setVocabularyMapData(null);

    try {
      // Determine the API endpoint based on word type
      const apiUrl = apiEndpoints[wordType];

      // Make a POST request to the backend API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: word }),
        cache: "no-store", // Ensures no caching
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json(); // Parse the API response
      setApiResponse(data); // Store the response for display in WordDetails
      setSubmittedData({ word, language, wordType, apiUrl });

      // Extract the "content" field and parse it into usable data
      const rawContent = data?.choices[0]?.message?.content;
      if (rawContent) {
        const parsedData = JSON.parse(rawContent);
        setVocabularyMapData(parsedData); // Store the parsed content for the vocabulary map
      }
    } catch (error) {
      console.error("Error during API call:", error.message);
      setApiResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Japanese/Korean Word Relationships
      </h1>
      <p className="p-1">
        Shows relationships between words - conjugation, similarity, synonyms,
        antonyms, and so on. Works for Japanese and Korean. Great for visual
        learners.
      </p>
      <p className="text-sm p-1">
        Disclaimer: Content generated by LLM in real time, might make mistakes.
        New feature, your feedback is appreciated.
      </p>
      <p className="text-sm p-1">
        We are using cheap LLM model (4o-mini) in order to provide graph
        functionality for free. Performance is decent. But advanced models (4o,
        o1, o1-mini) are able to provide surprisingly detailed in depth word
        relationship graphs. Let us know if this feature is useful to you. We
        can then implement more advanced models, we can even pre-generate graph
        content and give it to native speakers for corrections. This way these
        graphs could serve as legitimate study sources.
      </p>

      <div className="flex flex-col md:flex-row justify-center space-x-4 max-w-8xl mx-auto mt-8">
        {/* Form for Custom Word Submission */}
        <div className="flex-1 max-w-8xl bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-lg font-semibold mb-2"
                htmlFor="word"
              >
                Word:
              </label>
              <input
                type="text"
                id="word"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Language:
              </label>
              <div className="flex space-x-4">
                {["Japanese", "Korean"].map((lang) => (
                  <div key={lang} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={lang.toLowerCase()}
                      name="language"
                      value={lang}
                      checked={language === lang}
                      onChange={(e) => setLanguage(e.target.value)}
                    />
                    <label htmlFor={lang.toLowerCase()}>{lang}</label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Word associations:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "verb conjugation",
                  "word similarity",
                  "synonyms",
                  "antonyms",
                  "hypernyms",
                  "hyponyms",
                  "collocations",
                  "part of speech",
                  "idioms",
                  "pronounciation/kanji similarity",
                ].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={type}
                      name="wordType"
                      value={type}
                      checked={wordType === type}
                      onChange={(e) => setWordType(e.target.value)}
                    />
                    <label htmlFor={type} className="text-sm sm:text-base">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {/*  */}

      {/*  */}

      {/* Render Graph only if vocabularyMapData is available */}
      <div style={{ padding: "20px" }}>
        <h1>Dynamic Vocabulary Map</h1>

        {loading ? (
          <p>Loading vocabulary map...</p>
        ) : (
          <VocabularyMap data={vocabularyMapData} />
        )}
      </div>

      {/* Render WordDetails only if submittedData is available */}
      {submittedData && (
        <WordDetails {...submittedData} apiResponse={apiResponse} />
      )}
    </div>
  );
};

export default HomePage;

// ---------------------------------------- //

//"use client";

//import React from "react";
import ReactMarkdown from "react-markdown";

interface WordDetailsProps {
  word: string;
  language: string;
  wordType: string;
  apiUrl: string;
  apiResponse: any;
}

const WordDetails: React.FC<WordDetailsProps> = ({
  word,
  language,
  wordType,
  apiUrl,
  apiResponse,
}) => {
  if (!apiResponse) {
    return null;
  }

  // Extract relevant data from the API response
  const { choices, model, usage } = apiResponse || {};
  const messageContent =
    choices?.[0]?.message?.content || "No content provided.";
  const totalTokens = usage?.total_tokens || 0;
  const promptTokens = usage?.prompt_tokens || 0;
  const completionTokens = usage?.completion_tokens || 0;

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">Word Details</h2>

      {/* Basic Information */}
      <div className="mb-4">
        <p>
          <strong>Word:</strong> {word}
        </p>
        <p>
          <strong>Language:</strong> {language}
        </p>
        <p>
          <strong>Word Type:</strong> {wordType}
        </p>
        <p>
          <strong>API URL:</strong> {apiUrl}
        </p>
      </div>

      {/* API Response */}
      <div className="mt-4 p-4 bg-white border border-gray-300 rounded-md">
        <h3 className="text-lg font-semibold mb-2">API Response Content</h3>
        <div className="prose max-w-none overflow-auto">
          <ReactMarkdown>{messageContent}</ReactMarkdown>
        </div>
      </div>

      {/* Model Information */}
      <div className="mt-4 text-sm text-gray-700">
        <p>
          <strong>Model:</strong> {model || "N/A"}
        </p>
        <p>
          <strong>Token Usage:</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>Total Tokens: {totalTokens}</li>
          <li>Prompt Tokens: {promptTokens}</li>
          <li>Completion Tokens: {completionTokens}</li>
        </ul>
      </div>
    </div>
  );
};

//export default WordDetails;

// --- //

// Default vocabulary map data (basic data to show initially)

const defaultVocabularyMapData = {
  word: "食べる",
  meaning: "to eat",
  readings: ["たべる"],
  usage: "A common verb used to express eating.",
  children: [
    {
      word: "食べます",
      meaning: "to eat (polite form)",
      example: "ご飯を食べます (I eat rice)",
      readings: ["たべます"],
      usage: "Polite non-past form.",
      children: [
        {
          word: "食べません",
          meaning: "do not eat (polite negative form)",
          example: "野菜を食べません (I do not eat vegetables)",
          readings: ["たべません"],
          usage: "Polite present negative form.",
          children: [],
        },
        {
          word: "食べました",
          meaning: "ate (polite past form)",
          example: "ケーキを食べました (I ate cake)",
          readings: ["たべました"],
          usage: "Polite past form.",
          children: [
            {
              word: "食べませんでした",
              meaning: "did not eat (polite past negative form)",
              example: "お寿司を食べませんでした (I did not eat sushi)",
              readings: ["たべませんでした"],
              usage: "Polite past negative form.",
            },
          ],
        },
      ],
    },
    {
      word: "食べること",
      meaning: "the act of eating",
      example: "食べることが好きです (I like eating)",
      readings: ["たべること"],
      usage: "Used to nominalize the verb.",
      children: [],
    },
    {
      word: "食べたい",
      meaning: "want to eat",
      example: "ケーキを食べたい (I want to eat cake)",
      readings: ["たべたい"],
      usage: "Used to express desire to eat.",
      children: [
        {
          word: "食べたくない",
          meaning: "do not want to eat",
          example: "辛いものを食べたくない (I do not want to eat spicy food)",
          readings: ["たべたくない"],
          usage: "Negative form of 食べたい.",
        },
        {
          word: "食べたかった",
          meaning: "wanted to eat",
          example: "寿司を食べたかった (I wanted to eat sushi)",
          readings: ["たべたかった"],
          usage: "Past form of 食べたい.",
          children: [
            {
              word: "食べたくなかった",
              meaning: "did not want to eat",
              example:
                "辛いものを食べたくなかった (I did not want to eat spicy food)",
              readings: ["たべたくなかった"],
              usage: "Negative past form of 食べたい.",
            },
          ],
        },
      ],
    },
    {
      word: "食べられる",
      meaning: "can eat, to be eaten",
      example: "刺身が食べられる (I can eat sashimi)",
      readings: ["たべられる"],
      usage: "Potential and passive form.",
      children: [
        {
          word: "食べられない",
          meaning: "cannot eat",
          example: "刺身が食べられない (I cannot eat sashimi)",
          readings: ["たべられない"],
          usage: "Negative potential form.",
        },
        {
          word: "食べられた",
          meaning: "could eat, was eaten",
          example: "ご飯が全部食べられた (The rice was all eaten)",
          readings: ["たべられた"],
          usage: "Past potential/passive form.",
          children: [
            {
              word: "食べられなかった",
              meaning: "could not eat, was not eaten",
              example: "お寿司が食べられなかった (The sushi was not eaten)",
              readings: ["たべられなかった"],
              usage: "Negative past potential/passive form.",
            },
          ],
        },
      ],
    },
    {
      word: "食べよう",
      meaning: "let's eat, will eat",
      example: "一緒に昼ご飯を食べよう (Let's eat lunch together)",
      readings: ["たべよう"],
      usage: "Volitional form, used to express intention or suggestion.",
      children: [],
    },
    {
      word: "食べさせる",
      meaning: "to make/let someone eat",
      example: "子供に野菜を食べさせる (Make the child eat vegetables)",
      readings: ["たべさせる"],
      usage: "Causative form.",
      children: [
        {
          word: "食べさせられる",
          meaning: "to be made to eat",
          example:
            "子供が野菜を食べさせられる (The child is made to eat vegetables)",
          readings: ["たべさせられる"],
          usage: "Causative passive form.",
        },
      ],
    },
    {
      word: "食べて",
      meaning: "eat (te-form)",
      example: "早く食べてください (Please eat quickly)",
      readings: ["たべて"],
      usage: "Te-form, used for requests, connections, or commands.",
      children: [
        {
          word: "食べている",
          meaning: "eating",
          example: "今、昼ご飯を食べている (I am eating lunch now)",
          readings: ["たべている"],
          usage: "Continuous form.",
          children: [
            {
              word: "食べていない",
              meaning: "not eating",
              example: "昼ご飯を食べていない (I am not eating lunch)",
              readings: ["たべていない"],
              usage: "Negative continuous form.",
            },
          ],
        },
      ],
    },
  ],
};

// Default vocabulary map data (basic data to show initially)
// const defaultVocabularyMapData = {
//   word: "食べる",
//   meaning: "to eat",
//   readings: ["たべる"],
//   usage: "A common verb used to express eating.",
//   children: [
//     {
//       word: "いただく",
//       meaning: "to receive (humble form of to eat)",
//       example: "お料理をいただく (I humbly receive the meal)",
//       readings: ["いただく"],
//       usage: "Used in formal or respectful situations (humble form).",
//       children: [
//         {
//           word: "お食事",
//           meaning: "a meal (respectful)",
//           example: "お食事をいただく (I humbly have a meal)",
//           readings: ["おしょくじ"],
//           usage: "A respectful form of 食事, used in formal settings.",
//         },
//       ],
//     },
//     {
//       word: "食べてみる",
//       meaning: "to try eating",
//       example: "新しい料理を食べてみる (I try eating new dishes)",
//       readings: ["たべてみる"],
//       usage: "Used when trying something for the first time.",
//       children: [
//         {
//           word: "試す",
//           meaning: "to try, to test",
//           example: "新しい料理を試す (Try new dishes)",
//           readings: ["ためす"],
//           usage: "A synonym of 食べてみる, often used in broader contexts.",
//         },
//       ],
//     },
//     {
//       word: "食べ物",
//       meaning: "food",
//       example: "食べ物を買う (Buy food)",
//       readings: ["たべもの"],
//       usage: "A generic term for food.",
//       children: [
//         {
//           word: "食料",
//           meaning: "foodstuffs, provisions",
//           example: "食料を買いに行く (Go to buy provisions)",
//           readings: ["しょくりょう"],
//           usage: "Refers to food in terms of supplies or provisions.",
//         },
//       ],
//     },
//     {
//       word: "食べたくなる",
//       meaning: "to want to eat",
//       example: "お腹が空いて食べたくなる (I get hungry and want to eat)",
//       readings: ["たべたくなる"],
//       usage: "Expression used when describing desire to eat.",
//       children: [
//         {
//           word: "欲しい",
//           meaning: "want, desire",
//           example: "欲しいものを買う (Buy what I want)",
//           readings: ["ほしい"],
//           usage:
//             "A more general term for desire, not necessarily related to food.",
//         },
//       ],
//     },
//     {
//       word: "食べました",
//       meaning: "ate (polite past form)",
//       example: "昼ご飯を食べました (I ate lunch)",
//       readings: ["たべました"],
//       usage: "Polite past form of 食べる.",
//       children: [
//         {
//           word: "食べませんでした",
//           meaning: "did not eat (polite past negative)",
//           example: "昼ご飯を食べませんでした (I did not eat lunch)",
//           readings: ["たべませんでした"],
//           usage: "Polite past negative form of 食べる.",
//         },
//       ],
//     },
//   ],
// };

// --- //

// Here are some additional word relationships you could explore for Japanese and Korean in your tool:

// Word Similarity:
// Identify words that have related meanings or share contextual usage (e.g., "big" and "large" as both indicating size, but also "big" and "important" in specific contexts).

// Synonyms:
// Find words with similar meanings that can often be used interchangeably (e.g., "happy" → "joyful," "content," "cheerful").

// Antonyms:
// Discover words with opposite meanings that contrast with a given word (e.g., "hot" → "cold," "happy" → "sad").

// Hypernyms (Generalization):
// Identify more general terms that encompass a given word (e.g., "dog" → "animal").

// Hyponyms (Specialization):
// Identify more specific terms under a broader category (e.g., "dog" → "golden retriever").

// Collocations:
// Find words that commonly occur together in phrases or expressions (e.g., "make a decision," "strong coffee").

// Part-of-Speech Relationships:
// Show the different forms a word can take in various parts of speech, like verb, noun, adjective, adverb, etc. (e.g., "run" → verb, noun, and adjective forms).

// Phrasal Verbs / Idioms:
// Explore how words fit into common idiomatic expressions or phrasal verbs (e.g., "turn off" in English, "나가다" (to go out) in Korean).

// Pronunciation/Syllable Similarity:
// Explore words that sound similar phonetically or share similar syllable structures (e.g., words with similar vowel-consonant patterns).

//--- //

// Negative Forms:
// Explore how words change in negative contexts or find words with the opposite meaning (e.g., "happy" → "unhappy," "eat" → "don't eat").

// Counter-words (Counters):
// In languages like Japanese, counters are used for counting objects. You could explore the different counters associated with certain types of objects (e.g., "本" for books, "匹" for animals).

// Honorifics and Formality Levels:
// In Korean and Japanese, word relationships could also include various forms of politeness, such as informal, polite, and honorific versions of the same word (e.g., "eat" → "taberu" vs. "meshiagaru" in Japanese).

// Word Family:
// Show related words in the same family, such as derived forms (e.g., "love" → "loved," "loving").

// Explore words related by meaning within a specific topic or field (e.g., words related to weather, emotions, or food).
// Exploring these relationships will help users gain a deeper understanding of the words and how they function within a language, enhancing their learning experience and providing more detailed insights into word usage, structure, and nuances.
