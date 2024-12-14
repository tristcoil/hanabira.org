"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getUserFromCookies } from '@/utils/helperFunctions';

import ComplexFlashcardModalKanjiFlask from "@/components/ComplexFlashcardModalKanjiFlask";
import CloneButton from "@/components/CloneButton";


export default function Home() {
  const [darkMode, setDarkMode] = useState(false);


  const [userId, setuserId] = useState(null);


  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  useEffect(() => {
    const fetchuserId = async () => {
        const { userId, jwt } = getUserFromCookies();
        setuserId(userId);
    };

    fetchuserId();
}, []);



  return (
    <div className="bg-gray-300 text-black dark:bg-gray-900 dark:text-white">
      <div className="bg-gray-300 dark:bg-gray-900 min-h-screen relative">
        
        <br></br>
        <br></br>

        <div className="p-4">
          <h1 className="text-xl font-semibold mb-4">Clone JLPT Collections</h1>
          <div className="flex flex-wrap">
            <CloneButton collection="kanji" level="JLPT_N5" userId={userId} />
            <CloneButton collection="kanji" level="JLPT_N4" userId={userId} />
            <CloneButton collection="kanji" level="JLPT_N3" userId={userId} />
            <CloneButton collection="kanji" level="JLPT_N2" userId={userId} />
            <CloneButton collection="kanji" level="JLPT_N1" userId={userId} />
          </div>
        </div>

        <br></br>
        <br></br>

        <h1 className="text-xl font-bold mb-2">
          Kanji JLPT N3 (with one reading)
        </h1>

        <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
          {["part_1", "part_2", "part_3", "part_4", "part_5", "part_6"].map(
            (part, index) => (
              <div
                key={index}
                className="w-full max-w-xs shadow-md rounded-lg"
              >
                <ComplexFlashcardModalKanjiFlask
                  userId={userId}
                  collectionName="kanji"
                  p_tag="JLPT_N3"
                  s_tag={part}
                />
              </div>
            )
          )}
        </div>

        <br></br>
        <br></br>

        <h1 className="text-xl font-bold mb-2">
          Kanji JLPT N4 (with one reading)
        </h1>

        <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
          {["part_1", "part_2", "part_3"].map(
            (part, index) => (
              <div
                key={index}
                className="w-full max-w-xs shadow-md rounded-lg"
              >
                <ComplexFlashcardModalKanjiFlask
                  userId={userId}
                  collectionName="kanji"
                  p_tag="JLPT_N4"
                  s_tag={part}
                />
              </div>
            )
          )}
        </div>

        <br></br>
        <br></br>

        <h1 className="text-xl font-bold mb-2">
          Kanji JLPT N5 (with one reading)
        </h1>

        <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
          {["part_1"].map(
            (part, index) => (
              <div
                key={index}
                className="w-full max-w-xs shadow-md rounded-lg"
              >
                <ComplexFlashcardModalKanjiFlask
                  userId={userId}
                  collectionName="kanji"
                  p_tag="JLPT_N5"
                  s_tag={part}
                />
              </div>
            )
          )}
        </div>


        <br></br>
        <br></br>
        <br></br>
        <br></br>

        {/* <h1 className="text-2xl">Learning Progress DASHBOARD</h1>
        <br></br>
        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="kanji"
            p_tag="JLPT_N3"
            s_tag="part_1"
          />
        </div>

        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="kanji"
            p_tag="JLPT_N3"
            s_tag="part_2"
          />
        </div> */}
      </div>
    </div>
  );
}
