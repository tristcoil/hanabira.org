// // pages/index.js
'use client';


// pages/index.js

import React, { useState } from 'react';
//import KanjiComponent from '../components/KanjiComponent';

const HomePage = () => {
  const kanjiList = [
    {
      character: '議',
      meaning: 'some meaning',
      radicals: ['言 (speech)', '義 (justice)'],
      mnemonic:
        'Combining "speech" and "justice" signifies a discussion to reach justice.',
      onyomi: ['ギ (gi)'],
      kunyomi: [],
      vocabulary: [
        {
          word: '会議',
          reading: 'かいぎ',
          meaning: 'meeting, conference',
          exampleSentence: '明日は重要な会議があります。',
          translation: 'There is an important meeting tomorrow.',
          type: 'onyomi',
        },
        {
          word: '議論',
          reading: 'ぎろん',
          meaning: 'argument, discussion',
          exampleSentence: '彼らはその問題について議論した。',
          translation: 'They discussed the problem.',
          type: 'onyomi',
        },
      ],
    },
    {
      character: '行',
      meaning: 'some meaning',
      radicals: ['彳 (step)', '亍 (walk)'],
      mnemonic: 'A person taking steps represents "going" or "conducting".',
      onyomi: ['コウ (kō)', 'ギョウ (gyō)'],
      kunyomi: ['い (i)', 'ゆ (yu)', 'おこな (okonau)'],
      vocabulary: [
        {
          word: '銀行',
          reading: 'ぎんこう',
          meaning: 'bank',
          exampleSentence: '彼は銀行で働いています。',
          translation: 'He works at a bank.',
          type: 'onyomi',
        },
        {
          word: '行く',
          reading: 'いく',
          meaning: 'to go',
          exampleSentence: '学校に行きます。',
          translation: 'I am going to school.',
          type: 'kunyomi',
        },
      ],
    },
    // Add more kanji objects as needed
  ];

  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);

  const handleNext = () => {
    setCurrentKanjiIndex((prevIndex) =>
      prevIndex < kanjiList.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrevious = () => {
    setCurrentKanjiIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : kanjiList.length - 1
    );
  };

  const currentKanjiData = kanjiList[currentKanjiIndex];

  return (
    <div>
      <KanjiComponent kanjiData={currentKanjiData} />
      <div className="flex justify-center mt-4">
        <button
          onClick={handlePrevious}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="mx-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HomePage;


// -------------------------------------------------------- //


// --- PASTEL COLORS --- //
// components/KanjiComponent.js

//import React from 'react';

// const KanjiComponent = ({ kanjiData }) => {
//   const onyomiVocab = kanjiData.vocabulary.filter(
//     (vocab) => vocab.type === 'onyomi'
//   );
//   const kunyomiVocab = kanjiData.vocabulary.filter(
//     (vocab) => vocab.type === 'kunyomi'
//   );

//   return (
//     <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
//       <div className="max-w-2xl w-full bg-white rounded-lg p-8">
//         <div className="text-center mb-8">
//           <h1 className="text-8xl font-light text-gray-800 mb-4">
//             {kanjiData.character}
//           </h1>
//           <h2 className="text-2xl font-medium text-gray-600 mb-2">
//             {kanjiData.meaning}
//           </h2>
//           <p className="text-lg text-gray-500 mb-4">
//             Radicals: {kanjiData.radicals.join(', ')}
//           </p>
//           <p className="text-base text-gray-500 italic">
//             {kanjiData.mnemonic}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <div>
//             <h3 className="text-xl font-medium text-gray-700 mb-2">
//               On’yomi
//             </h3>
//             <p className="text-lg text-gray-600">
//               {kanjiData.onyomi.length > 0
//                 ? kanjiData.onyomi.join(', ')
//                 : 'None'}
//             </p>
//           </div>

//           <div>
//             <h3 className="text-xl font-medium text-gray-700 mb-2">
//               Kun’yomi
//             </h3>
//             <p className="text-lg text-gray-600">
//               {kanjiData.kunyomi.length > 0
//                 ? kanjiData.kunyomi.join(', ')
//                 : 'None'}
//             </p>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-2xl font-medium text-gray-700 mb-4">
//             Vocabulary
//           </h2>

//           {onyomiVocab.length > 0 && (
//             <div className="mb-8">
//               <h3 className="text-lg font-medium text-gray-700 mb-2">
//                 On’yomi Vocabulary
//               </h3>
//               {onyomiVocab.map((vocab, index) => (
//                 <div
//                   key={index}
//                   className="mb-4 p-4 bg-blue-100 rounded-lg"
//                 >
//                   <h4 className="text-lg font-semibold text-gray-800 mb-1">
//                     {vocab.word} ({vocab.reading})
//                   </h4>
//                   <p className="text-base text-gray-600 mb-1">
//                     {vocab.meaning}
//                   </p>
//                   <p className="text-base text-gray-600 mb-1">
//                     {vocab.exampleSentence}
//                   </p>
//                   <p className="text-sm text-gray-500 italic">
//                     {vocab.translation}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {kunyomiVocab.length > 0 && (
//             <div>
//               <h3 className="text-lg font-medium text-gray-700 mb-2">
//                 Kun’yomi Vocabulary
//               </h3>
//               {kunyomiVocab.map((vocab, index) => (
//                 <div
//                   key={index}
//                   className="mb-4 p-4 bg-green-100 rounded-lg"
//                 >
//                   <h4 className="text-lg font-semibold text-gray-800 mb-1">
//                     {vocab.word} ({vocab.reading})
//                   </h4>
//                   <p className="text-base text-gray-600 mb-1">
//                     {vocab.meaning}
//                   </p>
//                   <p className="text-base text-gray-600 mb-1">
//                     {vocab.exampleSentence}
//                   </p>
//                   <p className="text-sm text-gray-500 italic">
//                     {vocab.translation}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           )}

//           {onyomiVocab.length === 0 && kunyomiVocab.length === 0 && (
//             <p className="text-gray-600">No vocabulary available.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

//export default KanjiComponent;










































// ---------------------------- WORKS GREAT ----------------------
// components/KanjiComponent.js

//import React from 'react';

const KanjiComponent = ({ kanjiData }) => {
  const onyomiVocab = kanjiData.vocabulary.filter(
    (vocab) => vocab.type === 'onyomi'
  );
  const kunyomiVocab = kanjiData.vocabulary.filter(
    (vocab) => vocab.type === 'kunyomi'
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">{kanjiData.character}</h1>
          <h2 className="text-2xl font-bold mb-4">{kanjiData.meaning}</h2>
          <p className="text-xl text-gray-700 mb-2">
            Radicals: {kanjiData.radicals.join(', ')}
          </p>
          <p className="text-lg text-gray-600 italic mb-6">
            Mnemonic: {kanjiData.mnemonic}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">On’yomi</h2>
          <p className="text-xl text-gray-700">
            {kanjiData.onyomi.length > 0
              ? kanjiData.onyomi.join(', ')
              : 'None'}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Kun’yomi</h2>
          <p className="text-xl text-gray-700">
            {kanjiData.kunyomi.length > 0
              ? kanjiData.kunyomi.join(', ')
              : 'None'}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Vocabulary</h2>

          {onyomiVocab.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">On’yomi Vocabulary</h3>
              {onyomiVocab.map((vocab, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-blue-200 rounded-lg"
                >
                  <h4 className="text-lg font-bold">
                    {vocab.word} ({vocab.reading})
                  </h4>
                  <p className="text-gray-700 mb-2">
                    Meaning: {vocab.meaning}
                  </p>
                  <p className="text-gray-700">
                    Example: {vocab.exampleSentence}
                  </p>
                  <p className="text-gray-600 italic">
                    Translation: {vocab.translation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {kunyomiVocab.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Kun’yomi Vocabulary</h3>
              {kunyomiVocab.map((vocab, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-green-200 rounded-lg"
                >
                  <h4 className="text-lg font-bold">
                    {vocab.word} ({vocab.reading})
                  </h4>
                  <p className="text-gray-700 mb-2">
                    Meaning: {vocab.meaning}
                  </p>
                  <p className="text-gray-700">
                    Example: {vocab.exampleSentence}
                  </p>
                  <p className="text-gray-600 italic">
                    Translation: {vocab.translation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {onyomiVocab.length === 0 && kunyomiVocab.length === 0 && (
            <p className="text-gray-700">No vocabulary available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

//export default KanjiComponent;



































// -------------------------- NICELY FUNCTIONAL MVP --------------------------- //

// import React from 'react';
// //import KanjiComponent from '../components/KanjiComponent';

// const HomePage = () => {
//   const kanjiData = {
//     character: '議',
//     radicals: ['言 (speech)', '義 (justice)'],
//     mnemonic:
//       'Combining "speech" and "justice" signifies a discussion to reach justice.',
//     onyomi: ['ギ (gi)'],
//     kunyomi: [],
//     vocabulary: [
//       {
//         word: '会議',
//         reading: 'かいぎ',
//         meaning: 'meeting, conference',
//         exampleSentence: '明日は重要な会議があります。',
//         translation: 'There is an important meeting tomorrow.',
//       },
//       {
//         word: '議論',
//         reading: 'ぎろん',
//         meaning: 'argument, discussion',
//         exampleSentence: '彼らはその問題について議論した。',
//         translation: 'They discussed the problem.',
//       },
//     ],
//   };

//   return (
//     <div>
//       <KanjiComponent kanjiData={kanjiData} />
//     </div>
//   );
// };

// export default HomePage;




// // ----------------------------------------------------- //

// // components/KanjiComponent.js

// //import React from 'react';

// const KanjiComponent = ({ kanjiData }) => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
//       <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-8">
//         <div className="text-center">
//           <h1 className="text-6xl font-bold mb-4">{kanjiData.character}</h1>
//           <p className="text-xl text-gray-700 mb-2">
//             Radicals: {kanjiData.radicals.join(', ')}
//           </p>
//           <p className="text-lg text-gray-600 italic mb-6">
//             Mnemonic: {kanjiData.mnemonic}
//           </p>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-2">On’yomi</h2>
//           <p className="text-xl text-gray-700">
//             {kanjiData.onyomi.length > 0 ? kanjiData.onyomi.join(', ') : 'None'}
//           </p>
//         </div>

//         <div className="mb-6">
//           <h2 className="text-2xl font-semibold mb-2">Kun’yomi</h2>
//           <p className="text-xl text-gray-700">
//             {kanjiData.kunyomi.length > 0 ? kanjiData.kunyomi.join(', ') : 'None'}
//           </p>
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Vocabulary</h2>
//           {kanjiData.vocabulary.map((vocab, index) => (
//             <div
//               key={index}
//               className="mb-4 p-4 border border-gray-200 rounded-lg"
//             >
//               <h3 className="text-xl font-bold">
//                 {vocab.word} ({vocab.reading})
//               </h3>
//               <p className="text-gray-700 mb-2">Meaning: {vocab.meaning}</p>
//               <p className="text-gray-700">
//                 Example: {vocab.exampleSentence}
//               </p>
//               <p className="text-gray-600 italic">
//                 Translation: {vocab.translation}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// //export default KanjiComponent;














