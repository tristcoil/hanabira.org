"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

// import LoginStreakGraph from "@/components/LoginStreakGraph";
// import LearningProgressFlask from "@/components/LearningProgressFlask";

import MotivationForm from "@/components/MotivationForm";

import { getUserFromCookies } from "@/utils/helperFunctions";

import dynamic from "next/dynamic";

const LoginStreakGraph = dynamic(
  () => import("@/components/LoginStreakGraph"),
  {
    ssr: false,
  }
);

const LearningProgressFlask = dynamic(
  () => import("@/components/LearningProgressFlask"),
  {
    ssr: false,
  }
);

interface LoginData {
  date: string;
  count: number;
}

interface LoginResponse {
  message?: string;
  error?: string;
}

const loginData = [
  { date: "2024-02-01", count: 1 },
  { date: "2024-02-02", count: 2 },
  { date: "2024-02-03", count: 3 },
  { date: "2024-02-04", count: 4 },
  { date: "2024-02-05", count: 5 },
  // Add more data points here
];

export default function Home() {
  // const [darkMode, setDarkMode] = useState(false);
  //const [loggedIn, setLoggedIn] = useState(false);
  //const [userId, setuserId] = useState(""); // TODO: take it from the cookies/provider
  //const [userId, setuserId] = useState(null);
  // Access user context
  const { userId, loggedIn } = useUser();

  const [loginStreakData, setLoginStreakData] = useState<LoginData[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginData[]>([]);
  const [longestStreak, setLongestStreak] = useState(0);

  const [showKanjiGraphs, setShowKanjiGraphs] = useState(false);
  const [showEssentialVerbs, setShowEssentialVerbs] = useState(false);
  const [showEssentialSuruVerbs, setShowEssentialSuruVerbs] = useState(false);
  const [showGrammar, setShowGrammar] = useState(false);


  // useEffect(() => {
  //   const fetchuserId = async () => {
  //     const { userId, jwt } = getUserFromCookies();
  //     setuserId(userId);
  //   };

  //   fetchuserId();
  // }, []);

  useEffect(() => {
    // Exit the hook if userId is null, undefined, or an empty string
    if (!userId) {
      return;
    }

    const fetchLoginStreakData = async () => {
      try {
        const response = await fetch(`/f-api/v1/get-logins/${userId}`, {
          method: "GET",
        });
        const data = await response.json();
        console.log(data);
        setLoginStreakData(data);
      } catch (error) {
        console.error("Error fetching login streak data:", error);
      }
    };

    fetchLoginStreakData();
  }, [userId]); // This effect depends on 'userId', so it will re-run when 'userId' changes

  // const fetchLoginHistory = async () => {
  //   const userId = "testUser"; // Dynamically set this to the logged-in user's userId
  //   try {
  //     const response = await fetch(`/f-api/v1/get-logins/${userId}`, {
  //       method: "GET",
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     setLoginHistory(data);
  //     // Use the data as needed
  //   } catch (error) {
  //     console.error("Error fetching login history:", error);
  //   }
  // };

  // const fetchLongestStreak = async () => {
  //   const userId = "testUser"; // Adjust according to your app logic
  //   try {
  //     const response = await fetch(`/f-api/v1/streak/${userId}`, {
  //       method: "GET",
  //     });
  //     const data = await response.json();
  //     if (data.longest_streak !== undefined) {
  //       setLongestStreak(data.longest_streak);
  //     } else {
  //       console.error("Could not fetch the longest streak", data.error);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching the longest streak:", error);
  //   }
  // };

  return (
    <div className="bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen relative p-10">
        {/* <br />
        <button onClick={fetchLoginHistory}>Show Login History</button>
        <div>
          {loginHistory.map((login, index) => (
            <div key={index}>{`date: ${login.date}, count: ${login.count}`}</div>
          ))}
        </div>
        <br />
        <div>
          <button onClick={fetchLongestStreak}>Show Longest Streak</button>
          {longestStreak > 0 && <p>Longest Streak: {longestStreak} days</p>}
        </div>
        <br />
        <br /> */}

        <div className="flex flex-col items-center px-2 py-4">
          <h1 className="text-lg font-bold mb-2">User Login Streak</h1>
          <div className="w-full">
            <LoginStreakGraph data={loginStreakData} />
          </div>
        </div>

        <MotivationForm />

        <div className="flex flex-col items-center px-2 py-4">
          <h1 className="text-lg font-bold mb-4">Deck Learning Progress</h1>

          {/* Kanji Section */}
          <div className="w-full">
            <button
              onClick={() => setShowKanjiGraphs(!showKanjiGraphs)}
              className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <span className="text-xl font-bold">Kanji</span>
              <span className="float-right">{showKanjiGraphs ? "▲" : "▼"}</span>
            </button>

            <a
              href="/japanese/flashcards"
              className="text-blue-500 hover:text-blue-700 transition duration-300 p-2"
            >
              Flashcards - Kanji
            </a>

            {showKanjiGraphs && (
              <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
                {[
                  "part_1",
                  "part_2",
                  "part_3",
                  "part_4",
                  "part_5",
                  "part_6",
                ].map((part, index) => (
                  <div
                    key={index}
                    className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                  >
                    <LearningProgressFlask
                      userId={userId}
                      collectionName="kanji"
                      p_tag="JLPT_N3"
                      s_tag={part}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vocabulary Section */}
          <div className="w-full mt-4">
            <button
              onClick={() => setShowEssentialVerbs(!showEssentialVerbs)}
              className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <span className="text-xl font-bold">Essential Verbs</span>
              <span className="float-right">
                {showEssentialVerbs ? "▲" : "▼"}
              </span>
            </button>

            <a
              href="/japanese/flashcards"
              className="text-blue-500 hover:text-blue-700 transition duration-300 p-2"
            >
              Flashcards - Essential Verbs
            </a>

            {showEssentialVerbs && (
              <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
                {[
                  "verbs-1",
                  "verbs-2",
                  "verbs-3",
                  "verbs-4",
                  "verbs-5",
                  "verbs-6",
                  "verbs-7",
                  "verbs-8",
                ].map((part, index) => (
                  <div
                    key={index}
                    className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                  >
                    <LearningProgressFlask
                      userId={userId}
                      collectionName="words"
                      p_tag="essential_600_verbs"
                      s_tag={part}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Essential Suru Verbs Section */}
          <div className="w-full mt-4">
            <button
              onClick={() => setShowEssentialSuruVerbs(!showEssentialSuruVerbs)}
              className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <span className="text-xl font-bold">Essential Suru Verbs</span>
              <span className="float-right">
                {showEssentialSuruVerbs ? "▲" : "▼"}
              </span>
            </button>

            <a
              href="/japanese/flashcards"
              className="text-blue-500 hover:text-blue-700 transition duration-300 p-2"
            >
              Flashcards - Essential Suru Verbs
            </a>

            {showEssentialSuruVerbs && (
              <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
                {[
                  "verbs-1",
                  "verbs-2",
                  "verbs-3",
                  "verbs-4",
                  "verbs-5",
                  "verbs-6",
                ].map((part, index) => (
                  <div
                    key={index}
                    className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg"
                  >
                    <LearningProgressFlask
                      userId={userId}
                      collectionName="words"
                      p_tag="suru_essential_600_verbs"
                      s_tag={part}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>


{/* Grammar Section */}
<div className="w-full mt-4">
  <button
    onClick={() => setShowGrammar(!showGrammar)}
    className="w-full text-left px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
  >
    <span className="text-xl font-bold">Grammar JLPT</span>
    <span className="float-right">{showGrammar ? "▲" : "▼"}</span>
  </button>

  <a
    href="/japanese/flashcards"
    className="text-blue-500 hover:text-blue-700 transition duration-300 p-2"
  >
    Flashcards - JLPT Grammar
  </a>

  {showGrammar && (
    <div className="flex flex-wrap justify-center gap-4 p-4 w-full">
      {["JLPT_N5","JLPT_N4","JLPT_N3","JLPT_N2","JLPT_N1",].map((part, index) => (
        <div
          key={index}
          className="w-full max-w-xs p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg"
        >
          <LearningProgressFlask
            userId={userId}
            collectionName="grammars"
            p_tag={part}
            s_tag="all"
          />
        </div>
      ))}
    </div>
  )}
</div>










        </div>
      </div>
    </div>
  );
}

// ---------------------- OLD CODE -----------------------------

// const handleLogin = () => {
//   // Simulate login process, here you'd usually authenticate user credentials
//   const user = "testUser";
//
//   // Set logged in user to cookies
//   localStorage.setItem("loggedInUser", user);
//   setLoggedIn(true);
//   setuserId(user);
// };

// const loginData = [
//     { date: '2024-01-01', count: 5 },
//     { date: '2024-01-02', count: 4 },
//     { date: '2024-01-03', count: 2 },
//     { date: '2024-01-04', count: 5 },
//     { date: '2024-01-05', count: 3 },
//     { date: '2024-01-06', count: 4 },
//     { date: '2024-01-07', count: 0 },
//     { date: '2024-01-08', count: 4 },
//     { date: '2024-01-09', count: 5 },
//     { date: '2024-01-10', count: 3 },
//     { date: '2024-01-11', count: 1 },
//     { date: '2024-01-12', count: 1 },
//     { date: '2024-01-13', count: 5 },
//     { date: '2024-01-19', count: 1 },
//     { date: '2024-01-20', count: 2 },
//     { date: '2024-01-21', count: 1 },
//     { date: '2024-01-22', count: 4 },
//     { date: '2024-01-23', count: 1 },
//     { date: '2024-01-24', count: 4 },
//     { date: '2024-01-25', count: 2 },
//     { date: '2024-01-26', count: 1 },
//     { date: '2024-01-27', count: 0 },
//     { date: '2024-01-28', count: 5 },
//     { date: '2024-01-29', count: 2 },
//     { date: '2024-01-30', count: 1 }
//   ];
