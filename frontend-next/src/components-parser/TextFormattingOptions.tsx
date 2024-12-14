import React from 'react';

interface TextFormattingOptionsProps {
  inputMode: string;
  handleModeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextFormattingOptions: React.FC<TextFormattingOptionsProps> = ({ inputMode, handleModeChange }) => {
  return (
    <div className="p-4">
      <p className="text-sm font-medium mb-2">Text Formatting Options</p>
      <div className="flex space-x-2">
        <label className="cursor-pointer">
          <input
            type="radio"
            value="book"
            checked={inputMode === 'book'}
            onChange={handleModeChange}
            className="hidden"
          />
          <span
            className={`px-3 py-1 rounded-full transition-colors duration-300 ${
              inputMode === 'book' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Book/Paragraph
          </span>
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            value="lyrics"
            checked={inputMode === 'lyrics'}
            onChange={handleModeChange}
            className="hidden"
          />
          <span
            className={`px-3 py-1 rounded-full transition-colors duration-300 ${
              inputMode === 'lyrics' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Lyrics/Line by line
          </span>
        </label>
      </div>
    </div>
  );
};

export default TextFormattingOptions;
