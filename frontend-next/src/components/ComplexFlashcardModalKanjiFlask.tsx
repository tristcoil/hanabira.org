"use client";

import useSWR from "swr";
import { FC, useState, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react"; // https://headlessui.com/react/dialog
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import ClosedFlashcard from "@/components/ClosedFlashcard";


interface Question {
  _id: string;
  audio: string;
  difficulty: string;
  exampleReading: string;
  exampleWord: string;
  k_audio: string;
  kanji: string;
  p_tag: string;
  reading: string;
  s_tag: string;
  translation: string;
  userEmail: string;
  userId: string;
}

interface ComplexFlashcardProps {
  questions: Question[];
}

interface ComplexFlashcardModalProps {
  userId: string;
  collectionName: string;
  p_tag: string;
  s_tag: string;
}

const ComplexFlashcardModal: FC<ComplexFlashcardModalProps> = ({
  userId,
  collectionName,
  p_tag,
  s_tag,
}) => {
  const [count, setCount] = useState<number>(0);
  let [isOpen, setIsOpen] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // To track fetching status

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);

  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());

  // --------------------------------------------------------------------------------------------------------------------------------

  let apiUrl;

  // Adjust URLs based on the presence of userId
  if (userId) {
    apiUrl = `/f-api/v1/combine-flashcard-data-${collectionName}?userId=${userId}&collectionName=${collectionName}&p_tag=${p_tag}&s_tag=${s_tag}`;
  } else {
    apiUrl = `/e-api/v1/${collectionName}?p_tag=${p_tag}&s_tag=${s_tag}`;
  }

  // --------------------------------------------------------------------------------------------------------------------------------

  //const { data: questions, error } = useSWR<Question[]>(apiUrl, fetcher);

  // `enabled: shouldFetchData` controls when the SWR hook fetches data
  //const { data: questions, error } = useSWR<Question[]>(shouldFetchData ? apiUrl : null, fetcher);

  const { data: questions, error } = useSWR<Question[]>(
    shouldFetchData ? apiUrl : null,
    fetcher,
    {
      revalidateOnFocus: false, // Disable revalidation on window focus
      revalidateOnReconnect: false, // Disable revalidation on network reconnect
      refreshInterval: 0, // Disable automatic revalidation with an interval
      onSuccess: () => setIsFetching(false), // Set fetching to false when data is successfully fetched
      onError: () => setIsFetching(false),
    }
  );

  console.log(questions);

  const currentQuestion = questions?.[currentQuestionIndex];

  console.log("------------------------------------------");
  console.log(currentQuestion);

  const [isFlipped, setIsFlipped] = useState(false); // State to track card flip

  // ... existing function declarations

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Function to save flashcard state to the backend
  const saveFlashcardState = async () => {
    // Ensure userId exists before proceeding
    if (!userId) {
      console.error("saveFlashcardState: No userId provided.");
      return; // Exit the function early if userId is not provided
    }

    if (difficulty && currentQuestion && userId) {
      try {
        console.log("mocking saving post call for userId");
        //await axios.post(`${baseUrl}/f-api/v1/flashcard`, {
        await axios.post(`/f-api/v1/flashcard`, {
          userId: userId,
          difficulty,
          collectionName: collectionName,
          kanji: currentQuestion.kanji,
          p_tag,
          s_tag,
        });
      } catch (error) {
        console.log("Failed to store flashcard state:", error);
      } finally {
        setDifficulty(null);
      }
    } else {
      // Log a message if the conditions for making the POST request are not met
      console.log(
        "saveFlashcardState: Insufficient data provided (missing difficulty or currentQuestion)."
      );
    }
  };

  const handleNextQuestion = () => {
    //if (difficulty && questions) { // Ensure questions is defined
    if (questions) {
      // Ensure questions is defined, lets iterate freely without setting difficulty
      // Only save state if difficulty is set
      saveFlashcardState();
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === questions.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePreviousQuestion = () => {
    if (difficulty && questions) {
      // Only save state if difficulty is set and questions are defined
      saveFlashcardState();
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === 0 ? questions.length - 1 : prevIndex - 1
      );
    } else if (questions) {
      // If only questions are defined but no difficulty is set, still allow navigating questions
      setCurrentQuestionIndex((prevIndex) =>
        prevIndex === 0 ? questions.length - 1 : prevIndex - 1
      );
    }
    // If questions are undefined, this function effectively does nothing,
    // as there are no questions to navigate between.
  };

  // -------------------------------------------------------------

  const handleDifficultySelection = (selectedDifficulty: string) => {
    setDifficulty(selectedDifficulty);
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const playKanjiAudio = () => {
    if (currentQuestion && currentQuestion.k_audio) {
      // Ensure currentQuestion and its k_audio property are defined
      const audio = new Audio(currentQuestion.k_audio);
      audio.play();
    } else {
      // Handle the case where currentQuestion or k_audio is not available
      console.log("Audio URL is missing or the current question is undefined.");
      // Optionally, you might want to alert the user or handle this case more gracefully
    }
  };

  function closeModal() {
    setIsOpen(false);
    // Optionally reset `shouldFetchData` here if you want to refetch data every time the modal opens
    setShouldFetchData(false);
  }

  function openModal() {
    setIsOpen(true);
    setShouldFetchData(true);
    setIsFetching(true); // Start fetching data
  }

  // ------------------------------------------------------------------------

  if (error) return <div>Failed to load</div>;

  // if (!isOpen)
  //   return (
  //     <div className=" p-2 bg-white dark:bg-gray-800 rounded-lg shadow transition-shadow duration-300 ease-in-out hover:shadow-xl">
  //       <div className="text-sm md:text-md lg:text-lg font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
  //         Level: {p_tag}
  //       </div>
  //       <p>Kanji with one reading {s_tag}</p>
  //       <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
  //         Explore the kanji readings interactively.
  //       </p>
  //       <button
  //         type="button"
  //         onClick={openModal}
  //         className="mt-2 inline-flex items-center justify-center rounded-md bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 dark:focus:ring-gray-600 text-gray-800 dark:text-gray-300 text-sm px-3 py-1.5 transition-colors duration-150"
  //       >
  //         Open flashcard
  //       </button>
  //     </div>
  //   );


    if (!isOpen) {
      return (
        <ClosedFlashcard
          p_tag={p_tag}
          s_tag={s_tag}
          badgeText="Kanji"
          badgeColor="bg-rose-100 text-rose-800" // Specify badge color here
          description="Explore kanji readings."
          openModal={openModal}
          buttonText="Open Flashcard"
        />
      );
    }














  if (!questions || questions.length === 0) return <div>Loading...</div>; // Ensure questions is loaded and has data

  if (!currentQuestion) {
    // Render a loading state or nothing until the data is available
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          open={isOpen}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsOpen(false)}
            />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 z-50">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 scale-95"
              >
                <Dialog.Panel
                  className="bg-blue-100 relative transform w-11/12 h-5/6 overflow-hidden rounded-lg bg-white p-8 text-left shadow-xl transition-all text-gray-900 dark:bg-gray-800 dark:text-white z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-6 space-y-6 z-50">
                    <div className="dark:bg-gray-800 bg-white rounded-lg shadow-md p-8 w-full max-w-2xl flex z-50">
                      <div className="flex-1 flex justify-center items-center">
                        <span className="text-9xl font-bold dark:text-gray-200 text-gray-600 font-noto-sans-jp">
                          {currentQuestion.kanji}
                        </span>
                      </div>

                      {/* Card Content Section (1/2 of the width) */}
                      <div className="flex-1 text-center space-y-6">
                        <div className="space-y-4">
                          <div className="text-4xl font-bold flex items-center justify-center space-x-2">
                            <span className="dark:text-white text-gray-800">
                              {currentQuestion.kanji}
                            </span>{" "}
                            {/* Small Kanji */}
                            <button
                              onClick={playKanjiAudio}
                              className="focus:outline-none dark:text-gray-300 text-gray-500 hover:dark:text-gray-200 hover:text-gray-600"
                            >
                              <FontAwesomeIcon icon={faPlayCircle} size="xs" />
                            </button>
                          </div>
                          <div className="text-xl dark:text-gray-300 text-gray-600">
                            {currentQuestion.reading}
                          </div>
                        </div>

                        <div className="border-t border-b border-gray-300 py-6 space-y-4">
                          <div className="text-base font-semibold dark:text-gray-200 text-gray-700">
                            Example:
                          </div>
                          <div className="text-xl flex items-center justify-center space-x-2">
                            <span className="text-2xl dark:text-white text-gray-800">
                              {currentQuestion.exampleWord}
                            </span>
                            <button
                              onClick={handlePlayAudio}
                              className="focus:outline-none dark:text-gray-300 text-gray-500 hover:dark:text-gray-200 hover:text-gray-600"
                            >
                              <FontAwesomeIcon icon={faPlayCircle} size="lg" />
                            </button>
                          </div>
                          <audio
                            ref={audioRef}
                            src={currentQuestion.audio}
                            preload="auto"
                          ></audio>
                          <div className="text-base dark:text-gray-200 text-gray-700">
                            {currentQuestion.exampleReading}
                          </div>
                          <div className="text-lg italic dark:text-gray-400 text-gray-600">
                            {currentQuestion.translation}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-12 px-2 sm:px-4">
                      {/* Reduced horizontal padding for the main container on smaller screens */}
                      <div className="flex flex-col items-center space-y-1 mr-4 sm:mr-8">
                        {/* Reduced right margin for smaller screens */}
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          Previous
                        </span>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:py-3 sm:px-6 rounded-md shadow-lg transition duration-200 ease-in-out"
                          onClick={handlePreviousQuestion}
                        >
                          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center">
                        <span className="text-xs font-semibold text-gray-700 mb-1">
                          Select Difficulty
                        </span>
                        <div className="flex space-x-2 sm:space-x-3">
                          {/* Reduced space between buttons on smaller screens */}
                          {["easy", "medium", "hard"].map((level, idx) => (
                            <button
                              key={idx}
                              className={`py-1 px-2 sm:py-3 sm:px-6 rounded-md font-semibold text-xs sm:text-sm transition duration-200 ease-in-out shadow-md
          ${
            difficulty === level
              ? level === "easy"
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : level === "medium"
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-gray-800"
          }`}
                              onClick={() => handleDifficultySelection(level)}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center space-y-1 ml-4 sm:ml-8">
                        {/* Reduced left margin for smaller screens */}
                        <span className="text-xs font-medium text-gray-700 mb-1">
                          Next
                        </span>
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 sm:py-3 sm:px-6 rounded-md shadow-lg transition duration-200 ease-in-out"
                          onClick={handleNextQuestion}
                        >
                          <FontAwesomeIcon icon={faArrowRight} size="lg" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full max-w-xs justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus-visible:ring focus-visible:ring-indigo-600"
                    >
                      Close Flashcard
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

export default ComplexFlashcardModal;
