"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromCookies } from "@/utils/helperFunctions";

const SentenceMiningTable = () => {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const { userId } = getUserFromCookies();
    setUserId(userId);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    try {
      const response = await axios.get("/f-api/v1/text-parser-words", {
        params: {
          userId: userId,
          collectionName: "vocabulary",
          p_tag: "sentence_mining",
          s_tag: "verbs-1",
        },
      });
      setData(response.data.words);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteWord = async (wordId) => {
    if (!userId) return;
    try {
      await axios.delete("/f-api/v1/text-parser-words", {
        data: {
          id: wordId,
          userId: userId,
          collectionName: "vocabulary",
          p_tag: "sentence_mining",
          s_tag: "verbs-1",
        },
      });
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sentence Mining</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-300">ID</th>
            <th className="py-2 px-4 border-b border-gray-300">Japanese Vocabulary</th>
            <th className="py-2 px-4 border-b border-gray-300">Simplified Vocabulary</th>
            <th className="py-2 px-4 border-b border-gray-300">English Vocabulary</th>
            <th className="py-2 px-4 border-b border-gray-300">Audio</th>
            <th className="py-2 px-4 border-b border-gray-300">Sentences</th>
            <th className="py-2 px-4 border-b border-gray-300">Notes</th>
            <th className="py-2 px-4 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((word, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b border-gray-300">{word.id}</td>
              <td className="py-2 px-4 border-b border-gray-300">{word.vocabulary_japanese}</td>
              <td className="py-2 px-4 border-b border-gray-300">{word.vocabulary_simplified}</td>
              <td className="py-2 px-4 border-b border-gray-300">{word.vocabulary_english}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                <button
                  onClick={() => {
                    const audioElement = document.getElementById(
                      `audio-${word.vocabulary_audio}`
                    ) as HTMLAudioElement;
                    audioElement.play();
                  }}
                  className="p-2 bg-slate-500 text-white rounded-full hover:bg-slate-600 focus:outline-none"
                >
                  ▶️
                </button>
                <audio id={`audio-${word.vocabulary_audio}`} className="hidden">
                  <source src={word.vocabulary_audio} type="audio/mp3" />
                </audio>
              </td>
              <td className="py-2 px-4 border-b border-gray-300">
                {word.sentences.map((sentence, sIndex) => (
                  <div key={sIndex} className="mb-2">
                    <p>{sentence.sentence_japanese}</p>
                    <p className="text-gray-500">{sentence.sentence_english}</p>
                  </div>
                ))}
              </td>
              <td className="py-2 px-4 border-b border-gray-300">{word.notes}</td>
              <td className="py-2 px-4 border-b border-gray-300">
                <button
                  onClick={() => deleteWord(word.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SentenceMiningTable;




