"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

//import { useSearchParams } from "next/navigation";

import ParseTree from "@/components-parser/ParseTree";
import GrammarExplanationSimple from "@/components-parser/GrammarExplanationSimple";

const gptGrammarUrl = "/d-api/v1/grammar";

// https://localhost/grammar-graph?sentence=%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF&language=japanese

const HomePage = () => {
  // State to hold the parse tree data
  const [data, setData] = useState(initialData);
  // State for form inputs
  const [sentence, setSentence] = useState("");
  const [language, setLanguage] = useState(""); // Start with empty string
  const [userId, setUserId] = useState("");

  // Loading state
  const [loading, setLoading] = useState(false);

  // Metadata state
  const [metadata, setMetadata] = useState(null);

  // Example sentences for each language
  const exampleSentences = {
    Japanese: "私は雨の日曜日の午後にドゥームメタルを聴くのが好きです。",
    Korean: "저는 비 오는 일요일 오후에 둠 메탈을 듣는 것을 좋아해요.",
    English: "I like listening to doom metal on rainy Sunday afternoons.",
  };


  // Modify the useEffect to use window.location.search
  useEffect(() => {
    // Check if window is defined (it won't be during SSR)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const querySentence = params.get("sentence");
      const queryLanguage = params.get("language");

      // Rest of your code remains the same
      // Set language
      let initialLanguage = "Korean";
      if (queryLanguage) {
        initialLanguage =
          queryLanguage.charAt(0).toUpperCase() +
          queryLanguage.slice(1).toLowerCase();
      }
      setLanguage(initialLanguage);

      // Set sentence
      if (querySentence) {
        setSentence(querySentence);
      } else {
        setSentence(exampleSentences[initialLanguage]);
      }

      // Pre-populate the user ID
    // Pre-populate the user ID, e.g., from local storage or generate a new one
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      setUserId(savedUserId);
    } else {
      const newUserId = `user-${Math.random().toString(36).substring(2, 15)}`;
      setUserId(newUserId);
      localStorage.setItem("userId", newUserId);
    }


    }  
  }, []);


  // Update sentence when language changes, only if it's an example sentence
  useEffect(() => {
    const isExampleSentence =
      Object.values(exampleSentences).includes(sentence);
    if (isExampleSentence) {
      setSentence(exampleSentences[language]);
    }
  }, [language]);

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sentence.length > 100) {
      alert("Sentence cannot exceed 100 characters.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/d-api/v1/parse-tree", {
        sentence,
        language,
        userId,
      });

      // Parse the JSON string returned from the backend
      const parsedTree = JSON.parse(response.data.parseTree);

      // Update the parse tree with the new data from the backend
      setData(parsedTree);

      // Update metadata
      setMetadata({
        model: response.data.model,
        tokensUsed: response.data.tokensUsed,
        callTimestamp: response.data.callTimestamp,
      });
    } catch (error) {
      console.error("Error fetching new parse tree data:", error);
      // Handle error (e.g., show a notification)
    } finally {
      setLoading(false);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Japanese/Korean/English Parse Tree Visualization
      </h1>
      <p className="text-center text-xs text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        The functionality of this tool is inspired by{" "}
        <a
          href="https://mirinae.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline"
        >
          mirinae.io
        </a>
        , which provides advanced sentence analysis and language learning
        insights.
      </p>
      <p className="text-center text-xs text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
        Our tool visualizes a parse tree of each sentence to show the
        grammatical structure, helping learners better understand sentence
        composition.
      </p>

      {/* Disclaimer Section */}
      <div className="max-w-md mx-auto my-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
        >
          <span>Disclaimer</span>
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>

        {isOpen && (
          <div className="mt-2 p-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow transition-all duration-300 ease-in-out">
            <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
              We are using the <strong>GPT4o</strong> model for parse tree creation.
            </p>
            <p className="text-red-600 dark:text-red-400 mb-8 text-center">
              <strong>DISCLAIMER:</strong> This tool uses LLM AI for sentence
              analysis and may make mistakes.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-center space-x-4 max-w-8xl mx-auto mt-8">
        {/* Form for Custom Sentence Submission */}
        <div className="flex-1 max-w-3xl bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-lg font-semibold mb-2"
                htmlFor="sentence"
              >
                Sentence:
              </label>
              <input
                type="text"
                id="sentence"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Language:
              </label>
              <div className="flex space-x-4">
                {["Japanese", "Korean", "English"].map((lang) => (
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

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* Grammar Explanation Component */}
        <div className="flex-1 max-w-2xl">
          <GrammarExplanationSimple sentence={sentence} url={gptGrammarUrl} />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full">
        {/* Loading Indicator */}
        {loading && (
          <p className="text-center text-lg">Processing your request...</p>
        )}



        {/* Metadata Display */}
        {!loading && metadata && (
          <div className="flex justify-center w-full p-3">
            <div className="w-64 p-4 bg-white shadow rounded-tr-lg">
              <h2 className="text-lg font-semibold mb-2">Response Metadata</h2>
              <p>
                <strong>Model:</strong> {metadata.model}
              </p>
              <p>
                <strong>Tokens Used:</strong> {metadata.tokensUsed}
              </p>
              <p>
                <strong>Call Timestamp:</strong> {metadata.callTimestamp}
              </p>
            </div>
          </div>
        )}

        {/* Parse Tree Display */}
        {!loading && (
          <div className="flex justify-center w-full">
            <ParseTree data={data} />
          </div>
        )}



      </div>
    </div>
  );
};

export default HomePage;



// ----------------------- vars ----------------------- //

const initialData = {
  type: "sentence",
  value: "저는 비 오는 일요일 오후에 둠 메탈을 듣는 것을 좋아해요.",
  translation: "I like listening to doom metal on rainy Sunday afternoons.",
  children: [
    {
      type: "noun_phrase",
      value: "저는",
      translation: "I",
      children: [
        {
          type: "pronoun",
          value: "저",
          translation: "I",
        },
        {
          type: "particle",
          value: "는",
          translation: "topic marker",
        },
      ],
    },
    {
      type: "noun_phrase",
      value: "비 오는 일요일 오후에",
      translation: "on rainy Sunday afternoons",
      children: [
        {
          type: "noun_phrase",
          value: "비 오는 일요일",
          translation: "rainy Sunday",
          children: [
            {
              type: "noun_phrase",
              value: "비 오는",
              translation: "rainy",
              children: [
                {
                  type: "noun",
                  value: "비",
                  translation: "rain",
                },
                {
                  type: "verb",
                  value: "오는",
                  translation: "coming",
                },
              ],
            },
            {
              type: "noun",
              value: "일요일",
              translation: "Sunday",
            },
          ],
        },
        {
          type: "noun",
          value: "오후",
          translation: "afternoon",
        },
        {
          type: "particle",
          value: "에",
          translation: "time/location particle",
        },
      ],
    },
    {
      type: "verb_phrase",
      value: "둠 메탈을 듣는",
      translation: "listening to doom metal",
      children: [
        {
          type: "noun",
          value: "둠 메탈",
          translation: "doom metal",
        },
        {
          type: "particle",
          value: "을",
          translation: "object marker",
        },
        {
          type: "verb",
          value: "듣는",
          translation: "listening",
        },
      ],
    },
    {
      type: "noun_phrase",
      value: "것을",
      translation: "the act of",
      children: [
        {
          type: "noun",
          value: "것",
          translation: "thing, act",
        },
        {
          type: "particle",
          value: "을",
          translation: "object marker",
        },
      ],
    },
    {
      type: "verb_phrase",
      value: "좋아해요",
      translation: "like",
      children: [
        {
          type: "verb",
          value: "좋아하다",
          translation: "like",
        },
        {
          type: "politeness_marker",
          value: "해요",
          translation: "politeness marker",
        },
      ],
    },
  ],
};

// --------------------------------------------------------------- //

// --- //

// const data =   {
//     "type": "root",
//     "value": "저는 지난 주말에 친구들과 함께 서울의 유명한 박물관을 방문하고, 그곳에서 다양한 역사적 유물과 예술 작품들을 감상한 후, 근처에 있는 맛있는 음식점에서 저녁을 먹으며 서로의 근황을 이야기했습니다.",
//     "children": [
//       {
//         "type": "subject",
//         "value": "저는",
//         "children": [
//           {
//             "type": "pronoun",
//             "value": "저",
//             "translation": "I"
//           },
//           {
//             "type": "particle",
//             "value": "는",
//             "translation": "Topic marker"
//           }
//         ]
//       },
//       {
//         "type": "adverbial",
//         "value": "지난 주말에",
//         "translation": "Last weekend",
//         "children": [
//           {
//             "type": "noun",
//             "value": "지난 주말",
//             "translation": "Last weekend"
//           },
//           {
//             "type": "particle",
//             "value": "에",
//             "translation": "At"
//           }
//         ]
//       },
//       {
//         "type": "conjunction_phrase",
//         "value": "친구들과 함께 서울의 유명한 박물관을 방문하고",
//         "translation": "Visited a famous museum in Seoul with my friends",
//         "children": [
//           {
//             "type": "noun",
//             "value": "친구들",
//             "translation": "Friends"
//           },
//           {
//             "type": "particle",
//             "value": "과",
//             "translation": "With"
//           },
//           {
//             "type": "particle",
//             "value": "함께",
//             "translation": "Together"
//           },
//           {
//             "type": "noun_phrase",
//             "value": "서울의 유명한 박물관",
//             "translation": "Famous museum in Seoul",
//             "children": [
//               {
//                 "type": "noun",
//                 "value": "서울",
//                 "translation": "Seoul"
//               },
//               {
//                 "type": "particle",
//                 "value": "의",
//                 "translation": "Of"
//               },
//               {
//                 "type": "adjective",
//                 "value": "유명한",
//                 "translation": "Famous"
//               },
//               {
//                 "type": "noun",
//                 "value": "박물관",
//                 "translation": "Museum"
//               }
//             ]
//           },
//           {
//             "type": "particle",
//             "value": "을",
//             "translation": "Object marker"
//           },
//           {
//             "type": "verb",
//             "value": "방문하고",
//             "translation": "Visited",
//             "children": [
//               {
//                 "type": "verb_stem",
//                 "value": "방문",
//                 "translation": "Visit"
//               },
//               {
//                 "type": "suffix",
//                 "value": "하고",
//                 "translation": "And"
//               }
//             ]
//           }
//         ]
//       },
//       {
//         "type": "conjunction_phrase",
//         "value": "그곳에서 다양한 역사적 유물과 예술 작품들을 감상한 후",
//         "translation": "After admiring various historical artifacts and artworks at that place",
//         "children": [
//           {
//             "type": "noun",
//             "value": "그곳",
//             "translation": "That place"
//           },
//           {
//             "type": "particle",
//             "value": "에서",
//             "translation": "At"
//           },
//           {
//             "type": "noun_phrase",
//             "value": "다양한 역사적 유물과 예술 작품들",
//             "translation": "Various historical artifacts and artworks",
//             "children": [
//               {
//                 "type": "adjective",
//                 "value": "다양한",
//                 "translation": "Various"
//               },
//               {
//                 "type": "adjective",
//                 "value": "역사적",
//                 "translation": "Historical"
//               },
//               {
//                 "type": "noun",
//                 "value": "유물",
//                 "translation": "Artifacts"
//               },
//               {
//                 "type": "particle",
//                 "value": "과",
//                 "translation": "And"
//               },
//               {
//                 "type": "noun",
//                 "value": "예술 작품들",
//                 "translation": "Artworks"
//               }
//             ]
//           },
//           {
//             "type": "verb",
//             "value": "감상한",
//             "translation": "Admiring",
//             "children": [
//               {
//                 "type": "verb_stem",
//                 "value": "감상",
//                 "translation": "Admire"
//               },
//               {
//                 "type": "suffix",
//                 "value": "한",
//                 "translation": "Past participle"
//               }
//             ]
//           },
//           {
//             "type": "suffix",
//             "value": "후",
//             "translation": "After"
//           }
//         ]
//       },
//       {
//         "type": "conjunction_phrase",
//         "value": "근처에 있는 맛있는 음식점에서 저녁을 먹으며 서로의 근황을 이야기했습니다",
//         "translation": "Had dinner at a nearby delicious restaurant while catching up with each other",
//         "children": [
//           {
//             "type": "noun",
//             "value": "근처에 있는 맛있는 음식점",
//             "translation": "Nearby delicious restaurant",
//             "children": [
//               {
//                 "type": "noun",
//                 "value": "근처",
//                 "translation": "Nearby"
//               },
//               {
//                 "type": "particle",
//                 "value": "에",
//                 "translation": "At"
//               },
//               {
//                 "type": "adjective",
//                 "value": "맛있는",
//                 "translation": "Delicious"
//               },
//               {
//                 "type": "noun",
//                 "value": "음식점",
//                 "translation": "Restaurant"
//               }
//             ]
//           },
//           {
//             "type": "particle",
//             "value": "에서",
//             "translation": "At"
//           },
//           {
//             "type": "noun",
//             "value": "저녁",
//             "translation": "Dinner"
//           },
//           {
//             "type": "verb",
//             "value": "먹으며",
//             "translation": "While eating",
//             "children": [
//               {
//                 "type": "verb_stem",
//                 "value": "먹",
//                 "translation": "Eat"
//               },
//               {
//                 "type": "suffix",
//                 "value": "으며",
//                 "translation": "While"
//               }
//             ]
//           },
//           {
//             "type": "noun_phrase",
//             "value": "서로의 근황",
//             "translation": "Each other's recent updates",
//             "children": [
//               {
//                 "type": "pronoun",
//                 "value": "서로의",
//                 "translation": "Each other's"
//               },
//               {
//                 "type": "noun",
//                 "value": "근황",
//                 "translation": "Recent updates"
//               }
//             ]
//           },
//           {
//             "type": "verb",
//             "value": "이야기했습니다",
//             "translation": "Talked",
//             "children": [
//               {
//                 "type": "verb_stem",
//                 "value": "이야기",
//                 "translation": "Talk"
//               },
//               {
//                 "type": "suffix",
//                 "value": "했습니다",
//                 "translation": "Did"
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }

// const data =  {
//     "type": "Sentence",
//     "value": "I like to listen to doom metal on rainy Sunday afternoons.",
//     "translation": "私は雨の日曜日の午後にドゥームメタルを聴くのが好きです。",
//     "children": [
//       {
//         "type": "NounPhrase",
//         "value": "I",
//         "translation": "私",
//         "children": [
//           {
//             "type": "Pronoun",
//             "value": "I",
//             "translation": "私"
//           }
//         ]
//       },
//       {
//         "type": "VerbPhrase",
//         "value": "like to listen to doom metal on rainy Sunday afternoons",
//         "translation": "聴くのが好きです",
//         "children": [
//           {
//             "type": "Verb",
//             "value": "like",
//             "translation": "好きです"
//           },
//           {
//             "type": "InfinitivePhrase",
//             "value": "to listen to doom metal on rainy Sunday afternoons",
//             "translation": "聴く",
//             "children": [
//               {
//                 "type": "Verb",
//                 "value": "listen",
//                 "translation": "聴く"
//               },
//               {
//                 "type": "PrepositionalPhrase",
//                 "value": "to doom metal",
//                 "translation": "ドゥームメタルを",
//                 "children": [
//                   {
//                     "type": "Preposition",
//                     "value": "to",
//                     "translation": "〜を"
//                   },
//                   {
//                     "type": "NounPhrase",
//                     "value": "doom metal",
//                     "translation": "ドゥームメタル",
//                     "children": [
//                       {
//                         "type": "Noun",
//                         "value": "doom metal",
//                         "translation": "ドゥームメタル"
//                       }
//                     ]
//                   }
//                 ]
//               },
//               {
//                 "type": "PrepositionalPhrase",
//                 "value": "on rainy Sunday afternoons",
//                 "translation": "雨の日曜日の午後に",
//                 "children": [
//                   {
//                     "type": "Preposition",
//                     "value": "on",
//                     "translation": "〜に"
//                   },
//                   {
//                     "type": "NounPhrase",
//                     "value": "rainy Sunday afternoons",
//                     "translation": "雨の日曜日の午後",
//                     "children": [
//                       {
//                         "type": "Adjective",
//                         "value": "rainy",
//                         "translation": "雨の"
//                       },
//                       {
//                         "type": "Noun",
//                         "value": "Sunday",
//                         "translation": "日曜日"
//                       },
//                       {
//                         "type": "Noun",
//                         "value": "afternoons",
//                         "translation": "午後"
//                       }
//                     ]
//                   }
//                 ]
//               }
//             ]
//           }
//         ]
//       }
//     ]
//   }

// Japanese
// const data = {
//     "type": "sentence",
//     "value": "私は雨の日曜日の午後にドゥームメタルを聴くのが好きです。",
//     "translation": "I like listening to doom metal on rainy Sunday afternoons.",
//     "children": [
//       {
//         "type": "noun_phrase",
//         "value": "私は",
//         "translation": "I",
//         "children": [
//           {
//             "type": "pronoun",
//             "value": "私",
//             "translation": "I"
//           },
//           {
//             "type": "particle",
//             "value": "は",
//             "translation": "topic marker"
//           }
//         ]
//       },
//       {
//         "type": "noun_phrase",
//         "value": "雨の日曜日の午後に",
//         "translation": "on rainy Sunday afternoons",
//         "children": [
//           {
//             "type": "noun_phrase",
//             "value": "雨の日曜日",
//             "translation": "rainy Sunday",
//             "children": [
//               {
//                 "type": "noun",
//                 "value": "雨",
//                 "translation": "rain"
//               },
//               {
//                 "type": "particle",
//                 "value": "の",
//                 "translation": "possessive particle"
//               },
//               {
//                 "type": "noun",
//                 "value": "日曜日",
//                 "translation": "Sunday"
//               }
//             ]
//           },
//           {
//             "type": "particle",
//             "value": "の",
//             "translation": "possessive particle"
//           },
//           {
//             "type": "noun",
//             "value": "午後",
//             "translation": "afternoon"
//           },
//           {
//             "type": "particle",
//             "value": "に",
//             "translation": "time/location particle"
//           }
//         ]
//       },
//       {
//         "type": "verb_phrase",
//         "value": "ドゥームメタルを聴く",
//         "translation": "listening to doom metal",
//         "children": [
//           {
//             "type": "noun",
//             "value": "ドゥームメタル",
//             "translation": "doom metal"
//           },
//           {
//             "type": "particle",
//             "value": "を",
//             "translation": "object marker"
//           },
//           {
//             "type": "verb",
//             "value": "聴く",
//             "translation": "listen"
//           }
//         ]
//       },
//       {
//         "type": "nominalizer_phrase",
//         "value": "のが",
//         "translation": "the act of",
//         "children": [
//           {
//             "type": "nominalizer",
//             "value": "の",
//             "translation": "nominalizer"
//           },
//           {
//             "type": "particle",
//             "value": "が",
//             "translation": "subject marker"
//           }
//         ]
//       },
//       {
//         "type": "adjective_phrase",
//         "value": "好きです",
//         "translation": "like",
//         "children": [
//           {
//             "type": "adjective",
//             "value": "好き",
//             "translation": "like"
//           },
//           {
//             "type": "copula",
//             "value": "です",
//             "translation": "politeness marker"
//           }
//         ]
//       }
//     ]
//   }
