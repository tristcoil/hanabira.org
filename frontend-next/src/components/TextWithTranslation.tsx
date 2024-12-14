import React, { useState, useEffect, useRef } from "react";

interface SentenceData {
  japanese: string;
  romanization: string;
  translation: string;
  audioPath: string;
  audioPathEn: string;
}

interface TextWithTranslationProps {
  sentences: SentenceData[];
  isEnglishSpeaker: boolean;
}

const TextWithTranslation: React.FC<TextWithTranslationProps> = ({
  sentences,
  isEnglishSpeaker,
}) => {
  const [popupIndex, setPopupIndex] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Effect to update audio sources when isEnglishSpeaker changes
  useEffect(() => {
    sentences.forEach((sentence, index) => {
      const audioEl = audioRefs.current[index];
      if (audioEl) {
        audioEl.src = isEnglishSpeaker
          ? sentence.audioPath
          : sentence.audioPathEn;
      }
    });
  }, [isEnglishSpeaker, sentences]);

  const togglePopup = (index: number) => {
    setPopupIndex(popupIndex === index ? null : index);
  };

  const sentenceElements = sentences.map((sentence, index) => {
    // Initialize the ref array for each sentence
    if (audioRefs.current.length <= index) {
      audioRefs.current.push(null);
    }

    return (
      <div key={index} className="relative mb-4 flex items-center">
        <button
          onClick={() => audioRefs.current[index]?.play()}
          className="mr-2"
        >
          &#128266;
        </button>


        <audio
          ref={(el) => {
            audioRefs.current[index] = el;
          }}
        >
          <source
            src={isEnglishSpeaker ? sentence.audioPath : sentence.audioPathEn}
            type="audio/mp3"
          />
          Your browser does not support the audio element.
        </audio>

        {isEnglishSpeaker ? sentence.japanese : sentence.translation}
        <button
          className="ml-2 px-2 py-1 text-xs bg-slate-400 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300"
          onClick={() => togglePopup(index)}
        >
          ?
        </button>
        {popupIndex === index && (
          <div className="absolute top-0 left-0 transform -translate-y-full mt-0.5 p-3 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-800 dark:border-gray-600">
            {isEnglishSpeaker ? (
              <>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Romanization:</strong> {sentence.romanization}
                </p>
                <p className="text-black dark:text-white">
                  <strong>Translation:</strong> {sentence.translation}
                </p>
              </>
            ) : (
              <>
                <p className="mb-2 text-black dark:text-white">
                  <strong>Japanese:</strong> {sentence.japanese}
                </p>
                <p className="text-black dark:text-white">
                  <strong>Romanization:</strong> {sentence.romanization}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      <h1 className="p-4 text-black dark:text-white">
        isEnglishSpeaker toggle: {isEnglishSpeaker.toString()}
      </h1>
      <div className="p-4 text-black dark:text-white">{sentenceElements}</div>
    </>
  );
};

export default TextWithTranslation;

// import React, { useState, useRef } from 'react';

// interface SentenceData {
//   japanese: string;
//   romanization: string;
//   translation: string;
//   audioPath: string;
//   audioPathEn: string;
// }

// interface TextWithTranslationProps {
//   sentences: SentenceData[];
//   isEnglishSpeaker: boolean;
// }

// const TextWithTranslation: React.FC<TextWithTranslationProps> = ({ sentences, isEnglishSpeaker }) => {
//   const [popupIndex, setPopupIndex] = useState<number | null>(null);

//   const togglePopup = (index: number) => {
//     setPopupIndex(popupIndex === index ? null : index);
//   };

//   const playAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
//     audioRef.current?.play();
//   };

//   const sentenceElements = sentences.map((sentence, index) => {
//     const audioRef = useRef<HTMLAudioElement>(null);

//     return (
//       <div key={index} className="relative mb-4 flex items-center">

//         <button onClick={() => playAudio(audioRef)} className="mr-2">
//           {/* &#9658; */}
//           &#128266;
//         </button>
//         <audio ref={audioRef}>
//           {/* Choose the audio source based on isEnglishSpeaker prop */}
//           <source src={isEnglishSpeaker ? sentence.audioPath : sentence.audioPathEn} type="audio/mp3" />
//           Your browser does not support the audio element.
//         </audio>
//         {/* Display the sentence based on isEnglishSpeaker prop */}
//         {isEnglishSpeaker ? sentence.japanese : sentence.translation}
//         <button
//           className="ml-2 px-2 py-1 text-xs bg-slate-400 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300"
//           onClick={() => togglePopup(index)}
//         >
//           ?
//         </button>
//         {popupIndex === index && (
//           <div className="absolute top-0 left-0 transform -translate-y-full mt-0.5 p-3 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-800 dark:border-gray-600">
//             {/* Conditionally render popup content based on isEnglishSpeaker */}
//             {isEnglishSpeaker ? (
//               <>
//                 <p className="mb-2 text-black dark:text-white">
//                   <strong>Romanization:</strong> {sentence.romanization}
//                 </p>
//                 <p className="text-black dark:text-white">
//                   <strong>Translation:</strong> {sentence.translation}
//                 </p>
//               </>
//             ) : (
//               <>
//                 <p className="mb-2 text-black dark:text-white">
//                   <strong>Japanese:</strong> {sentence.japanese}
//                 </p>
//                 <p className="text-black dark:text-white">
//                   <strong>Romanization:</strong> {sentence.romanization}
//                 </p>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   });

//   return (
//     <>
//       <h1 className="p-4 text-black dark:text-white">isEnglishSpeaker toggle: {isEnglishSpeaker.toString()}</h1>
//       <div className="p-4 text-black dark:text-white">{sentenceElements}</div>
//     </>
//   );

// };

// export default TextWithTranslation;

// import React, { useState, useRef } from "react";

// interface SentenceData {
//   japanese: string;
//   romanization: string;
//   translation: string;
//   audioPath: string;
//   audioPathEn: string;
// }

// interface TextWithTranslationProps {
//   sentences: SentenceData[];
//   isEnglishSpeaker: boolean;
// }

// const TextWithTranslation: React.FC<TextWithTranslationProps> = ({ sentences, isEnglishSpeaker }) => {
//   const [popupIndex, setPopupIndex] = useState<number | null>(null);

//   const togglePopup = (index: number) => {
//     if (popupIndex === index) {
//       setPopupIndex(null);
//     } else {
//       setPopupIndex(index);
//     }
//   };

//   const playAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
//     if (audioRef.current) {
//       audioRef.current.play();
//     }
//   };

//   return (
//     <div className="p-4 text-black dark:text-white">
//       {sentences.map((sentence, index) => {
//         const audioRef = useRef<HTMLAudioElement>(null);

//         return (
//           <div key={index} className="relative mb-4 flex items-center">
//             <button onClick={() => playAudio(audioRef)} className="mr-2">
//               {/* &#9658; */}
//               &#128266;
//             </button>
//             <audio ref={audioRef}>
//               <source src={sentence.audioPath} type="audio/mp3" />
//               Your browser does not support the audio element.
//             </audio>
//             {sentence.japanese}
//             <button
//               className="ml-2 px-2 py-1 text-xs bg-slate-400 text-white rounded hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-300"
//               onClick={() => togglePopup(index)}
//             >
//               ?
//             </button>
//             {popupIndex === index && (
//               <div className="absolute top-0 left-0 transform -translate-y-full mt-0.5 p-3 bg-white border border-gray-300 rounded shadow-lg dark:bg-gray-800 dark:border-gray-600">
//                 <p className="mb-2 text-black dark:text-white">
//                   <strong>Romanization:</strong> {sentence.romanization}
//                 </p>
//                 <p className="text-black dark:text-white">
//                   <strong>Translation:</strong> {sentence.translation}
//                 </p>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default TextWithTranslation;

// const sentences: SentenceData[] = [
//   {
//     japanese: "地球はほとんどの天然資源を使い果たし。",
//     romanization: "Chikyū wa hotondo no tennen shigen o tsukaihatashi.",
//     translation: "Earth had exhausted most of its natural resources.",
//     audioPath: "/audio/japanese/kanji/k_両.mp3",
//     audioPathEn: "/audio/japanese/kanji/k_両.mp3",
//   },
//   {
//     japanese: "人類を宇宙の空間での救済を探るように駆り立てました。",
//     romanization: "Jinrui o uchū no kūkan de no kyūsai o saguru yō ni karitatemashita.",
//     translation: "Compelling humanity to probe the void of space in search of salvation.",
//     audioPath: "/audio/japanese/kanji/k_両.mp3"
//     audioPathEn: "/audio/japanese/kanji/k_両.mp3",
//   }
// ];

// const sentences: SentenceData[] = [
//   {
//     "japanese": "2137年、地球はほとんどの天然資源を使い果たし。",
//     "romanization": "2137-nen, Chikyū wa hotondo no tennen shigen o tsukaihatashi.",
//     "translation": "In 2137, Earth had exhausted most of its natural resources.",
//     "audioPath": "/audio/japanese/reading_1/r_1.mp3"
//   },
//   {
//     "japanese": "人類を宇宙の空間での救済を探るように駆り立てました。",
//     "romanization": "Jinrui o uchū no kūkan de no kyūsai o saguru yō ni karitatemashita.",
//     "translation": "It compelled humanity to probe the void of space in search of salvation.",
//     "audioPath": "/audio/japanese/reading_1/r_2.mp3"
//   },
//   {
//     "japanese": "スターシップAeolisは、生命の潜在的な兆候を示している最近発見された太陽系外惑星、Zephyriaを調査するために銀河の外縁に派遣されました。",
//     "romanization": "Sutāshippu Aeolis wa, seimei no senzai-tekina chōkō o shimeshite iru saikin hakken sareta taiyōkeigai wakusei, Zephyria o chōsa suru tame ni ginga no gaien ni haken saremashita.",
//     "translation": "Starship Aeolis was dispatched to the outer edges of the galaxy to investigate Zephyria, a recently discovered exoplanet showing potential signs of life.",
//     "audioPath": "/audio/japanese/reading_1/r_3.mp3"
//   },
//   {
//     "japanese": "このミッションには、資源だけでなく、新しい家としての潜在的な可能性もかかっていました。",
//     "romanization": "Kono misshon ni wa, shigen dake de naku, atarashī ie toshite no senzai-tekina kanōsei mo kakatte imashita.",
//     "translation": "This mission was not just about resources, but also about the potential of a new home.",
//     "audioPath": "/audio/japanese/reading_1/r_4.mp3"
//   },
//   {
//     "japanese": "AeolisがZephyriaに接近すると、初期のスキャンは有望な絵を描きました：広大な海、密な森、そして地球の大気と驚くほど似ている。",
//     "romanization": "Aeolis ga Zephyria ni sekkin suru to, shoki no sukan wa yūbōna e o egakimashita: kōdana umi, mitsuna mori, soshite chikyū no taiki to odoroku hodo nite iru.",
//     "translation": "As Aeolis approached Zephyria, the initial scans painted a promising picture: vast seas, dense forests, and an atmosphere strikingly similar to Earth's.",
//     "audioPath": "/audio/japanese/reading_1/r_5.mp3"
//   },
//   {
//     "japanese": "しかし、一つの異常が乗組員の興味を引きました - 巨大な単一のモノリス構造、対称的で鋭い、空を突き刺すように。",
//     "romanization": "Shikashi, hitotsu no ijō ga norikumiin no kyōmi o hikimashita - kyodai na tan'itsu no monorisu kōzō, taishōteki de surudoi, sora o tsukisasu yō ni.",
//     "translation": "However, one anomaly caught the crew's interest - a massive singular monolithic structure, symmetrical and sharp, piercing the sky.",
//     "audioPath": "/audio/japanese/reading_1/r_6.mp3"
//   },
//   {
//     "japanese": "これは自然に形成されるものではなく、明らかに何者かの手によって作られました。",
//     "romanization": "Kore wa shizen ni keisei sareru mono de wa naku, akiraka ni nanimono ka no te ni yotte tsukuraremashita.",
//     "translation": "This was not something formed naturally, but clearly crafted by someone or something.",
//     "audioPath": "/audio/japanese/reading_1/r_7.mp3"
//   },
//   {
//     "japanese": "探査隊は近づいて詳細を調査することを決定しました。",
//     "romanization": "Tansa-tai wa chikazuite shōsai o chōsa suru koto o kettei shimashita.",
//     "translation": "The exploration team decided to approach and investigate in detail.",
//     "audioPath": "/audio/japanese/reading_1/r_8.mp3"
//   },
//   {
//     "japanese": "彼らがモノリスの基盤に到達すると、古代の文字が刻まれているのを発見しました。",
//     "romanization": "Karera ga monorisu no kiban ni tōtatsu suru to, kodai no moji ga kizamarete iru no o hakken shimashita.",
//     "translation": "Upon reaching the base of the monolith, they discovered ancient characters engraved on it.",
//     "audioPath": "/audio/japanese/reading_1/r_9.mp3"
//   },
//   {
//     "japanese": "これらの文字は、地球上のどの言語とも一致しませんでした。",
//     "romanization": "Korera no moji wa, Chikyū-jō no dono gengo tomo icchi shimasendeshita.",
//     "translation": "These characters did not match any language known on Earth.",
//     "audioPath": "/audio/japanese/reading_1/r_10.mp3"
//   }
// ];
