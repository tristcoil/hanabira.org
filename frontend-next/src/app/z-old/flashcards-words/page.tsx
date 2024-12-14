"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getUserFromCookies } from '@/utils/helperFunctions';

// import ComplexFlashcardModalVocabFlaskSentenceMining from "@/components/ComplexFlashcardModalVocabFlaskSentenceMining"
// import ComplexFlashcardModalVocabFlask from "@/components/ComplexFlashcardModalVocabFlask";
// import CloneButton from "@/components/CloneButton";

import dynamic from "next/dynamic";

// const LearningProgressFlask = dynamic(
//   () => import("@/components/LearningProgressFlask"),
//   { ssr: false }
// );

// const ComplexFlashcardModalKanjiFlask = dynamic(
//   () => import("@/components/ComplexFlashcardModalKanjiFlask"),
//   { ssr: false }
// );

const ComplexFlashcardModalVocabFlask = dynamic(
  () => import("@/components/ComplexFlashcardModalVocabFlask"),
  { ssr: false }
);


const ComplexFlashcardModalVocabFlaskSentenceMining = dynamic(
  () => import("@/components/ComplexFlashcardModalVocabFlaskSentenceMining"),
  { ssr: false }
);


const CloneButton = dynamic(() => import("@/components/CloneButton"), {
  ssr: false,
});




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
            <CloneButton
              collection="words"
              level="essential_600_verbs"
              userId={userId}
            />
            <CloneButton
              collection="words"
              level="suru_essential_600_verbs"
              userId={userId}
            />
          </div>
        </div>

        <br></br>
        <br></br>

        <h1 className="text-xl font-bold mb-2">Essential Japanese verbs</h1>

        <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
          {[
            "verbs-1",
            "verbs-2",
            "verbs-3",
            "verbs-4",
            "verbs-5",
            "verbs-6",
            "verbs-7",
            "verbs-8",
          ].map((part, index) => (
            <div key={index}>
              <ComplexFlashcardModalVocabFlask
                userId={userId}
                collectionName="words"
                p_tag="essential_600_verbs"
                s_tag={part}
              />
            </div>
          ))}
        </div>


        <br></br>
        <br></br>


        <h1 className="text-xl font-bold mb-2">Essential Suru Japanese verbs</h1>

        <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
          {[
            "verbs-1",
            "verbs-2",
            "verbs-3",
            "verbs-4",
            "verbs-5",
            "verbs-6",
          ].map((part, index) => (
            <div key={index}>
              <ComplexFlashcardModalVocabFlask
                userId={userId}
                collectionName="words"
                p_tag="suru_essential_600_verbs"
                s_tag={part}
              />
            </div>
          ))}
        </div>


        <br></br>
        <br></br>
        <br></br>
        <br></br>




        <h1 className="text-xl font-bold mb-2">SENTENCE MINING</h1>

        <ComplexFlashcardModalVocabFlaskSentenceMining
                userId={userId}
                collectionName="vocabulary"
                p_tag="sentence_mining"
                s_tag="verbs-1"
              />







        {/* <h1 className="text-2xl">Learning Progress DASHBOARD</h1>
        <br></br>
        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="words"
            p_tag="essential_600_verbs"
            s_tag="verbs-1"
          />
        </div>

        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="words"
            p_tag="essential_600_verbs"
            s_tag="verbs-2"
          />
        </div>

        <br></br>
        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="words"
            p_tag="suru_essential_600_verbs"
            s_tag="verbs-1"
          />
        </div>

        <div>
          <LearningProgressFlask
            userId={userId}
            collectionName="words"
            p_tag="suru_essential_600_verbs"
            s_tag="verbs-2"
          />
        </div> */}
      </div>
    </div>
  );
}
