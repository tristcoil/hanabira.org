"use client";




// pages/quiz.tsx
//import JapaneseQuiz from "@/components/JapaneseQuiz";

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <JapaneseQuiz />
    </main>
  );
}


// ----------------------------------------------- //


// components/JapaneseQuiz.tsx
//"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { vocabulary } from "@/data/vocabulary";

//export default 
function JapaneseQuiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentWord = vocabulary[currentIndex];
  const shuffledOptions = shuffleArray([
    currentWord.english,
    ...getRandomOptions(vocabulary, currentWord.english),
  ]);

  function handleAnswer(option: string) {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    if (option === currentWord.english) {
      setScore((prev) => prev + 1);
    }
  }

  function nextQuestion() {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % vocabulary.length);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>What does this mean?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-center mb-4">
            {currentWord.japanese}
          </div>
          <div className="flex flex-col gap-2">
            {shuffledOptions.map((option, index) => (
              <Button
                key={index}
                variant={
                  isAnswered
                    ? option === currentWord.english
                      ? "default"
                      : option === selectedAnswer
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="text-lg font-medium">Score: {score}</div>
      <Button onClick={nextQuestion} disabled={!isAnswered}>
        Next Question
      </Button>
    </div>
  );
}

// Utility to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Utility to get random English options
function getRandomOptions(
  vocab: { japanese: string; english: string }[],
  exclude: string
): string[] {
  const filtered = vocab.filter((word) => word.english !== exclude);
  const randomWords = shuffleArray(filtered).slice(0, 3); // Get 3 random words
  return randomWords.map((word) => word.english); // Extract only the `english` field
}




// ------------------------------ 

// data/vocabulary.ts
//export 
const vocabulary = [
  { japanese: "猫", english: "Cat" },
  { japanese: "犬", english: "Dog" },
  { japanese: "本", english: "Book" },
  { japanese: "学校", english: "School" },
  { japanese: "先生", english: "Teacher" },
];


