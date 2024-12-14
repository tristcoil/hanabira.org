'use client';

import React, { useState } from 'react';

interface YouTubeUrlInputFormProps {
  inputUrl: string;
  setInputUrl: (url: string) => void;
  setFinalInputUrl: (url: string) => void;
}

const YouTubeUrlInputForm: React.FC<YouTubeUrlInputFormProps> = ({ inputUrl, setInputUrl, setFinalInputUrl }) => {
  
  
  // const handleInputChangeYT = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   console.log('current input:', inputUrl);
  //   setInputUrl(e.target.value);
  // };

  // const handleSubmitYT = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   if (isYouTubeUrl(inputUrl)) {
  //     setFinalInputUrl(inputUrl);
  //   } else {
  //     alert('Please enter a valid YouTube URL');
  //   }
  // };

  const handleInputChangeYT = (e: React.ChangeEvent<HTMLInputElement>) => {
    //const trimmedInput = e.target.value.trimStart(); // Removes only leading whitespaces during typing
    const trimmedInput = e.target.value.trim();
    console.log('current input:', trimmedInput);
    setInputUrl(trimmedInput);
  };

  const handleSubmitYT = (e: React.MouseEvent<HTMLButtonElement>) => {
    const trimmedUrl = inputUrl.trim(); // Ensures all leading and trailing whitespaces are removed
    if (isYouTubeUrl(trimmedUrl)) {
      setFinalInputUrl(trimmedUrl);
    } else {
      alert('Please enter a valid YouTube URL');
    }
  };







  const isYouTubeUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return regex.test(url);
  };

  return (
    <div className="flex justify-center gap-4 pt-5">
      <div className="max-w-lg w-full">
        <div className="flex items-center border border-gray-300 rounded bg-white text-gray-800">
          <span className="px-3 py-2 bg-gray-200 border-r border-gray-300">URL</span>
          <input
            type="text"
            className="flex-1 px-3 py-2 focus:outline-none"
            placeholder="YouTube video URL (that has Japanese subtitles)"
            value={inputUrl || ""}
            onChange={handleInputChangeYT}
          />
        </div>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSubmitYT}
      >
        Go
      </button>
    </div>
  );
};

export default YouTubeUrlInputForm;
