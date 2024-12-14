"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface UnifiedGptComponentProps {
    japaneseText: string;
    url: string;
    task: 'translate' | 'summarize' | 'analyzeSentiment';
  }
  
  const UnifiedGptComponent: React.FC<UnifiedGptComponentProps> = ({ japaneseText, url, task }) => {
    const [resultText, setResultText] = useState("");
    const [modelInfo, setModelInfo] = useState("");
    const [tokenInfo, setTokenInfo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleTask = async () => {
      setLoading(true);
      setError("");
      setResultText("");
      setModelInfo("");
      setTokenInfo("");
  
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
  
        setResultText(content);
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
  
    const getTaskName = () => {
      switch (task) {
        case 'translate':
          return 'Translate';
        case 'summarize':
          return 'Summarize';
        case 'analyzeSentiment':
          return 'Analyze Sentiment';
        default:
          return 'Task';
      }
    };
  
    // max-w-screen-2xl
  
    return (
      <div className="bg-slate-100 p-6 shadow-md rounded-lg text-black w-full  mx-auto my-6 overflow-auto">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{getTaskName()} Text:</h2>
          <p className="text-base text-gray-700 bg-gray-100 p-4 rounded-md max-h-32 overflow-y-auto">
            {japaneseText || <span className="italic text-gray-500">No text provided</span>}
          </p>
        </div>
  
        {resultText && (
          <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">{getTaskName()}</h2>
            <div className="prose max-w-none overflow-auto">
              <ReactMarkdown>{resultText}</ReactMarkdown>
            </div>
            <p className="mt-4 text-sm text-gray-600">{modelInfo}</p>
            <p className="text-sm text-gray-600">{tokenInfo}</p>
          </div>
        )}
  
        {error && <p className="mt-4 text-red-500">{error}</p>}
  
        {japaneseText && (
          <button
            onClick={handleTask}
            className="mt-4 bg-blue-600 text-white text-sm px-5 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-150 ease-in-out"
          >
            {loading ? `${getTaskName()}...` : `${getTaskName()} (Chat GPT)`}
          </button>
        )}
      </div>
    );
  };
  
  
export default UnifiedGptComponent;