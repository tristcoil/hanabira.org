"use client";

import React, { useEffect, useState } from 'react';

interface RadicalInfoProps {
    word: string;
    url: string;
  }
  
  interface Radical {
    radical: string;
    meaning: string;
  }
  
  interface KanjiData {
    kanji: string;
    radicals?: Radical[];
    error?: string;
  }
  
  const RadicalInfo: React.FC<RadicalInfoProps> = ({ word, url }) => {
    const [kanjiData, setKanjiData] = useState<KanjiData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchRadicalInfo = async () => {
        if (!word) {
          setKanjiData([]);
          return;
        }
  
        setLoading(true);
        setError(null);
  
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ kanjiList: word }),
          });
  
          const data: KanjiData[] = await response.json();
          if (Array.isArray(data)) {
            setKanjiData(data);
          } else {
            throw new Error('API response is not an array');
          }
        } catch (err) {
          setError('Failed to fetch Kanji information.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRadicalInfo();
    }, [word, url]);
  
    if (loading) {
      return <div className="text-center text-lg">Loading...</div>;
    }
  
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }
  
    return (
      <div className="p-4">
        {kanjiData.map((item, index) => (
          <div key={index} className="mb-6 border p-4 rounded shadow">
            <div className="text-2xl font-bold mb-2">{item.kanji}</div>
            {item.error ? (
              <div className="text-red-500">{item.error}</div>
            ) : (
              <div>
                <div className="text-lg font-semibold mb-2">Radicals:</div>
                <ul className="list-disc list-inside">
                  {item.radicals?.map((radical, idx) => (
                    <li key={idx}>
                      <span className="font-bold">{radical.radical}</span>: {radical.meaning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
export default RadicalInfo;