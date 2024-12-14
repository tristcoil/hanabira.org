import React, { useState } from "react";

import TextWithTranslation from "@/components/TextWithTranslation";
import AudioPlayer from "@/components/AudioPlayer";

// Define the structure of the JSON data as TypeScript types
interface SentenceData {
  japanese: string;
  romanization: string;
  translation: string;
  audioPath: string;
  audioPathEn: string;
}

interface ReadingData {
  key: string;
  title: string;
  titleRomaji: string;
  titleJp: string;
  p_tag: string;
  s_tag: string;
  textAudio: string;
  textAudio_1: string;
  textAudioEn: string;
  textAudioEn_1: string;
  japaneseText: string[];
  romanizedText: string[];
  englishTranslation: string[];
  readingVocabulary: string[];
  readingVocabularyEn: string[];
  readingGrammar: string[];
  readingGrammarEn: string[];
  sentencePayload: SentenceData[];
}

type ReadingComponentProps = {
  data: ReadingData;
};

type Tab = {
  name: string;
  //key: keyof ReadingData;
  key: string;
};

const ReadingComponent: React.FC<ReadingComponentProps> = ({ data }) => {
  //const [activeTab, setActiveTab] = useState<keyof ReadingData>("japaneseText");
  const [activeTab, setActiveTab] = useState("japaneseText");

  const [isEnglishSpeaker, setisEnglishSpeaker] = useState(true);

  const tabs: Tab[] = [
    { name: "Japanese", key: "japaneseText" },
    { name: "Romanized", key: "romanizedText" },
    { name: "English", key: "englishTranslation" },
    { name: "Combined", key: "combined" },
    { name: "Vocabulary", key: "readingVocabulary" },
    { name: "Grammar", key: "readingGrammar" },
    { name: "Sentences", key: "sentencePayload" },
    // Add more tabs as needed
  ];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{data.title}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">{data.titleRomaji}</p>
          <p className="text-lg text-gray-600 dark:text-gray-400">{data.titleJp}</p>
        </div>
        <button
          onClick={() => setisEnglishSpeaker(!isEnglishSpeaker)}
          className="text-md font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full px-4 py-2 transition-colors duration-150 ease-in-out focus:outline-none focus:shadow-outline"
        >
          {isEnglishSpeaker ? '日本語' : 'English'}
        </button>
      </div>
  
      {/* Audio Player Section */}
      <div className="bg-white dark:bg-slate-700 p-5 rounded-lg shadow">
        <h2 className="text-lg text-gray-900 dark:text-gray-100 mb-2">Listen to the Article</h2>
        <AudioPlayer src={isEnglishSpeaker ? data.textAudio : data.textAudioEn} />
      </div>

  


      {/* Tabs */}
      <div className="flex flex-wrap justify-center md:justify-start gap-1 p-4 bg-gray-50 dark:bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out leading-5 ${
              activeTab === tab.key
                ? "bg-gray-700 text-white dark:bg-gray-700 dark:text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            } focus:outline-none rounded-md`}
            onClick={() => setActiveTab(tab.key)}
            style={{ minWidth: "80px" }} // Ensures that buttons have a minimum width for better mobile appearance
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2 bg-white dark:bg-gray-800">
        {activeTab === "japaneseText" && (
          <div className="space-y-4">
            {data.japaneseText.map((text, index) => (
              <p
                key={index}
                className="text-gray-800 dark:text-gray-200 mb-4 text-japanese"
                style={{
                  fontFamily: "Noto Serif JP, sans-serif",
                  fontWeight: "normal",
                }}
              >
                {text}
              </p>
            ))}
          </div>
        )}
      </div>

      {activeTab === "romanizedText" && (
        <div className="space-y-4">
          {" "}
          {/* This class adds space between children */}
          {data.romanizedText.map((text, index) => (
            <p key={index} className="text-gray-800 dark:text-gray-200 mb-4">
              {" "}
              {/* Additional margin-bottom class */}
              {text}
            </p>
          ))}
        </div>
      )}

      {activeTab === "englishTranslation" && (
        <div className="space-y-4">
          {" "}
          {/* This class adds space between children */}
          {data.englishTranslation.map((text, index) => (
            <p key={index} className="text-gray-800 dark:text-gray-200 mb-4">
              {" "}
              {/* Additional margin-bottom class */}
              {text}
            </p>
          ))}
        </div>
      )}

      {activeTab === "combined" && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="md:flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Japanese
            </h2>
            {data.japaneseText.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="md:flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Romanized
            </h2>
            {data.romanizedText.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="md:flex-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              English
            </h2>
            {data.englishTranslation.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}

      {activeTab === "readingVocabulary" && (
        <div className="space-y-4">
          {(isEnglishSpeaker ? data.readingVocabulary : data.readingVocabularyEn).map(
            (entry, index) => {
              const [firstWord, ...rest] = entry.split(" ");
              return (
                <p
                  key={index}
                  className="text-gray-800 dark:text-gray-200 mb-4"
                >
                  <span
                    className="text-2xl text-japanese"
                    style={{
                      fontFamily: "Noto Serif JP, sans-serif",
                      fontWeight: "normal",
                    }}
                  >
                    {firstWord}
                  </span>{" "}
                  {rest.join(" ")}
                </p>
              );
            }
          )}
        </div>
      )}

      {activeTab === "readingGrammar" && (
        <div className="space-y-4">
          {(isEnglishSpeaker ? data.readingGrammar : data.readingGrammarEn).map(
            (rule, index) => {
              const [firstWord, ...rest] = rule.split(" ");
              return (
                <p
                  key={index}
                  className="text-gray-800 dark:text-gray-200 mb-4"
                >
                  <span
                    className="text-2xl text-japanese"
                    style={{
                      fontFamily: "Noto Serif JP, sans-serif",
                      fontWeight: "normal",
                    }}
                  >
                    {firstWord}
                  </span>{" "}
                  {rest.join(" ")}
                </p>
              );
            }
          )}
        </div>
      )}

      {activeTab === "sentencePayload" && (
        <div>
          <TextWithTranslation
            sentences={data.sentencePayload}
            isEnglishSpeaker={isEnglishSpeaker}
          />
        </div>
      )}
    </div>
  );
};

export default ReadingComponent;