"use client";

import useSWR from "swr";
import { FC, useState, useRef, Fragment } from "react";
import { useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react"; // https://headlessui.com/react/dialog
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

interface Question {
  vocabulary_japanese: string;
  vocabulary_simplified: string;
  vocabulary_english: string;
  vocabulary_audio: string;
  word_type: string; // Optional, if you want to display the type of word (e.g., Verb)
  sentences: Array<{
    sentence_japanese: string;
    sentence_simplified?: string; // Optional if you sometimes have simplified versions
    sentence_romaji: string;
    sentence_english: string;
    sentence_audio: string;
    sentence_picture?: string; // Optional, if you have pictures for some sentences
  }>;
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

  let apiUrl;

  // Adjust URLs based on the presence of userId
  if (userId) {
    apiUrl = `/f-api/v1/combine-flashcard-data-${collectionName}?userId=${userId}&collectionName=${collectionName}&p_tag=${p_tag}&s_tag=${s_tag}`;
  } else {
    apiUrl = `/api/v1/${collectionName}?p_tag=${p_tag}&s_tag=${s_tag}`;
  }


  const fetcher = (url: string) =>
    fetch(url)
      .then((res) => res.json())
      .then((data) => data.words); // Extract the words array from the response

  //const { data: questions, error } = useSWR<Question[]>(apiUrl, fetcher);
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
        console.log("mocking saving post call");
        //await axios.post(`${baseUrl}/f-api/v1/flashcard`, {
        await axios.post(`/f-api/v1/flashcard`, {
          userId: userId,
          difficulty,
          collectionName: collectionName,
          vocabulary_japanese: currentQuestion.vocabulary_japanese,
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
        "saveFlashcardState: Insufficient data provided (missing difficulty or currentQuestion, userId)."
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

  const playVocabularyAudio = () => {
    if (currentQuestion && currentQuestion.vocabulary_audio) {
      // Ensure currentQuestion and its vocabulary_audio property are defined
      const audio = new Audio(currentQuestion.vocabulary_audio);
      audio.play();
    } else {
      // Handle the case where currentQuestion or vocabulary_audio is not available
      console.log("Audio URL is missing or the current question is undefined.");
      // Optionally, you might want to alert the user or handle this case more gracefully
    }
  };

  const playSentenceAudio = (audioUrl: string): void => {
    const audio = new Audio(audioUrl);
    audio.play();
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

  if (!isOpen)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden m-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl flex flex-row justify-between items-center text-center sm:text-left">
        <div className="p-4 flex-grow">
          <div className="text-xs sm:text-sm md:text-md lg:text-lg font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {p_tag}
          </div>

          <a
            href="/japanese/flashcards-kanji/#"
            className="block mt-1 text-xs sm:text-sm md:text-md leading-tight font-semibold text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400"
            aria-label={`Kanji with one reading ${s_tag}`}
          >
            Essential vocabulary {s_tag}
          </a>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Explore essential Japanese vocabulary interactively.
          </p>
          <div className="mt-2">
            <button
              type="button"
              onClick={openModal}
              className="inline-flex justify-center items-center rounded-md bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-gray-800 dark:text-gray-300 text-xs sm:text-sm px-3 py-1.5 transition-colors duration-150"
            >
              Open flashcard
            </button>
          </div>
        </div>
      </div>
    );

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
          onClose={() => { }}
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
                    {/* -------------------- card content ------------------- */}
                    <div className="dark:bg-gray-800 bg-white rounded-lg shadow-md p-8 w-full max-w-2xl flex flex-col z-50">
                      {/* Vocabulary Section */}

                      <div className="mb-8">
                        {" "}
                        {/* Maintains margin-bottom */}
                        {/* Flex container to align play button to the left and vocabulary details centered */}
                        <div className="flex justify-start items-center space-x-4 w-full">
                          {/* Play Button */}
                          <button
                            onClick={playVocabularyAudio}
                            className="flex-shrink-0"
                          >
                            <FontAwesomeIcon
                              icon={faPlayCircle}
                              className="w-8 h-8 text-gray-800 dark:text-white"
                            />
                          </button>

                          {/* Container for vocabulary details to center them except for the button */}
                          <div className="flex-grow text-center">
                            {/* vocabulary_simplified above vocabulary_japanese */}
                            <div className="text-2xl font-bold dark:text-white text-gray-800">
                              {currentQuestion.vocabulary_simplified}
                            </div>
                            {/* vocabulary_japanese in the middle */}
                            <span className="text-6xl font-bold dark:text-gray-200 text-gray-600 block">
                              {currentQuestion.vocabulary_japanese}
                            </span>
                            {/* vocabulary_english below vocabulary_japanese */}
                            <div className="text-xl dark:text-gray-300 text-gray-600">
                              {currentQuestion.vocabulary_english}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Adaptive Sentences Section */}
                      <SentenceSection sentences={currentQuestion.sentences} />
                      {/* End of Adaptive Sentences Section */}
                    </div>

                    {/* -------------------- end of card content ------------------- */}

                    {/* ---------------- card nav buttons ------------------- */}
                    <div className="flex justify-between items-center mt-12 px-2 sm:px-4">
                      <div className="flex flex-col items-center space-y-1 mr-4 sm:mr-8">
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
                          {["easy", "medium", "hard"].map((level, idx) => (
                            <button
                              key={idx}
                              className={`py-1 px-2 sm:py-3 sm:px-6 rounded-md font-semibold text-xs sm:text-sm transition duration-200 ease-in-out shadow-md
          ${difficulty === level
                                  ? level === "easy"
                                    ? "bg-green-500 hover:bg-green-600 text-white"
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

interface Sentence {
  sentence_japanese: string;
  sentence_romaji: string;
  sentence_english: string;
  sentence_audio: string;
}

interface SentenceSectionProps {
  sentences: Sentence[];
}

const SentenceSection: React.FC<SentenceSectionProps> = ({ sentences }) => {
  const [visibleSentences, setVisibleSentences] = useState<Sentence[]>(
    sentences.slice(0, 2)
  );
  const [openStates, setOpenStates] = useState<{ [key: number]: boolean }>({});

  // Function to toggle sentence detail visibility
  const toggleOpenState = (index: number) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Function to play sentence audio
  const playSentenceAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  useEffect(() => {
    const handleResize = () => {
      // Show only up to 2 sentences on small screens, more on larger screens
      const newSize = window.innerWidth < 640 ? 2 : sentences.length;
      setVisibleSentences(sentences.slice(0, newSize));
    };

    // Call resize function initially and on every window resize
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sentences]); // Depend on `sentences` so it updates if the sentences prop changes

  return (
    <div className="text-center space-y-6">
      <div className="py-6 space-y-4">
        {/* Header for "Example Sentence(s):" */}
        <div className="text-base font-semibold dark:text-gray-200 text-gray-700">
          Example Sentence(s):
        </div>
        {visibleSentences.map((sentence, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center space-x-2">
              {/* Play Button for Sentence Audio */}
              <button
                onClick={() => playSentenceAudio(sentence.sentence_audio)}
                className="flex-shrink-0"
                aria-label="Play Sentence Audio"
              >
                <FontAwesomeIcon
                  icon={faPlayCircle}
                  className="w-5 h-5 text-gray-800 dark:text-white"
                />
              </button>
              {/* Sentence Text and Toggle Button */}
              <div className="flex-grow flex justify-between items-center">
                <div className="text-lg dark:text-white text-gray-800">
                  {sentence.sentence_japanese}
                </div>
                <button
                  onClick={() => toggleOpenState(index)}
                  className="flex-shrink-0"
                >
                  {openStates[index] ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Conditional rendering for Sentence Details */}
            {openStates[index] && (
              <div className="space-y-1 text-left">
                <div className="text-sm dark:text-gray-200 text-gray-700">
                  {sentence.sentence_romaji}
                </div>
                <div className="text-md italic dark:text-gray-400 text-gray-600">
                  {sentence.sentence_english}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
