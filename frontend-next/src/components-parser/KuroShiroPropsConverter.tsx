"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Define the structure of the conversion result
interface ConversionResult {
  original?: string;
  hiragana?: string;
  katakana?: string;
  romaji?: string;
  okurigana?: string;
  furigana?: string;
  error?: string;
}

// Define the structure of the component props
interface Props {
  text: string;
  url: string;
}

const KuroShiroPropsConverter: React.FC<Props> = ({ text, url }) => {
  const [conversionResult, setConversionResult] = useState<ConversionResult>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("furigana");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url, { text });
      setConversionResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      setConversionResult({ error: "Failed to convert text." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text) handleSubmit(); // Only auto-convert when text is not empty
  }, [text]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "original":
        return <p>{conversionResult.original}</p>;
      case "hiragana":
        return <p>{conversionResult.hiragana}</p>;
      case "katakana":
        return <p>{conversionResult.katakana}</p>;
      case "romaji":
        return <p>{conversionResult.romaji}</p>;
      case "okurigana":
        return <p>{conversionResult.okurigana}</p>;
      case "furigana":
        return (
          <span
            dangerouslySetInnerHTML={{
              __html: conversionResult.furigana || "",
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 border border-gray-200 text-black">
      
      {/* actually, conversion gets triggered automatically, no button really needed */}
      {/* <button
        onClick={handleSubmit}
        disabled={loading || !text}
        className={`px-4 py-2 font-semibold text-white rounded-lg shadow-md ${loading || !text
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-400 hover:bg-blue-700"
          } transition-colors duration-150 ease-in-out`}
      >
        {loading ? "Converting..." : "Convert Text to Furigana"}
      </button> */}

      {conversionResult.original && (
        <div>
          <h3>Results:</h3>
          <div className="flex border-b border-gray-200 mb-4">
            {[
              "furigana",
              "okurigana",
              "romaji",
              "original",
              // "hiragana",
              // "katakana",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 -mb-px border-t border-l border-r rounded-t ${activeTab === tab
                  ? "text-blue-700 border-blue-700 bg-white"
                  : "text-gray-500 border-transparent hover:text-blue-700 hover:border-gray-300"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="p-6 border border-gray-200 rounded-b text-2xl leading-loose">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default KuroShiroPropsConverter;