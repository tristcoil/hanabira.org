"use client";

// ------------------------ furigana sibling component ------------------------- //

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FuriganaConverterProps {
    japaneseSubtitle: string;
  }
  
  const FuriganaConverter: React.FC<FuriganaConverterProps> = ({ japaneseSubtitle }) => {
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
        <h1>Custom sibling component with dynamic current subtitle prop:</h1>
        <div className="flex justify-center mt-2 text-3xl">
          <div className="bg-blue-800 bg-opacity-70 p-6 rounded-lg text-center shadow-lg">
            <div dangerouslySetInnerHTML={{ __html: furiganaText }} />
          </div>
        </div>
      </>
    );
  };
  
export default FuriganaConverter;