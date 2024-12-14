"use client";

import Link from "next/link";
import React from "react";

//import { useState } from "react";

export default function Home() {
  // Define your hiragana characters and their romaji
  //   const hiragana = [
  //     { char: "あ", romaji: "a", audio: "/audio/japanese/kana/v_.mp3" },
  //     { char: "い", romaji: "i", audio: "/audio/japanese/kana/v_.mp3" },
  //     //... add all characters
  //   ];

  const hiragana = [
    { char: "あ", romaji: "a", audio: "/audio/japanese/kana/v_あ.mp3" },
    { char: "い", romaji: "i", audio: "/audio/japanese/kana/v_い.mp3" },
    { char: "う", romaji: "u", audio: "/audio/japanese/kana/v_う.mp3" },
    { char: "え", romaji: "e", audio: "/audio/japanese/kana/v_え.mp3" },
    { char: "お", romaji: "o", audio: "/audio/japanese/kana/v_お.mp3" },
    { char: "か", romaji: "ka", audio: "/audio/japanese/kana/v_か.mp3" },
    { char: "き", romaji: "ki", audio: "/audio/japanese/kana/v_き.mp3" },
    { char: "く", romaji: "ku", audio: "/audio/japanese/kana/v_く.mp3" },
    { char: "け", romaji: "ke", audio: "/audio/japanese/kana/v_け.mp3" },
    { char: "こ", romaji: "ko", audio: "/audio/japanese/kana/v_こ.mp3" },
    { char: "さ", romaji: "sa", audio: "/audio/japanese/kana/v_さ.mp3" },
    { char: "し", romaji: "shi", audio: "/audio/japanese/kana/v_し.mp3" },
    { char: "す", romaji: "su", audio: "/audio/japanese/kana/v_す.mp3" },
    { char: "せ", romaji: "se", audio: "/audio/japanese/kana/v_せ.mp3" },
    { char: "そ", romaji: "so", audio: "/audio/japanese/kana/v_そ.mp3" },
    { char: "た", romaji: "ta", audio: "/audio/japanese/kana/v_た.mp3" },
    { char: "ち", romaji: "chi", audio: "/audio/japanese/kana/v_ち.mp3" },
    { char: "つ", romaji: "tsu", audio: "/audio/japanese/kana/v_つ.mp3" },
    { char: "て", romaji: "te", audio: "/audio/japanese/kana/v_て.mp3" },
    { char: "と", romaji: "to", audio: "/audio/japanese/kana/v_と.mp3" },
    { char: "な", romaji: "na", audio: "/audio/japanese/kana/v_な.mp3" },
    { char: "に", romaji: "ni", audio: "/audio/japanese/kana/v_に.mp3" },
    { char: "ぬ", romaji: "nu", audio: "/audio/japanese/kana/v_ぬ.mp3" },
    { char: "ね", romaji: "ne", audio: "/audio/japanese/kana/v_ね.mp3" },
    { char: "の", romaji: "no", audio: "/audio/japanese/kana/v_の.mp3" },
    { char: "は", romaji: "ha", audio: "/audio/japanese/kana/v_は.mp3" },
    { char: "ひ", romaji: "hi", audio: "/audio/japanese/kana/v_ひ.mp3" },
    { char: "ふ", romaji: "fu", audio: "/audio/japanese/kana/v_ふ.mp3" },
    { char: "へ", romaji: "he", audio: "/audio/japanese/kana/v_へ.mp3" },
    { char: "ほ", romaji: "ho", audio: "/audio/japanese/kana/v_ほ.mp3" },
    { char: "ま", romaji: "ma", audio: "/audio/japanese/kana/v_ま.mp3" },
    { char: "み", romaji: "mi", audio: "/audio/japanese/kana/v_み.mp3" },
    { char: "む", romaji: "mu", audio: "/audio/japanese/kana/v_む.mp3" },
    { char: "め", romaji: "me", audio: "/audio/japanese/kana/v_め.mp3" },
    { char: "も", romaji: "mo", audio: "/audio/japanese/kana/v_も.mp3" },
    { char: "や", romaji: "ya", audio: "/audio/japanese/kana/v_や.mp3" },
    { char: "ゆ", romaji: "yu", audio: "/audio/japanese/kana/v_ゆ.mp3" },
    { char: "よ", romaji: "yo", audio: "/audio/japanese/kana/v_よ.mp3" },
    { char: "ら", romaji: "ra", audio: "/audio/japanese/kana/v_ら.mp3" },
    { char: "り", romaji: "ri", audio: "/audio/japanese/kana/v_り.mp3" },
    { char: "る", romaji: "ru", audio: "/audio/japanese/kana/v_る.mp3" },
    { char: "れ", romaji: "re", audio: "/audio/japanese/kana/v_れ.mp3" },
    { char: "ろ", romaji: "ro", audio: "/audio/japanese/kana/v_ろ.mp3" },
    { char: "わ", romaji: "wa", audio: "/audio/japanese/kana/v_わ.mp3" },
    { char: "を", romaji: "wo", audio: "/audio/japanese/kana/v_を.mp3" },
    { char: "ん", romaji: "n", audio: "/audio/japanese/kana/v_ん.mp3" },
    // Additional markers for voiced and plosive sounds
    { char: "が", romaji: "ga", audio: "/audio/japanese/kana/v_が.mp3" },
    { char: "ぎ", romaji: "gi", audio: "/audio/japanese/kana/v_ぎ.mp3" },
    { char: "ぐ", romaji: "gu", audio: "/audio/japanese/kana/v_ぐ.mp3" },
    { char: "げ", romaji: "ge", audio: "/audio/japanese/kana/v_げ.mp3" },
    { char: "ご", romaji: "go", audio: "/audio/japanese/kana/v_ご.mp3" },
    { char: "ざ", romaji: "za", audio: "/audio/japanese/kana/v_ざ.mp3" },
    { char: "じ", romaji: "ji", audio: "/audio/japanese/kana/v_じ.mp3" },
    { char: "ず", romaji: "zu", audio: "/audio/japanese/kana/v_ず.mp3" },
    { char: "ぜ", romaji: "ze", audio: "/audio/japanese/kana/v_ぜ.mp3" },
    { char: "ぞ", romaji: "zo", audio: "/audio/japanese/kana/v_ぞ.mp3" },
    { char: "だ", romaji: "da", audio: "/audio/japanese/kana/v_だ.mp3" },
    { char: "ぢ", romaji: "ji", audio: "/audio/japanese/kana/v_ぢ.mp3" },
    { char: "づ", romaji: "zu", audio: "/audio/japanese/kana/v_づ.mp3" },
    { char: "で", romaji: "de", audio: "/audio/japanese/kana/v_で.mp3" },
    { char: "ど", romaji: "do", audio: "/audio/japanese/kana/v_ど.mp3" },
    { char: "ば", romaji: "ba", audio: "/audio/japanese/kana/v_ば.mp3" },
    { char: "び", romaji: "bi", audio: "/audio/japanese/kana/v_び.mp3" },
    { char: "ぶ", romaji: "bu", audio: "/audio/japanese/kana/v_ぶ.mp3" },
    { char: "べ", romaji: "be", audio: "/audio/japanese/kana/v_べ.mp3" },
    { char: "ぼ", romaji: "bo", audio: "/audio/japanese/kana/v_ぼ.mp3" },
    { char: "ぱ", romaji: "pa", audio: "/audio/japanese/kana/v_ぱ.mp3" },
    { char: "ぴ", romaji: "pi", audio: "/audio/japanese/kana/v_ぴ.mp3" },
    { char: "ぷ", romaji: "pu", audio: "/audio/japanese/kana/v_ぷ.mp3" },
    { char: "ぺ", romaji: "pe", audio: "/audio/japanese/kana/v_ぺ.mp3" },
    { char: "ぽ", romaji: "po", audio: "/audio/japanese/kana/v_ぽ.mp3" },
  ];

  const katakana = [
    { char: "ア", romaji: "a", audio: "/audio/japanese/kana/v_ア.mp3" },
    { char: "イ", romaji: "i", audio: "/audio/japanese/kana/v_イ.mp3" },
    { char: "ウ", romaji: "u", audio: "/audio/japanese/kana/v_ウ.mp3" },
    { char: "エ", romaji: "e", audio: "/audio/japanese/kana/v_エ.mp3" },
    { char: "オ", romaji: "o", audio: "/audio/japanese/kana/v_オ.mp3" },
    { char: "カ", romaji: "ka", audio: "/audio/japanese/kana/v_カ.mp3" },
    { char: "キ", romaji: "ki", audio: "/audio/japanese/kana/v_キ.mp3" },
    { char: "ク", romaji: "ku", audio: "/audio/japanese/kana/v_ク.mp3" },
    { char: "ケ", romaji: "ke", audio: "/audio/japanese/kana/v_ケ.mp3" },
    { char: "コ", romaji: "ko", audio: "/audio/japanese/kana/v_コ.mp3" },
    { char: "サ", romaji: "sa", audio: "/audio/japanese/kana/v_サ.mp3" },
    { char: "シ", romaji: "shi", audio: "/audio/japanese/kana/v_シ.mp3" },
    { char: "ス", romaji: "su", audio: "/audio/japanese/kana/v_ス.mp3" },
    { char: "セ", romaji: "se", audio: "/audio/japanese/kana/v_セ.mp3" },
    { char: "ソ", romaji: "so", audio: "/audio/japanese/kana/v_ソ.mp3" },
    { char: "タ", romaji: "ta", audio: "/audio/japanese/kana/v_タ.mp3" },
    { char: "チ", romaji: "chi", audio: "/audio/japanese/kana/v_チ.mp3" },
    { char: "ツ", romaji: "tsu", audio: "/audio/japanese/kana/v_ツ.mp3" },
    { char: "テ", romaji: "te", audio: "/audio/japanese/kana/v_テ.mp3" },
    { char: "ト", romaji: "to", audio: "/audio/japanese/kana/v_ト.mp3" },
    { char: "ナ", romaji: "na", audio: "/audio/japanese/kana/v_ナ.mp3" },
    { char: "ニ", romaji: "ni", audio: "/audio/japanese/kana/v_ニ.mp3" },
    { char: "ヌ", romaji: "nu", audio: "/audio/japanese/kana/v_ヌ.mp3" },
    { char: "ネ", romaji: "ne", audio: "/audio/japanese/kana/v_ネ.mp3" },
    { char: "ノ", romaji: "no", audio: "/audio/japanese/kana/v_ノ.mp3" },
    { char: "ハ", romaji: "ha", audio: "/audio/japanese/kana/v_ハ.mp3" },
    { char: "ヒ", romaji: "hi", audio: "/audio/japanese/kana/v_ヒ.mp3" },
    { char: "フ", romaji: "fu", audio: "/audio/japanese/kana/v_フ.mp3" },
    { char: "ヘ", romaji: "he", audio: "/audio/japanese/kana/v_ヘ.mp3" },
    { char: "ホ", romaji: "ho", audio: "/audio/japanese/kana/v_ホ.mp3" },
    { char: "マ", romaji: "ma", audio: "/audio/japanese/kana/v_マ.mp3" },
    { char: "ミ", romaji: "mi", audio: "/audio/japanese/kana/v_ミ.mp3" },
    { char: "ム", romaji: "mu", audio: "/audio/japanese/kana/v_ム.mp3" },
    { char: "メ", romaji: "me", audio: "/audio/japanese/kana/v_メ.mp3" },
    { char: "モ", romaji: "mo", audio: "/audio/japanese/kana/v_モ.mp3" },
    { char: "ヤ", romaji: "ya", audio: "/audio/japanese/kana/v_ヤ.mp3" },
    { char: "ユ", romaji: "yu", audio: "/audio/japanese/kana/v_ユ.mp3" },
    { char: "ヨ", romaji: "yo", audio: "/audio/japanese/kana/v_ヨ.mp3" },
    { char: "ラ", romaji: "ra", audio: "/audio/japanese/kana/v_ラ.mp3" },
    { char: "リ", romaji: "ri", audio: "/audio/japanese/kana/v_リ.mp3" },
    { char: "ル", romaji: "ru", audio: "/audio/japanese/kana/v_ル.mp3" },
    { char: "レ", romaji: "re", audio: "/audio/japanese/kana/v_レ.mp3" },
    { char: "ロ", romaji: "ro", audio: "/audio/japanese/kana/v_ロ.mp3" },
    { char: "ワ", romaji: "wa", audio: "/audio/japanese/kana/v_ワ.mp3" },
    { char: "ヲ", romaji: "wo", audio: "/audio/japanese/kana/v_ヲ.mp3" },
    { char: "ン", romaji: "n", audio: "/audio/japanese/kana/v_ン.mp3" },
    // Additional markers for voiced and plosive sounds
    { char: "ガ", romaji: "ga", audio: "/audio/japanese/kana/v_ガ.mp3" },
    { char: "ギ", romaji: "gi", audio: "/audio/japanese/kana/v_ギ.mp3" },
    { char: "グ", romaji: "gu", audio: "/audio/japanese/kana/v_グ.mp3" },
    { char: "ゲ", romaji: "ge", audio: "/audio/japanese/kana/v_ゲ.mp3" },
    { char: "ゴ", romaji: "go", audio: "/audio/japanese/kana/v_ゴ.mp3" },
    { char: "ザ", romaji: "za", audio: "/audio/japanese/kana/v_ザ.mp3" },
    { char: "ジ", romaji: "ji", audio: "/audio/japanese/kana/v_ジ.mp3" },
    { char: "ズ", romaji: "zu", audio: "/audio/japanese/kana/v_ズ.mp3" },
    { char: "ゼ", romaji: "ze", audio: "/audio/japanese/kana/v_ゼ.mp3" },
    { char: "ゾ", romaji: "zo", audio: "/audio/japanese/kana/v_ゾ.mp3" },
    { char: "ダ", romaji: "da", audio: "/audio/japanese/kana/v_ダ.mp3" },
    { char: "ヂ", romaji: "ji", audio: "/audio/japanese/kana/v_ヂ.mp3" },
    { char: "ヅ", romaji: "zu", audio: "/audio/japanese/kana/v_ヅ.mp3" },
    { char: "デ", romaji: "de", audio: "/audio/japanese/kana/v_デ.mp3" },
    { char: "ド", romaji: "do", audio: "/audio/japanese/kana/v_ド.mp3" },
    { char: "バ", romaji: "ba", audio: "/audio/japanese/kana/v_バ.mp3" },
    { char: "ビ", romaji: "bi", audio: "/audio/japanese/kana/v_ビ.mp3" },
    { char: "ブ", romaji: "bu", audio: "/audio/japanese/kana/v_ブ.mp3" },
    { char: "ベ", romaji: "be", audio: "/audio/japanese/kana/v_ベ.mp3" },
    { char: "ボ", romaji: "bo", audio: "/audio/japanese/kana/v_ボ.mp3" },
    { char: "パ", romaji: "pa", audio: "/audio/japanese/kana/v_パ.mp3" },
    { char: "ピ", romaji: "pi", audio: "/audio/japanese/kana/v_ピ.mp3" },
    { char: "プ", romaji: "pu", audio: "/audio/japanese/kana/v_プ.mp3" },
    { char: "ペ", romaji: "pe", audio: "/audio/japanese/kana/v_ペ.mp3" },
    { char: "ポ", romaji: "po", audio: "/audio/japanese/kana/v_ポ.mp3" },
  ];

  interface HiraganaCardProps {
    char: string;
    romaji: string;
    audio: string;
  }

  const HiraganaCard: React.FC<HiraganaCardProps> = ({
    char,
    romaji,
    audio,
  }) => {
    // Function to play audio
    const playAudio = () => {
      const audioElement = new Audio(audio);
      audioElement.play();
    };

    return (
      <div className="w-16 h-16" onClick={playAudio}>
        {/* Hover Control */}
        <div className="relative w-full h-full">
          {/* Front Side */}
          <div className="bg-slate-100 absolute inset-0 transition duration-75 ease-in-out transform hover:opacity-0 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
            <h5 className="text-2xl font-bold text-gray-900">{char}</h5>
          </div>
          {/* Back Side */}
          <div className="bg-slate-300 absolute inset-0 transition duration-75 ease-in-out transform opacity-0 hover:opacity-100 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
            <h5 className="text-3xl text-gray-700">{romaji}</h5>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8 mt-8">
        Learn Hiragana
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {hiragana.map((item, index) => (
          <HiraganaCard
            key={index}
            char={item.char}
            romaji={item.romaji}
            audio={item.audio}
          />
        ))}
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 mt-8">
        Learn Katakana
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        {katakana.map((item, index) => (
          <HiraganaCard
            key={index}
            char={item.char}
            romaji={item.romaji}
            audio={item.audio}
          />
        ))}
      </div>
    </div>
  );
}
