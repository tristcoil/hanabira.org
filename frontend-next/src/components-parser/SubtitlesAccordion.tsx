'use client';


import React, { useState } from 'react';

interface SubtitlesAccordionProps {
  japaneseSubtitlesPlainText: string;
  englishSubtitlesPlainText: string;
}

const SubtitlesAccordion: React.FC<SubtitlesAccordionProps> = ({ japaneseSubtitlesPlainText, englishSubtitlesPlainText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <button
        onClick={toggleAccordion}
        className="w-full text-left px-4 py-2 bg-gray-100 rounded-md focus:outline-none"
      >
        {isOpen ? 'Hide Subtitles' : 'Show Subtitles - Japanese/English side by side'}
      </button>
      {isOpen && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h2>Just Japanese text without timestamps</h2>
              <h3>Japanese Plain Text</h3>
              <pre className="whitespace-pre-wrap break-words">{japaneseSubtitlesPlainText}</pre>
            </div>

            <div>
              <h2>Just English text without timestamps</h2>
              <h3>English Plain Text</h3>
              <pre className="whitespace-pre-wrap break-words">{englishSubtitlesPlainText}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtitlesAccordion;
