"use client";

import { useState } from "react";
import { useEffect } from "react";
import { getUserFromCookies } from "@/utils/helperFunctions";

import ComplexFlashcardModalKanjiFlask from "@/components/ComplexFlashcardModalKanjiFlask";
import CloneButton from "@/components/CloneButton";

import ComplexFlashcardModalVocabFlaskSentenceMining from "@/components/ComplexFlashcardModalVocabFlaskSentenceMining";
import ComplexFlashcardModalVocabFlask from "@/components/ComplexFlashcardModalVocabFlask";

import { useUser } from "@/context/UserContext";
import LoginButton from "@/components/LoginButton";

export default function Home() {


  const [darkMode, setDarkMode] = useState(false);

  //const [userId, setuserId] = useState(null);
  const { userId, loggedIn, loading } = useUser();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // useEffect(() => {
  //   const fetchuserId = async () => {
  //     const { userId, jwt } = getUserFromCookies();
  //     setuserId(userId);
  //   };

  //   fetchuserId();
  // }, []);

  // While we're still loading the login state from context, show a spinner or nothing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Simple spinner, or skeleton UI */}
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  //If the user is not logged in, display the modal
  if (!loading && !loggedIn) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        {/* Modal container */}
        <div className="bg-white rounded-md shadow-md p-6 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Please Log In</h2>
          <p className="mb-4">
            You need to be logged in to access this feature.
          </p>
          <div className="flex justify-end">
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }










  return (
    <div className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white min-h-screen">

<p className="text-lg font-semibold text-green-500">
            User ID: {userId}
          </p>


      <div className="container mx-auto p-6">
        {/* Clone JLPT Collections Section */}
        <section className="mb-12">
          <h1 className="text-2xl font-bold mb-6">Clone JLPT Collections</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
            {["JLPT_N5", "JLPT_N4", "JLPT_N3", "JLPT_N2", "JLPT_N1"].map(
              (level) => (
                <CloneButton
                  key={level}
                  collection="kanji"
                  level={level}
                  userId={userId}
                />
              )
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["essential_600_verbs", "suru_essential_600_verbs"].map(
              (level) => (
                <CloneButton
                  key={level}
                  collection="words"
                  level={level}
                  userId={userId}
                />
              )
            )}
          </div>
        </section>

        {/* Kanji JLPT N3 Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Kanji JLPT N3 (with one reading)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {["part_1", "part_2", "part_3", "part_4", "part_5", "part_6"].map(
              (part, index) => (
                <div key={index} className="shadow-md rounded-lg">
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
        </section>

        {/* Kanji JLPT N4 Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Kanji JLPT N4 (with one reading)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {["part_1", "part_2", "part_3"].map((part, index) => (
              <div key={index} className="shadow-md rounded-lg">
                <ComplexFlashcardModalKanjiFlask
                  userId={userId}
                  collectionName="kanji"
                  p_tag="JLPT_N4"
                  s_tag={part}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Kanji JLPT N5 Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Kanji JLPT N5 (with one reading)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["part_1"].map((part, index) => (
              <div key={index} className="shadow-md rounded-lg">
                <ComplexFlashcardModalKanjiFlask
                  userId={userId}
                  collectionName="kanji"
                  p_tag="JLPT_N5"
                  s_tag={part}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Essential Japanese Verbs Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Essential Japanese Verbs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
              <div key={index} className="shadow-md rounded-lg">
                <ComplexFlashcardModalVocabFlask
                  userId={userId}
                  collectionName="words"
                  p_tag="essential_600_verbs"
                  s_tag={part}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Essential Suru Japanese Verbs Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">
            Essential Suru Japanese Verbs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              "verbs-1",
              "verbs-2",
              "verbs-3",
              "verbs-4",
              "verbs-5",
              "verbs-6",
            ].map((part, index) => (
              <div key={index} className="shadow-md rounded-lg">
                <ComplexFlashcardModalVocabFlask
                  userId={userId}
                  collectionName="words"
                  p_tag="suru_essential_600_verbs"
                  s_tag={part}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Sentence Mining Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Sentence Mining</h2>
          <div className="shadow-md rounded-lg">
            <ComplexFlashcardModalVocabFlaskSentenceMining
              userId={userId}
              collectionName="vocabulary"
              p_tag="sentence_mining"
              s_tag="verbs-1"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
