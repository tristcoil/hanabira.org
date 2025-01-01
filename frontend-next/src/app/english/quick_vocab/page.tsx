
// ------------- WELL TESTED FUNCTIONING CODE -------------------------------- //

"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";


// export default function Home() {

//   return (
//     <div className="container mx-auto p-4">
//       <div className="max-w-4xl mx-auto p-5">
//         <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4">
//           Quick JLPT N5-N1 Vocabulary overview
//         </h1>
//         <p className="text-gray-700 text-sm">Intended as quick refresh.</p>
//         <br></br>
//         <p className="text-gray-700 text-sm">
//           Here is full vocabulary list for JLPT N5-N1. The cards are intended
//           for quick vocabulary review. These are not SRS flashcards (SRS
//           functionality implemented in different part of the platform). The idea
//           is that we scroll through the cards and make sure that we are familiar
//           with the word. If not, we can quickly check reading and english
//           translation. So this section should ideally be visited once you are
//           already familiar with majority of vocabulary for given JLPT level. For
//           example we can just quickly scroll through 100 N3 words per day to
//           make sure we remember them.
//         </p>
//         <p className="text-gray-700 text-sm">
//               Source:&nbsp;  
//               <a
//                 href="https://www.tanos.co.uk/jlpt/"
//                 className="text-blue-500 hover:text-blue-700 visited:text-purple-600"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 Tanos.co.uk
//               </a>
//             </p>
//       </div>

//       <TabComponent />
//     </div>
//   );
// }







//import React, { useState, useEffect } from 'react';
// Import other necessary components like TabComponent

export default function Home() {
  const [globalTotalClicksEnglish, setglobalTotalClicksEnglish] = useState<number>(0);

  useEffect(() => {
    const updateglobalTotalClicksEnglish = () => {
      if (typeof window !== 'undefined') {
        const storedGlobalClicks = localStorage.getItem('globalTotalClicksEnglish');
        const totalClicks = storedGlobalClicks ? parseInt(storedGlobalClicks) : 0;
        setglobalTotalClicksEnglish(totalClicks);
      }
    };

    // Initial load
    updateglobalTotalClicksEnglish();

    // Listen for the custom 'globalClicksUpdated' event
    window.addEventListener('globalClicksUpdated', updateglobalTotalClicksEnglish);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('globalClicksUpdated', updateglobalTotalClicksEnglish);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4">
          Quick JLPT N5-N1 Vocabulary Overview
        </h1>
        <p className="text-gray-700 text-sm">Intended as quick vocabulary refresh.</p>
        <br />
        <p className="text-gray-700 text-sm">
          Here is full vocabulary list for JLPT N5-N1. The cards are intended
          for quick vocabulary review. These are not SRS flashcards (SRS
          functionality implemented in different part of the platform). The idea
          is that we scroll through the cards and make sure that we are familiar
          with the word. If not, we can quickly check reading and English
          translation. So this section should ideally be visited once you are
          already familiar with the majority of vocabulary for a given JLPT
          level. For example, we can just quickly scroll through 100 N3 words
          per day to make sure we remember them.
        </p>
        <p className="text-gray-700 text-sm">
          Source:&nbsp;
          <a
            href="https://www.tanos.co.uk/jlpt/"
            className="text-blue-500 hover:text-blue-700 visited:text-purple-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tanos.co.uk
          </a>
        </p>
      </div>

      {/* Display Global Total Clicks */}
      <div className="max-w-4xl mx-auto p-5">
        <p className="text-lg font-bold text-gray-800">
          Total Score: {globalTotalClicksEnglish}
        </p>
      </div>

      {/* Render your TabComponent or other components here */}
      <TabComponent />
    </div>
  );
}

























// ---------------------------- //

// interface HiraganaCardProps {
//   kanji: string;
//   reading: string;
//   en: string;
//   k_audio: string;
// }

// const HiraganaCard: React.FC<HiraganaCardProps> = ({
//   kanji,
//   reading,
//   en,
//   k_audio,
// }) => {
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [flipCount, setFlipCount] = useState(0);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [achievements, setAchievements] = useState<string[]>([]);
//   const [recentAchievement, setRecentAchievement] = useState('');
//   const [showAchievement, setShowAchievement] = useState(false);
//   const [streak, setStreak] = useState(0);
//   const [lastFlipDate, setLastFlipDate] = useState<string | null>(null);

//   // Load per-card state variables from localStorage when the component mounts
//   useEffect(() => {
//     const storedPoints = localStorage.getItem(`totalPoints_${kanji}`);
//     if (storedPoints) {
//       setTotalPoints(parseInt(storedPoints));
//     }

//     const storedStreak = localStorage.getItem(`streak_${kanji}`);
//     if (storedStreak) {
//       setStreak(parseInt(storedStreak));
//     }

//     const storedLastFlipDate = localStorage.getItem(`lastFlipDate_${kanji}`);
//     if (storedLastFlipDate) {
//       setLastFlipDate(storedLastFlipDate);
//     }

//     const storedAchievements = localStorage.getItem(`achievements_${kanji}`);
//     if (storedAchievements) {
//       setAchievements(JSON.parse(storedAchievements));
//     }

//     const storedFlipCount = localStorage.getItem(`flipCount_${kanji}`);
//     if (storedFlipCount) {
//       setFlipCount(parseInt(storedFlipCount));
//     }
//   }, [kanji]);

//   // Save per-card state variables to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem(`totalPoints_${kanji}`, totalPoints.toString());
//     localStorage.setItem(`streak_${kanji}`, streak.toString());
//     localStorage.setItem(`lastFlipDate_${kanji}`, lastFlipDate || '');
//     localStorage.setItem(`achievements_${kanji}`, JSON.stringify(achievements));
//     localStorage.setItem(`flipCount_${kanji}`, flipCount.toString());
//   }, [totalPoints, streak, lastFlipDate, achievements, flipCount, kanji]);

//   // Function to play audio
//   const playAudio = () => {
//     const audioElement = new Audio(k_audio);
//     audioElement.play();
//   };

//   // Function to handle card click
//   const handleCardClick = () => {
//     setIsFlipped(!isFlipped);
//     const newFlipCount = flipCount + 1;
//     setFlipCount(newFlipCount); // Increment the flip count each time the card is clicked
//     playAudio();

//     // Update total points
//     const pointsEarned = 1; // Earn 1 point per flip
//     const newTotalPoints = totalPoints + pointsEarned;
//     setTotalPoints(newTotalPoints);

//     // Check for achievements
//     checkAchievements(newTotalPoints);

//     // Update streak
//     const today = new Date().toDateString();
//     if (lastFlipDate !== today) {
//       setStreak(streak + 1);
//       setLastFlipDate(today);
//     }
//   };

//   // Function to check and unlock achievements
//   const checkAchievements = (points: number) => {
//     const newAchievements = [...achievements];

//     if (points >= 100 && !achievements.includes('First 100 Points!')) {
//       newAchievements.push('First 100 Points!');
//       setAchievements(newAchievements);
//       triggerAchievement('First 100 Points!');
//     }

//     if (points >= 500 && !achievements.includes('Halfway to 1000!')) {
//       newAchievements.push('Halfway to 1000!');
//       setAchievements(newAchievements);
//       triggerAchievement('Halfway to 1000!');
//     }

//     if (points >= 1000 && !achievements.includes('1000 Points!')) {
//       newAchievements.push('1000 Points!');
//       setAchievements(newAchievements);
//       triggerAchievement('1000 Points!');
//     }
//   };

//   // Function to trigger an achievement notification
//   const triggerAchievement = (achievement: string) => {
//     setRecentAchievement(achievement);
//     setShowAchievement(true);
//     setTimeout(() => {
//       setShowAchievement(false);
//     }, 3000);
//   };

//   // Function to determine card shade based on flip count
//   const getCardShade = () => {
//     if (flipCount < 5) return 'bg-slate-100'; // Light slate
//     if (flipCount < 10) return 'bg-gray-100'; // Light gray
//     if (flipCount < 15) return 'bg-zinc-100'; // Light zinc
//     if (flipCount < 20) return 'bg-neutral-100'; // Light neutral
//     if (flipCount < 25) return 'bg-stone-100'; // Light stone
//     if (flipCount < 30) return 'bg-red-100'; // Light red
//     if (flipCount < 35) return 'bg-orange-100'; // Light orange
//     if (flipCount < 40) return 'bg-yellow-100'; // Light yellow
//     if (flipCount < 45) return 'bg-green-100'; // Light green
//     if (flipCount < 50) return 'bg-teal-100'; // Light teal
//     if (flipCount < 55) return 'bg-cyan-100'; // Light cyan
//     if (flipCount < 60) return 'bg-blue-100'; // Light blue
//     if (flipCount < 65) return 'bg-indigo-100'; // Light indigo
//     if (flipCount < 70) return 'bg-violet-100'; // Light violet
//     if (flipCount < 75) return 'bg-purple-100'; // Light purple
//     if (flipCount < 80) return 'bg-pink-100'; // Light pink
//     return 'bg-rose-100'; // Light rose for 80+ clicks
//   };

//   return (
//     <div className="w-48 h-48 relative mt-4" onClick={handleCardClick}>
//       {/* Display total points and streak */}
//       <div className="flex absolute top-0 left-0 p-2">
//         <p className="text-xs text-gray-600">Points: {totalPoints}</p>
//         <p className="text-xs text-gray-600 ml-5">Streak: {streak} day(s)</p>
//       </div>

//       {showAchievement && (
//         <div className="absolute top-0 right-0 bg-yellow-300 p-2 rounded z-20">
//           <p className="text-sm font-bold">Achievement Unlocked!</p>
//           <p className="text-sm">{recentAchievement}</p>
//         </div>
//       )}

//       <div className="relative w-full h-full mt-8">
//         {/* Front of the Card */}
//         <div
//           className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
//             isFlipped ? 'opacity-0 z-0' : 'opacity-100 z-10'
//           } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
//         >
//           <h5 className="text-sm text-gray-600">[{reading}]</h5>
//           <h5 className="text-4xl text-gray-900">{kanji}</h5>
//         </div>

//         {/* Back of the Card */}
//         <div
//           className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
//             isFlipped ? 'opacity-100 z-10' : 'opacity-0 z-0'
//           } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
//         >
//           <h5 className="text-sm text-gray-600">[{reading}]</h5>
//           <h5 className="text-2xl text-gray-900">{kanji}</h5>
//           <h5 className="text-md text-gray-700 text-center whitespace-pre-wrap overflow-auto max-h-full p-2">
//             {en}
//           </h5>

//           {/* Icon Link at the Bottom Left */}
//           <Link
//             href={`https://www.japandict.com/?s=${encodeURIComponent(kanji)}`}
//             passHref
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="absolute bottom-2 left-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 -960 960 960"
//               className="w-5 h-5 text-gray-700"
//             >
//               <path d="M240-400q-33 0-56.5-23.5T160-480t23.5-56.5T240-560t56.5 23.5T320-480t-23.5 56.5T240-400m240 0q-33 0-56.5-23.5T400-480t23.5-56.5T480-560t56.5 23.5T560-480t-23.5 56.5T480-400m240 0q-33 0-56.5-23.5T640-480t23.5-56.5T720-560t56.5 23.5T800-480t-23.5 56.5T720-400" />
//             </svg>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HiraganaCard;


// --------------------------------------------------------------

//import React, { useState, useEffect } from 'react';
//import Link from 'next/link';

// interface HiraganaCardProps {
//   kanji: string;
//   reading: string;
//   en: string;
//   k_audio: string;
// }

// const HiraganaCard: React.FC<HiraganaCardProps> = ({
//   kanji,
//   reading,
//   en,
//   k_audio,
// }) => {
//   const [isFlipped, setIsFlipped] = useState(false);

//   // Initialize flipCount from localStorage or set to 0
//   const [flipCount, setFlipCount] = useState<number>(() => {
//     if (typeof window !== 'undefined') {
//       const storedFlipCount = localStorage.getItem(`flipCount_${kanji}`);
//       return storedFlipCount ? parseInt(storedFlipCount) : 0;
//     }
//     return 0;
//   });

//   // Initialize totalPoints from localStorage or set to 0
//   const [totalPoints, setTotalPoints] = useState<number>(() => {
//     if (typeof window !== 'undefined') {
//       const storedPoints = localStorage.getItem(`totalPoints_${kanji}`);
//       return storedPoints ? parseInt(storedPoints) : 0;
//     }
//     return 0;
//   });

//   // Initialize achievements from localStorage or set to empty array
//   const [achievements, setAchievements] = useState<string[]>(() => {
//     if (typeof window !== 'undefined') {
//       const storedAchievements = localStorage.getItem(`achievements_${kanji}`);
//       return storedAchievements ? JSON.parse(storedAchievements) : [];
//     }
//     return [];
//   });

//   const [recentAchievement, setRecentAchievement] = useState('');
//   const [showAchievement, setShowAchievement] = useState(false);

//   // Initialize streak from localStorage or set to 0
//   const [streak, setStreak] = useState<number>(() => {
//     if (typeof window !== 'undefined') {
//       const storedStreak = localStorage.getItem(`streak_${kanji}`);
//       return storedStreak ? parseInt(storedStreak) : 0;
//     }
//     return 0;
//   });

//   // Initialize lastFlipDate from localStorage or set to null
//   const [lastFlipDate, setLastFlipDate] = useState<string | null>(() => {
//     if (typeof window !== 'undefined') {
//       const storedLastFlipDate = localStorage.getItem(`lastFlipDate_${kanji}`);
//       return storedLastFlipDate ? storedLastFlipDate : null;
//     }
//     return null;
//   });

//   // Save per-card state variables to localStorage whenever they change
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(`totalPoints_${kanji}`, totalPoints.toString());
//       localStorage.setItem(`streak_${kanji}`, streak.toString());
//       localStorage.setItem(`lastFlipDate_${kanji}`, lastFlipDate || '');
//       localStorage.setItem(`achievements_${kanji}`, JSON.stringify(achievements));
//       localStorage.setItem(`flipCount_${kanji}`, flipCount.toString());
//     }
//   }, [totalPoints, streak, lastFlipDate, achievements, flipCount, kanji]);

//   // Function to play audio
//   const playAudio = () => {
//     const audioElement = new Audio(k_audio);
//     audioElement.play();
//   };

//   // Function to handle card click
//   const handleCardClick = () => {
//     setIsFlipped(!isFlipped);
//     const newFlipCount = flipCount + 1;
//     setFlipCount(newFlipCount); // Increment the flip count each time the card is clicked
//     playAudio();

//     // Update total points
//     const pointsEarned = 1; // Earn 1 point per flip
//     const newTotalPoints = totalPoints + pointsEarned;
//     setTotalPoints(newTotalPoints);

//     // Check for achievements
//     checkAchievements(newTotalPoints);

//     // Update streak
//     const today = new Date().toDateString();
//     if (lastFlipDate !== today) {
//       setStreak(streak + 1);
//       setLastFlipDate(today);
//     }
//   };

//   // Function to check and unlock achievements
//   const checkAchievements = (points: number) => {
//     const newAchievements = [...achievements];

//     if (points >= 100 && !achievements.includes('First 100 Points!')) {
//       newAchievements.push('First 100 Points!');
//       setAchievements(newAchievements);
//       triggerAchievement('First 100 Points!');
//     }

//     if (points >= 500 && !achievements.includes('Halfway to 1000!')) {
//       newAchievements.push('Halfway to 1000!');
//       setAchievements(newAchievements);
//       triggerAchievement('Halfway to 1000!');
//     }

//     if (points >= 1000 && !achievements.includes('1000 Points!')) {
//       newAchievements.push('1000 Points!');
//       setAchievements(newAchievements);
//       triggerAchievement('1000 Points!');
//     }
//   };

//   // Function to trigger an achievement notification
//   const triggerAchievement = (achievement: string) => {
//     setRecentAchievement(achievement);
//     setShowAchievement(true);
//     setTimeout(() => {
//       setShowAchievement(false);
//     }, 3000);
//   };

//   // Function to determine card shade based on flip count
//   const getCardShade = () => {
//     if (flipCount < 5) return 'bg-slate-100'; // Light slate
//     if (flipCount < 10) return 'bg-gray-100'; // Light gray
//     if (flipCount < 15) return 'bg-zinc-100'; // Light zinc
//     if (flipCount < 20) return 'bg-neutral-100'; // Light neutral
//     if (flipCount < 25) return 'bg-stone-100'; // Light stone
//     if (flipCount < 30) return 'bg-red-100'; // Light red
//     if (flipCount < 35) return 'bg-orange-100'; // Light orange
//     if (flipCount < 40) return 'bg-yellow-100'; // Light yellow
//     if (flipCount < 45) return 'bg-green-100'; // Light green
//     if (flipCount < 50) return 'bg-teal-100'; // Light teal
//     if (flipCount < 55) return 'bg-cyan-100'; // Light cyan
//     if (flipCount < 60) return 'bg-blue-100'; // Light blue
//     if (flipCount < 65) return 'bg-indigo-100'; // Light indigo
//     if (flipCount < 70) return 'bg-violet-100'; // Light violet
//     if (flipCount < 75) return 'bg-purple-100'; // Light purple
//     if (flipCount < 80) return 'bg-pink-100'; // Light pink
//     return 'bg-rose-100'; // Light rose for 80+ clicks
//   };

//   return (
//     <div className="w-48 h-48 relative mt-4" onClick={handleCardClick}>
//       {/* Display total points and streak */}
//       <div className="flex absolute top-0 left-0 p-2">
//         <p className="text-xs text-gray-600">Points: {totalPoints}</p>
//         <p className="text-xs text-gray-600 ml-5">Streak: {streak} day(s)</p>
//       </div>

//       {showAchievement && (
//         <div className="absolute top-0 right-0 bg-yellow-300 p-2 rounded z-20">
//           <p className="text-sm font-bold">Achievement Unlocked!</p>
//           <p className="text-sm">{recentAchievement}</p>
//         </div>
//       )}

//       <div className="relative w-full h-full mt-8">
//         {/* Front of the Card */}
//         <div
//           className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
//             isFlipped ? 'opacity-0 z-0' : 'opacity-100 z-10'
//           } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
//         >
//           <h5 className="text-sm text-gray-600">[{reading}]</h5>
//           <h5 className="text-4xl text-gray-900">{kanji}</h5>
//         </div>

//         {/* Back of the Card */}
//         <div
//           className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
//             isFlipped ? 'opacity-100 z-10' : 'opacity-0 z-0'
//           } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
//         >
//           <h5 className="text-sm text-gray-600">[{reading}]</h5>
//           <h5 className="text-2xl text-gray-900">{kanji}</h5>
//           <h5 className="text-md text-gray-700 text-center whitespace-pre-wrap overflow-auto max-h-full p-2">
//             {en}
//           </h5>

//           {/* Icon Link at the Bottom Left */}
//           <Link
//             href={`https://www.japandict.com/?s=${encodeURIComponent(kanji)}`}
//             passHref
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             className="absolute bottom-2 left-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 -960 960 960"
//               className="w-5 h-5 text-gray-700"
//             >
//               <path d="M240-400q-33 0-56.5-23.5T160-480t23.5-56.5T240-560t56.5 23.5T320-480t-23.5 56.5T240-400m240 0q-33 0-56.5-23.5T400-480t23.5-56.5T480-560t56.5 23.5T560-480t-23.5 56.5T480-400m240 0q-33 0-56.5-23.5T640-480t23.5-56.5T720-560t56.5 23.5T800-480t-23.5 56.5T720-400" />
//             </svg>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

//export default HiraganaCard;


// ------------------------------------------------

//import React, { useState, useEffect } from 'react';
//import Link from 'next/link';

interface HiraganaCardProps {
  kanji: string;
  reading: string;
  en: string;
  k_audio: string;
}

const HiraganaCard: React.FC<HiraganaCardProps> = ({
  kanji,
  reading,
  en,
  k_audio,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Initialize flipCount from localStorage or set to 0
  const [flipCount, setFlipCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedFlipCount = localStorage.getItem(`flipCount_${kanji}`);
      return storedFlipCount ? parseInt(storedFlipCount) : 0;
    }
    return 0;
  });

  // Other state variables remain the same as before
  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const storedStreak = localStorage.getItem(`streak_${kanji}`);
      return storedStreak ? parseInt(storedStreak) : 0;
    }
    return 0;
  });

  const [lastFlipDate, setLastFlipDate] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const storedLastFlipDate = localStorage.getItem(`lastFlipDate_${kanji}`);
      return storedLastFlipDate ? storedLastFlipDate : null;
    }
    return null;
  });

  const [achievements, setAchievements] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedAchievements = localStorage.getItem(`achievements_${kanji}`);
      return storedAchievements ? JSON.parse(storedAchievements) : [];
    }
    return [];
  });

  const [recentAchievement, setRecentAchievement] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);

  // Save per-card state variables to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`flipCount_${kanji}`, flipCount.toString());
      localStorage.setItem(`streak_${kanji}`, streak.toString());
      localStorage.setItem(`lastFlipDate_${kanji}`, lastFlipDate || '');
      localStorage.setItem(`achievements_${kanji}`, JSON.stringify(achievements));
    }
  }, [flipCount, streak, lastFlipDate, achievements, kanji]);

  // Function to play audio
  const playAudio = () => {
    const audioElement = new Audio(k_audio);
    audioElement.play();
  };

  // Function to handle card click
  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    const newFlipCount = flipCount + 1;
    setFlipCount(newFlipCount); // Increment the flip count each time the card is clicked
    playAudio();

    // Update global total clicks
    updateglobalTotalClicksEnglish();

    // Check for achievements
    checkAchievements(newFlipCount);

    // Update streak
    const today = new Date().toDateString();
    if (lastFlipDate !== today) {
      setStreak(streak + 1);
      setLastFlipDate(today);
    }
  };

  // Function to update global total clicks
  const updateglobalTotalClicksEnglish = () => {
    if (typeof window !== 'undefined') {
      const storedGlobalClicks = localStorage.getItem('globalTotalClicksEnglish');
      const newGlobalClicks = storedGlobalClicks ? parseInt(storedGlobalClicks) + 1 : 1;
      localStorage.setItem('globalTotalClicksEnglish', newGlobalClicks.toString());

      // Dispatch custom event to notify Home component
      window.dispatchEvent(new Event('globalClicksUpdated'));
    }
  };

  // Function to check and unlock achievements
  const checkAchievements = (flipCount: number) => {
    const newAchievements = [...achievements];

    if (flipCount >= 100 && !achievements.includes('First 100 Flips!')) {
      newAchievements.push('First 100 Flips!');
      setAchievements(newAchievements);
      triggerAchievement('First 100 Flips!');
    }

    if (flipCount >= 500 && !achievements.includes('Halfway to 1000 Flips!')) {
      newAchievements.push('Halfway to 1000 Flips!');
      setAchievements(newAchievements);
      triggerAchievement('Halfway to 1000 Flips!');
    }

    if (flipCount >= 1000 && !achievements.includes('1000 Flips!')) {
      newAchievements.push('1000 Flips!');
      setAchievements(newAchievements);
      triggerAchievement('1000 Flips!');
    }
  };

  // Function to trigger an achievement notification
  const triggerAchievement = (achievement: string) => {
    setRecentAchievement(achievement);
    setShowAchievement(true);
    setTimeout(() => {
      setShowAchievement(false);
    }, 3000);
  };

  // // Function to determine card shade based on flip count
  // const getCardShade = () => {
  //   if (flipCount < 5) return 'bg-slate-100'; // Light slate
  //   if (flipCount < 10) return 'bg-gray-100'; // Light gray
  //   if (flipCount < 15) return 'bg-zinc-100'; // Light zinc
  //   if (flipCount < 20) return 'bg-neutral-100'; // Light neutral
  //   if (flipCount < 25) return 'bg-stone-100'; // Light stone
  //   if (flipCount < 30) return 'bg-red-100'; // Light red
  //   if (flipCount < 35) return 'bg-orange-100'; // Light orange
  //   if (flipCount < 40) return 'bg-yellow-100'; // Light yellow
  //   if (flipCount < 45) return 'bg-green-100'; // Light green
  //   if (flipCount < 50) return 'bg-teal-100'; // Light teal
  //   if (flipCount < 55) return 'bg-cyan-100'; // Light cyan
  //   if (flipCount < 60) return 'bg-blue-100'; // Light blue
  //   if (flipCount < 65) return 'bg-indigo-100'; // Light indigo
  //   if (flipCount < 70) return 'bg-violet-100'; // Light violet
  //   if (flipCount < 75) return 'bg-purple-100'; // Light purple
  //   if (flipCount < 80) return 'bg-pink-100'; // Light pink
  //   return 'bg-rose-100'; // Light rose for 80+ flips
  // };

// Enhanced function to determine card shade based on flip count
const getCardShade = () => {
  if (flipCount < 10) return 'bg-slate-100';       // Light slate
  if (flipCount < 20) return 'bg-gray-100';        // Light gray
  if (flipCount < 30) return 'bg-zinc-100';        // Light zinc
  if (flipCount < 40) return 'bg-neutral-100';     // Light neutral
  if (flipCount < 50) return 'bg-stone-100';       // Light stone
  if (flipCount < 60) return 'bg-red-100';         // Light red
  if (flipCount < 70) return 'bg-orange-100';      // Light orange
  if (flipCount < 80) return 'bg-amber-100';       // Light amber
  if (flipCount < 90) return 'bg-yellow-100';      // Light yellow
  if (flipCount < 100) return 'bg-lime-100';       // Light lime
  if (flipCount < 110) return 'bg-green-100';      // Light green
  if (flipCount < 120) return 'bg-emerald-100';    // Light emerald
  if (flipCount < 130) return 'bg-teal-100';       // Light teal
  if (flipCount < 140) return 'bg-cyan-100';       // Light cyan
  if (flipCount < 150) return 'bg-sky-100';        // Light sky
  if (flipCount < 160) return 'bg-blue-100';       // Light blue
  if (flipCount < 170) return 'bg-indigo-100';     // Light indigo
  if (flipCount < 180) return 'bg-violet-100';     // Light violet
  if (flipCount < 190) return 'bg-purple-100';     // Light purple
  if (flipCount < 200) return 'bg-fuchsia-100';    // Light fuchsia
  if (flipCount < 210) return 'bg-pink-100';       // Light pink
  if (flipCount < 220) return 'bg-rose-100';       // Light rose
  if (flipCount < 230) return 'bg-red-200';        // Slightly darker red
  if (flipCount < 240) return 'bg-orange-200';     // Slightly darker orange
  if (flipCount < 250) return 'bg-amber-200';      // Slightly darker amber
  if (flipCount < 260) return 'bg-yellow-200';     // Slightly darker yellow
  if (flipCount < 270) return 'bg-lime-200';       // Slightly darker lime
  if (flipCount < 280) return 'bg-green-200';      // Slightly darker green
  if (flipCount < 290) return 'bg-emerald-200';    // Slightly darker emerald
  if (flipCount < 300) return 'bg-teal-200';       // Slightly darker teal
  if (flipCount < 310) return 'bg-cyan-200';       // Slightly darker cyan
  if (flipCount < 320) return 'bg-sky-200';        // Slightly darker sky
  if (flipCount < 330) return 'bg-blue-200';       // Slightly darker blue
  if (flipCount < 340) return 'bg-indigo-200';     // Slightly darker indigo
  if (flipCount < 350) return 'bg-violet-200';     // Slightly darker violet
  if (flipCount < 360) return 'bg-purple-200';     // Slightly darker purple
  if (flipCount < 370) return 'bg-fuchsia-200';    // Slightly darker fuchsia
  if (flipCount < 380) return 'bg-pink-200';       // Slightly darker pink
  if (flipCount < 390) return 'bg-rose-200';       // Slightly darker rose
  if (flipCount < 400) return 'bg-red-300';        // Even darker red
  // Continue adding more shades if desired
  return 'bg-red-400'; // Default color for 400+ flips
};



// const getCardShade = () => {
//   const colors = [
//     'bg-slate-100', 'bg-gray-100', 'bg-zinc-100', 'bg-neutral-100', 'bg-stone-100',
//     'bg-red-100', 'bg-orange-100', 'bg-amber-100', 'bg-yellow-100', 'bg-lime-100',
//     'bg-green-100', 'bg-emerald-100', 'bg-teal-100', 'bg-cyan-100', 'bg-sky-100',
//     'bg-blue-100', 'bg-indigo-100', 'bg-violet-100', 'bg-purple-100', 'bg-fuchsia-100',
//     'bg-pink-100', 'bg-rose-100', 'bg-red-200', 'bg-orange-200', 'bg-amber-200',
//     'bg-yellow-200', 'bg-lime-200', 'bg-green-200', 'bg-emerald-200', 'bg-teal-200',
//     'bg-cyan-200', 'bg-sky-200', 'bg-blue-200', 'bg-indigo-200', 'bg-violet-200',
//     'bg-purple-200', 'bg-fuchsia-200', 'bg-pink-200', 'bg-rose-200', 'bg-red-300',
//     // Add more colors if needed
//   ];
//   const index = Math.min(Math.floor(flipCount / 5), colors.length - 1);
//   return colors[index];
// };










  return (
    <div className="w-48 h-48 relative mt-4" onClick={handleCardClick}>
      {/* Display flip count and streak */}
      <div className="flex absolute top-0 left-0 p-2">
        <p className="text-xs text-gray-600">Flips: {flipCount}</p>
        <p className="text-xs text-gray-600 ml-5">Streak: {streak} day(s)</p>
      </div>

      {showAchievement && (
        <div className="absolute top-0 right-0 bg-yellow-300 p-2 rounded z-20">
          <p className="text-sm font-bold">Achievement Unlocked!</p>
          <p className="text-sm">{recentAchievement}</p>
        </div>
      )}

      <div className="relative w-full h-full mt-8">
        {/* Front of the Card */}
        <div
          className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
            isFlipped ? 'opacity-0 z-0' : 'opacity-100 z-10'
          } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
        >
          <h5 className="text-sm text-gray-600">[{reading}]</h5>
          <h5 className="text-4xl text-gray-900">{kanji}</h5>
        </div>

        {/* Back of the Card */}
        <div
          className={`${getCardShade()} transition duration-75 ease-in-out transform hover:bg-slate-200 ${
            isFlipped ? 'opacity-100 z-10' : 'opacity-0 z-0'
          } rounded-lg shadow-md p-4 border border-gray-200 absolute inset-0 flex flex-col items-center justify-center`}
        >
          <h5 className="text-sm text-gray-600">[{reading}]</h5>
          <h5 className="text-2xl text-gray-900">{kanji}</h5>
          <h5 className="text-md text-gray-700 text-center whitespace-pre-wrap overflow-auto max-h-full p-2">
            {en}
          </h5>

          {/* Icon Link at the Bottom Left */}
          <Link
            href={`https://www.japandict.com/?s=${encodeURIComponent(kanji)}`}
            passHref
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
              className="w-5 h-5 text-gray-700"
            >
              <path d="M240-400q-33 0-56.5-23.5T160-480t23.5-56.5T240-560t56.5 23.5T320-480t-23.5 56.5T240-400m240 0q-33 0-56.5-23.5T400-480t23.5-56.5T480-560t56.5 23.5T560-480t-23.5 56.5T480-400m240 0q-33 0-56.5-23.5T640-480t23.5-56.5T720-560t56.5 23.5T800-480t-23.5 56.5T720-400" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

//export default HiraganaCard;






















// ---------------------------- //

const TabComponent = () => {
  const [activeJLPTTab, setActiveJLPTTab] = useState("EIKEN_N5");
  const [activeVocabTab, setActiveVocabTab] = useState(100);

  // Mapping JLPT levels to their respective vocab sets
  const vocabSetsByLevel: Record<string, number[]> = {
    JLPT_N5: [100, 200, 300, 400, 500, 600, 700],
    JLPT_N4: [100, 200, 300, 400, 500, 600, 700],
    JLPT_N3: [
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
      1500, 1600, 1700, 1800, 1900,
    ],
    JLPT_N2: [
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
      1500, 1600, 1700, 1800, 1900,
    ],
    JLPT_N1: [
      100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400,
      1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600,
      2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500,
    ],
  };

  // Get the vocab sets for the currently selected JLPT level
  const vocabSets = vocabSetsByLevel[activeJLPTTab] || [];

  const jlptLevels = ["EIKEN_N5", "JLPT_N4", "JLPT_N3", "JLPT_N2", "JLPT_N1"];

  // Effect to update activeVocabTab only when activeJLPTTab changes
  useEffect(() => {
    // Set the activeVocabTab to the first value of the new JLPT level's vocab set
    setActiveVocabTab(vocabSets[0] || 100);
  }, [activeJLPTTab]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex border-b overflow-auto">
        {jlptLevels.map((level, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-lg font-medium ${activeJLPTTab === level
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
              }`}
            onClick={() => setActiveJLPTTab(level)}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-10 gap-1 overflow-auto border-b mt-2">
        {vocabSets.map((set) => (
          <button
            key={set}
            className={`px-2 py-1 text-sm font-medium ${activeVocabTab === set
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
              }`}
            onClick={() => setActiveVocabTab(set)}
          >
            {set}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {/* Render the KanjiTable based on active JLPT and Vocab Tab */}
        <KanjiTable p_tag={activeJLPTTab} s_tag={`${activeVocabTab}`} />
      </div>
    </div>
  );
};



// ---------------------------- //


interface KanjiItem {
  vocabulary_original: string;
  vocabulary_simplified: string;
  vocabulary_english: string;
  vocabulary_audio: string;
}

interface KanjiTableProps {
  p_tag: string; // Explicitly stating p_tag is of any type
  s_tag: string;
}

const KanjiTable: React.FC<KanjiTableProps> = ({ p_tag, s_tag }) => {
  const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Initialize with specific values for p_tag and s_tag
  const [activeJLPTTab, setActiveJLPTTab] = useState("eiken_n5"); // Example initial value
  const [activeVocabTab, setActiveVocabTab] = useState(100); // Example initial value

  useEffect(() => {
    const fetchData = async () => {
      if (!p_tag) return; // If no p_tag is provided, don't attempt to fetch data
      if (!s_tag) return;

      setLoading(true);
      try {
        console.log(
          "##################################  ENV VARS  #######################################"
        );
        console.log(process.env.REACT_APP_HOST_IP);

        const host = "localhost";
        const port = 8000;

        let apiUrl;
        //If REACT_APP_HOST_IP is defined, use it. Otherwise default to localhost:8000 for VM
        if (process.env.REACT_APP_HOST_IP) {
          apiUrl = `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/tanos_words?p_tag=${p_tag}&s_tag=${s_tag}`;
        } else {
          //apiUrl = `http://${host}:${port}/e-api/v1/tanos_words?p_tag=${p_tag}&s_tag=${s_tag}`;
          apiUrl = `/e-api/v1/tanos_words?p_tag=${p_tag}&s_tag=${s_tag}`;     // use for client component
        }


        //apiUrl = `localhost:8000/e-api/v1/tanos_words?p_tag=${p_tag}&s_tag=${s_tag}`;

        // response is object and list is under words key
        // {"words":[{"_id":"65be8e71233807ecceb66aa3",
        //"vocabulary_original":"お土産",
        //"vocabulary_simplified":"おみやげ",
        // "vocabulary_english":"souvenir",
        //"vocabulary_audio":"/audio/vocab/v_お土産.mp3",
        // "word_type":"nan",
        //"p_tag":"JLPT_N4",
        //"s_tag":"200","__v":

        const response = await fetch(`${apiUrl}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`); // Throw error for bad response
        }
        //const data: KanjiItem[] = await response.json();
        //console.log(data); // Add this line to check the data format
        //setKanjiData(data.words); // Assuming the API returns the array of kanji data

        const { words } = await response.json(); // Directly destructure 'words' from the response
        console.log(words);
        setKanjiData(words); // Assumes words is directly an array of KanjiItem

      } catch (error) {
        console.error("Error fetching kanji data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [p_tag, s_tag]); // Only re-run the effect if p_tag changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-4">
        {/* {hiragana.map((item, index) => ( */}
        {kanjiData.map((item, index) => (
          <HiraganaCard
            key={index}
            kanji={item.vocabulary_original}
            reading={item.vocabulary_simplified}
            en={item.vocabulary_english}
            k_audio={item.vocabulary_audio}
          />
        ))}
      </div>
    </div>
  );
};
