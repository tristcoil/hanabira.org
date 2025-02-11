"use client";

import useSWR from "swr";
import { FC, useState, useRef, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import ClosedFlashcard from "@/components/ClosedFlashcard";

/* -------------------------------------------------------------------
   Type Definitions
   ------------------------------------------------------------------- */
interface Example {
  jp: string;
  romaji: string;
  en: string;
  grammar_audio: string;
}

interface GrammarData {
  title: string;
  short_explanation: string;
  long_explanation: string;
  formation: string;
  examples: Example[];
  userId?: string;
  difficulty?: string;
  p_tag?: string;
  s_tag?: string;
  // Add additional fields if needed (e.g., _id, __v, etc.)
}

interface GrammarFlashcardModalProps {
  userId: string;
  collectionName: string; // likely "grammars"
  p_tag: string;
  s_tag: string;
}

/* -------------------------------------------------------------------
   GrammarFlashcardModal Component
   ------------------------------------------------------------------- */
const GrammarFlashcardModal: FC<GrammarFlashcardModalProps> = ({
  userId,
  collectionName,
  p_tag,
  s_tag,
}) => {
  /* ----------------- State & Refs ------------------ */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [shouldFetchData, setShouldFetchData] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  /* Construct the endpoint for combining dynamic user data with static grammar data */
  const apiUrl = `/f-api/v1/combine-flashcard-data-grammars?userId=${userId}&collectionName=${collectionName}&p_tag=${p_tag}&s_tag=${s_tag}`;

  /* SWR fetcher function */
  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      // For grammar data, the endpoint returns an array directly (no "words" key).
      .then((data) => data as GrammarData[]);

  /* Use SWR to fetch grammar data */
  const { data: grammarItems, error } = useSWR<GrammarData[]>(
    shouldFetchData ? apiUrl : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      onSuccess: () => setIsFetching(false),
      onError: () => setIsFetching(false),
    }
  );

  /* Current grammar item */
  const currentGrammar = grammarItems?.[currentIndex];

  /* -------------- Modal Controls -------------- */

  function closeModal() {
    setIsOpen(false);
    // Reset shouldFetchData so a fresh fetch occurs next time
    setShouldFetchData(false);
  }

  function openModal() {
    setIsOpen(true);
    setShouldFetchData(true);
    setIsFetching(true);
  }

  /* -------------- Flashcard Navigation -------------- */
  const handleNext = () => {
    saveFlashcardState();
    if (!grammarItems) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === grammarItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    saveFlashcardState();
    if (!grammarItems) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? grammarItems.length - 1 : prevIndex - 1
    );
  };

  /* -------------- Difficulty ---------------- */
  const handleDifficultySelection = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
  };

  /* -------------- Persist Flashcard State -------------- */

  const saveFlashcardState = async () => {
    // Only attempt to save if we have a difficulty selected and a current grammar item
    if (!userId || !currentGrammar || !difficulty) return;

    try {
      // If the static doc has its own s_tag, use it; otherwise, fallback to the s_tag from props.
      const grammar_s_tag = currentGrammar.s_tag ?? s_tag;
      const grammar_p_tag = currentGrammar.p_tag ?? p_tag;

      await axios.post(`/f-api/v1/flashcard`, {
        userId: userId,
        difficulty,
        collectionName: collectionName,
        title: currentGrammar.title,
        p_tag: grammar_p_tag,
        s_tag: grammar_s_tag,
      });
    } catch (error) {
      console.log("Failed to store grammar flashcard state:", error);
    } finally {
      setDifficulty(null);
    }
  };

  /* -------------- Rendering -------------- */
  if (error) return <div>Failed to load grammar data.</div>;

  if (!isOpen) {
    return (
      <ClosedFlashcard
        p_tag={p_tag}
        s_tag={s_tag}
        badgeText="Grammar"
        badgeColor="bg-blue-100 text-blue-800" // Specify badge color here
        description="Explore essential Japanese grammar interactively."
        openModal={openModal}
        buttonText="Open Flashcard"
      />
    );
  }

  // If the modal is open but data is still fetching:
  if (isFetching || !grammarItems) return <div>Loading grammar data...</div>;

  // If no grammar items were found
  if (grammarItems.length === 0) {
    return (
      <div>
        <button onClick={() => setIsOpen(false)}>Close</button>
        <p>
          No grammar items found for {p_tag} / {s_tag}
        </p>
      </div>
    );
  }

  // Current grammar item must exist at this point
  if (!currentGrammar) {
    return <div>Loading current grammar card...</div>;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        open={isOpen}
        onClose={() => {}}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-40"
            onClick={closeModal}
          />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel
                className="relative w-full max-w-3xl transform overflow-hidden rounded-xl bg-blue-50 p-6 shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button (top-right corner) */}
                <button
                  onClick={closeModal}
                  className="absolute right-3 top-3 text-sm font-semibold text-gray-600 transition hover:text-gray-800 focus:outline-none"
                >
                  ✕
                </button>

                {/* Card Content */}
                <div className="flex flex-col items-center space-y-6 mt-4">
                  {/* Title & Short Explanation */}
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {currentGrammar.title}
                    </h2>
                    <p className="mt-2 text-sm italic text-gray-600">
                      {currentGrammar.short_explanation}
                    </p>
                  </div>

                  {/* Formation */}
                  <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Formation
                    </h3>
                    <p className="mt-1 text-gray-700">
                      {currentGrammar.formation}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Details
                    </h3>
                    <p className="mt-1 text-gray-700">
                      {currentGrammar.long_explanation}
                    </p>
                  </div>

                  {/* Examples */}
                  <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-sm">
                    <ExampleSection examples={currentGrammar.examples} />
                  </div>
                </div>

                {/* Bottom Section: Original "Previous–Difficulty–Next" Layout */}
                <div className="mt-8 flex justify-between items-center px-2 sm:px-4 w-full max-w-md mx-auto">
                  {/* Previous */}
                  <div className="flex flex-col items-center space-y-1 mr-4 sm:mr-8">
                    <span className="text-xs font-medium text-gray-700 mb-1">
                      Previous
                    </span>
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-blue-200 px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-300 shadow-md"
                      onClick={handlePrevious}
                    >
                      <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                    </button>
                  </div>

                  {/* Difficulty */}
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-xs font-semibold text-gray-700 mb-1">
                      Difficulty
                    </span>
                    <div className="flex space-x-2 sm:space-x-3">
                      {["easy", "medium", "hard"].map((level, idx) => {
                        const isActive = difficulty === level;
                        let colorClass =
                          "bg-gray-100 text-gray-800 hover:bg-gray-200";
                        if (isActive) {
                          if (level === "easy") {
                            colorClass =
                              "bg-blue-200 text-blue-900 hover:bg-blue-300";
                          } else if (level === "medium") {
                            colorClass =
                              "bg-yellow-200 text-yellow-900 hover:bg-yellow-300";
                          } else {
                            colorClass =
                              "bg-red-200 text-red-900 hover:bg-red-300";
                          }
                        }
                        return (
                          <button
                            key={idx}
                            className={`py-2 px-4 rounded-md text-sm font-semibold transition duration-200 ease-in-out shadow-md ${colorClass}`}
                            onClick={() => handleDifficultySelection(level)}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Next */}
                  <div className="flex flex-col items-center space-y-1 ml-4 sm:ml-8">
                    <span className="text-xs font-medium text-gray-700 mb-1">
                      Next
                    </span>
                    <button
                      className="inline-flex items-center justify-center rounded-md bg-blue-200 px-3 py-2 text-sm font-medium text-blue-900 transition hover:bg-blue-300 shadow-md"
                      onClick={handleNext}
                    >
                      <FontAwesomeIcon icon={faArrowRight} size="lg" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default GrammarFlashcardModal;

/* -------------------------------------------------------------------
 ExampleSection - displays the grammar examples (jp, romaji, en)
 ------------------------------------------------------------------- */
interface ExampleSectionProps {
  examples: Example[];
}

const ExampleSection: FC<ExampleSectionProps> = ({ examples }) => {
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});

  const toggleOpenState = (index: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const playExampleAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h4 className="mb-2 text-lg font-semibold text-gray-800">
        Example Sentence(s)
      </h4>
      {examples.map((ex, i) => (
        <div
          key={i}
          className="rounded-md border border-gray-200 bg-blue-50 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {/* JP Sentence */}
            <div className="text-md font-semibold text-gray-800">{ex.jp}</div>

            {/* Audio + expand button */}
            <div className="flex items-center space-x-3">
              <button onClick={() => playExampleAudio(ex.grammar_audio)}>
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  className="h-5 w-5 text-gray-600 hover:text-gray-800"
                />
              </button>
              <button onClick={() => toggleOpenState(i)}>
                {openStates[i] ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                )}
              </button>
            </div>
          </div>

          {/* Romaji & English */}
          {openStates[i] && (
            <div className="mt-2 space-y-1 text-sm">
              <div className="text-gray-700">{ex.romaji}</div>
              <div className="italic text-gray-600">{ex.en}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
