"use client";

//import KanjiQuiz from "@/components/KanjiQuiz";

export default function KanjiQuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <KanjiQuiz />
    </main>
  );
}



// ---------------------

//"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
//import { kanjiQuizData, KanjiQuestion } from "@/data/kanjiQuiz";

const KanjiQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion: KanjiQuestion = kanjiQuizData[currentIndex];

  function handleAnswer(option: string) {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
  }

  function nextQuestion() {
    setSelectedOption(null);
    setIsAnswered(false);
    setCurrentIndex((prev) => (prev + 1) % kanjiQuizData.length);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Which kanji matches?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold text-center mb-4">
            {currentQuestion.kanji}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Popover key={index}>
                <PopoverTrigger asChild>
                  <Button
                    variant={
                      isAnswered
                        ? option.kanji === currentQuestion.correct
                          ? "default" // Correct answer
                          : option.kanji === selectedOption
                          ? "destructive" // Wrong selection
                          : "outline" // Other options
                        : "outline"
                    }
                    onClick={() => handleAnswer(option.kanji)}
                    disabled={isAnswered}
                  >
                    {option.kanji}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <p>
                    <strong>Reading:</strong> {option.reading}
                  </p>
                  <p>
                    <strong>Meaning:</strong> {option.meaning}
                  </p>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </CardContent>
      </Card>
      {isAnswered && <Button onClick={nextQuestion}>Next Question</Button>}
    </div>
  );
};

//export default KanjiQuiz;




//export 
interface KanjiOption {
  kanji: string;
  reading: string;
  meaning: string;
}

//export 
interface KanjiQuestion {
  kanji: string;
  correct: string;
  options: KanjiOption[];
}

//export 
const kanjiQuizData: KanjiQuestion[] = [
  {
    kanji: "木",
    correct: "木",
    options: [
      { kanji: "木", reading: "き (ki)", meaning: "Tree" },
      { kanji: "本", reading: "ほん (hon)", meaning: "Book" },
      { kanji: "休", reading: "きゅう (kyuu)", meaning: "Rest" },
      { kanji: "林", reading: "はやし (hayashi)", meaning: "Forest" },
    ],
  },
  {
    kanji: "目",
    correct: "目",
    options: [
      { kanji: "目", reading: "め (me)", meaning: "Eye" },
      { kanji: "耳", reading: "みみ (mimi)", meaning: "Ear" },
      { kanji: "日", reading: "にち (nichi)", meaning: "Sun" },
      { kanji: "見", reading: "みる (miru)", meaning: "See" },
    ],
  },
  {
    kanji: "川",
    correct: "川",
    options: [
      { kanji: "川", reading: "かわ (kawa)", meaning: "River" },
      { kanji: "州", reading: "しゅう (shuu)", meaning: "State" },
      { kanji: "河", reading: "かわ (kawa)", meaning: "Stream" },
      { kanji: "巛", reading: "かわ (kawa)", meaning: "Riverbend" },
    ],
  },
];
