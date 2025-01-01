"use client";

import React, { useState } from "react";
import {
  useDrag,
  useDrop,
  DndProvider,
  DragSourceMonitor,
  DropTargetMonitor,
} from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface WordType {
  id: string;
  content: string;
  fromWordBank?: boolean;
  fromBlankIndex?: number;
}

interface TextSentenceItem {
  id: string;
  type: "text";
  content: string | null;
}

interface BlankSentenceItem {
  id: string;
  type: "blank";
  content: WordType | null;
  correctWordId: string;
  isCorrect: boolean;
}

type SentenceItem = TextSentenceItem | BlankSentenceItem;

interface WordProps {
  word: WordType;
}

interface BlankProps {
  index: number;
  blank: BlankSentenceItem;
  onDropWord: (word: WordType, blankIndex: number) => void;
  onReturnWordToBank: (word: WordType, blankIndex: number) => void;
}

function Word({ word }: WordProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "WORD",
    item: { ...word, fromWordBank: true },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <span
      ref={(node) => {
        if (node) drag(node);
      }}
      className={`inline-block p-2 m-1 border border-black rounded cursor-move bg-gray-200 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {word.content}
    </span>
  );
}

function Blank({ index, blank, onDropWord, onReturnWordToBank }: BlankProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "WORD",
    drop: (item: WordType) => onDropWord(item, index),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: "WORD",
    item: blank.content ? { ...blank.content, fromBlankIndex: index } : {},
    canDrag: !!blank.content,
    end: (item: unknown, monitor: DragSourceMonitor) => {
      if (!monitor.didDrop() && blank.content) {
        onReturnWordToBank(blank.content, index);
      }
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getBackgroundColor = () => {
    if (!blank.content) return "bg-white";
    return blank.isCorrect ? "bg-green-200" : "bg-red-200";
  };

  return (
    <span
      ref={(node) => {
        if (node) drop(node);
      }}
      className={`relative inline-block w-20 min-h-[30px] mx-1 mb-2 text-center border-b-2 border-black ${
        isOver ? "bg-gray-200" : "bg-white"
      }`}
    >
      {blank.content ? (
        <span
          ref={(node) => {
            if (node) drag(node);
          }}
          className={`inline-block p-2 cursor-move rounded ${getBackgroundColor()} ${
            isDragging ? "opacity-50" : "opacity-100"
          }`}
        >
          {blank.content.content}
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </span>
  );
}

function GrammarExercise() {
  // const initialSentence: SentenceItem[] = [
  //   { id: 'word-1', type: 'text', content: 'The' },
  //   { id: 'word-2', type: 'text', content: 'cat' },
  //   {
  //     id: 'blank-1',
  //     type: 'blank',
  //     content: null,
  //     correctWordId: 'bank-word-1',
  //     isCorrect: false,
  //   },
  //   { id: 'word-3', type: 'text', content: 'over' },
  //   { id: 'word-4', type: 'text', content: 'the' },
  //   {
  //     id: 'blank-2',
  //     type: 'blank',
  //     content: null,
  //     correctWordId: 'bank-word-4',
  //     isCorrect: false,
  //   },
  //   { id: 'word-5', type: 'text', content: '.' },
  // ];

  // const initialWordBank: WordType[] = [
  //   { id: 'bank-word-1', content: 'jumped' },
  //   { id: 'bank-word-2', content: 'moon' },
  //   { id: 'bank-word-3', content: 'slept' },
  //   { id: 'bank-word-4', content: 'dog' },
  // ];

  // Grammar Exercise Payload
  // ------------------------
  const initialSentence: SentenceItem[] = [
    {
      id: "word-1",
      type: "text",
      content: "日本で生活を始めてから、毎朝早起き",
    },
    {
      id: "blank-1",
      type: "blank",
      content: null,
      correctWordId: "bank-word-1",
      isCorrect: false,
    },
    { id: "word-2", type: "text", content: "。それは" },
    {
      id: "blank-2",
      type: "blank",
      content: null,
      correctWordId: "bank-word-2",
      isCorrect: false,
    },
    { id: "word-3", type: "text", content: "仕事に遅れない" },
    {
      id: "blank-3",
      type: "blank",
      content: null,
      correctWordId: "bank-word-3",
      isCorrect: false,
    },
    {
      id: "word-4",
      type: "text",
      content: "、前の日に早く寝るようにしているからだ。",
    },
  ];

  const initialWordBank: WordType[] = [
    { id: "bank-word-1", content: "するようになった" },
    { id: "bank-word-2", content: "決して" },
    { id: "bank-word-3", content: "ように" },
    { id: "bank-word-4", content: "ために" },
    { id: "bank-word-5", content: "なるべく" },
    { id: "bank-word-6", content: "わざと" },
  ];

  const [sentence, setSentence] = useState<SentenceItem[]>(initialSentence);
  const [wordBank, setWordBank] = useState<WordType[]>(initialWordBank);

  const onDropWord = (word: WordType, blankIndex: number) => {
    const newSentence = [...sentence];
    const newWordBank = [...wordBank];

    // Remove the word from its original location
    if (word.fromWordBank) {
      const wordBankIndex = newWordBank.findIndex((w) => w.id === word.id);
      if (wordBankIndex !== -1) {
        newWordBank.splice(wordBankIndex, 1);
      }
    } else if (typeof word.fromBlankIndex === "number") {
      const prevItem = newSentence[word.fromBlankIndex];
      if (prevItem.type === "blank") {
        newSentence[word.fromBlankIndex] = {
          ...prevItem,
          content: null,
          isCorrect: false,
        };
      }
    }

    const targetItem = newSentence[blankIndex];
    if (targetItem.type !== "blank") {
      // It's not a blank item, so we can't drop a word here (shouldn't happen)
      return;
    }

    // Now we know targetItem is a BlankSentenceItem
    const targetBlank = targetItem as BlankSentenceItem;

    // If there's already content in the blank, return it to the word bank
    if (targetBlank.content) {
      newWordBank.push(targetBlank.content);
    }

    // Check correctness
    const isCorrect = word.id === targetBlank.correctWordId;

    // Update the blank with the dropped word
    newSentence[blankIndex] = {
      ...targetBlank,
      content: { id: word.id, content: word.content },
      isCorrect: isCorrect,
    };

    setSentence(newSentence);
    setWordBank(newWordBank);
  };

  const onReturnWordToBank = (word: WordType, blankIndex: number) => {
    setSentence((prevSentence) =>
      prevSentence.map((item, idx) => {
        if (idx === blankIndex && item.type === "blank") {
          return {
            ...item,
            content: null,
            isCorrect: false,
          } as BlankSentenceItem;
        }
        return item;
      })
    );
    setWordBank((prevWordBank) => [...prevWordBank, word]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-xl font-bold mb-4">Grammar Exercise</h2>
        <div className="flex flex-wrap items-center mb-5">
          {sentence.map((item, index) => {
            if (item.type === "text") {
              return (
                <span key={item.id} className="mx-1">
                  {item.content}
                </span>
              );
            } else if (item.type === "blank") {
              // Here item is BlankSentenceItem, safe to pass to Blank
              return (
                <Blank
                  key={item.id}
                  index={index}
                  blank={item}
                  onDropWord={onDropWord}
                  onReturnWordToBank={onReturnWordToBank}
                />
              );
            }
            return null;
          })}
        </div>

        <h3 className="text-lg font-semibold mb-2">Word Bank</h3>
        <div className="flex flex-wrap">
          {wordBank.map((word) => (
            <Word key={word.id} word={word} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default GrammarExercise;
