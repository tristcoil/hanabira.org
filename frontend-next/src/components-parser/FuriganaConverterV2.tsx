"use client";
// ----------------------- furigana v2 with not dangerous html parser ------------//

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';

interface FuriganaConverterProps {
  japaneseSubtitle: string;
}

const FuriganaConverterV2: React.FC<FuriganaConverterProps> = ({ japaneseSubtitle }) => {
  const [furiganaText, setFuriganaText] = useState('');

  useEffect(() => {
    const fetchFurigana = async () => {
      try {
        const response = await axios.post('/d-api/v1/convert/furigana', {
          text: japaneseSubtitle,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setFuriganaText(response.data.furigana);
      } catch (error) {
        console.error('Error fetching furigana:', error);
      }
    };

    if (japaneseSubtitle) {
      fetchFurigana();
    }
  }, [japaneseSubtitle]);

  return (
    <>
      <div className="flex justify-center mt-2 text-3xl">
        <div className="bg-blue-100 bg-opacity-70 p-6 rounded-lg text-center shadow-lg">
          {parse(furiganaText)}
        </div>
      </div>
    </>
  );
};

export default FuriganaConverterV2;