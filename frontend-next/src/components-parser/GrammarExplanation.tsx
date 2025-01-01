"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';


// ------------------------ GPT calling ------------------------------ //

interface DisplayWordProps {
  word: string | null;
  sentence: { original: string }[] | null;
  url: string;
}

const GrammarExplanation: React.FC<DisplayWordProps> = ({
  word,
  sentence,
  url,
}) => {
  const [markdown, setMarkdown] = useState("");
  const [modelInfo, setModelInfo] = useState("");
  const [tokenInfo, setTokenInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTextFromSentence = (sentence: { original: string }[] | null) => {
    if (!sentence) return "";
    return sentence.map((word) => word.original).join(" ");
  };

  const handleGenerateMarkdown = async () => {
    const japaneseText = getTextFromSentence(sentence);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: japaneseText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from API");
      }

      const data = await response.json();

      const content = data.choices[0].message.content;
      const model = data.model;
      const tokens = data.usage;

      setMarkdown(content);
      setModelInfo(`Model: ${model}`);
      setTokenInfo(
        `Total tokens: ${tokens.total_tokens}, Prompt tokens: ${tokens.prompt_tokens}, Completion tokens: ${tokens.completion_tokens}`
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear markdown when new sentence props are received
    // setMarkdown("xxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx  xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx  xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx x xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx  xxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx  xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx  xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx x xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx xxx xxxx xxxxxxx xxx xxx xxx xxx xxx xxx xxx llllllllllllllllll ");
    setMarkdown("");
  }, [sentence]);

  return (
    <div className="bg-slate-100 p-4 shadow-lg rounded-md text-black mb-2 w-full prose mx-auto overflow-y-auto max-h-[700px]">
      <div className="text-lg font-bold text-gray-800">
        Clicked Word: <span className="text-blue-600">{word || "None"}</span>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-800">Word Sentence:</h3>
        <p className="mt-2 text-gray-600">
          {sentence && sentence.length > 0
            ? sentence.map((word, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 rounded-md px-2 py-1 mr-1 mb-1"
              >
                {word.original}
              </span>
            ))
            : "Click a word to see its sentence."}
        </p>
      </div>

      {markdown && (
        <div className="mt-0 p-2 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Grammar Explanation</h2>

          <div className="prose max-w-full">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>

          <p className="mt-4 text-sm text-gray-700">{modelInfo}</p>
          <p className="text-sm text-gray-700">{tokenInfo}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {word && (
        <button
          onClick={handleGenerateMarkdown}
          className="mt-2 bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500 mb-20"
        >
          {loading
            ? "Generating..."
            : "Generate Explanation with GPT"}
        </button>
      )}

    </div>
  );
};

export default GrammarExplanation;
