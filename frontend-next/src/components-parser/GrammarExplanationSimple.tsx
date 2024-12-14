"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface GrammarExplanationSimpleProps {
  sentence: string;
  url: string;
}

const GrammarExplanationSimple: React.FC<GrammarExplanationSimpleProps> = ({
  sentence,
  url,
}) => {
  const [markdown, setMarkdown] = useState("");
  const [modelInfo, setModelInfo] = useState("");
  const [tokenInfo, setTokenInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateMarkdown = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: sentence,
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
    // Clear markdown when new sentence prop is received
    setMarkdown("");
  }, [sentence]);

  return (
    <div className="bg-slate-100 p-4 shadow-lg rounded-md text-black mb-4 w-full prose mx-auto">
      <div className="mt-4">
        <h2 className="text-xl font-medium text-gray-800">Grammar explanation</h2>
        <h3 className="text-lg font-medium text-gray-800">Sentence:</h3>
        <p className="mt-2 text-gray-600">{sentence || "No sentence provided."}</p>
      </div>

      {markdown && (
        <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Grammar Explanation</h2>
          <div className="prose max-w-full overflow-y-auto max-h-[700px]">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
          <p className="mt-4 text-sm text-gray-700">{modelInfo}</p>
          <p className="text-sm text-gray-700">{tokenInfo}</p>
        </div>
      )}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <button
        onClick={handleGenerateMarkdown}
        className="mt-2 bg-blue-500 text-white text-xs px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
      >
        {loading ? "Generating..." : "Generate Grammar Explanation"}
      </button>
    </div>
  );
};

export default GrammarExplanationSimple;
