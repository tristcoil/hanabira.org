"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

interface LoginData {
  date: string;
  count: number;
}

interface LoginResponse {
  message?: string;
  error?: string;
}

export default function Sidebar() {
  const [active, setActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]); // You might want to adjust this dependency array based on your needs

  const showMenu = () => {
    setActive(!active);
  };

  // --- //

  useEffect(() => {
    const userName = Cookies.get("hanabira_userName");
    const userId = Cookies.get("hanabira_userId");
    const token = Cookies.get("hanabira_jwt");

    if (userName && userId && token) {
      setLoggedIn(true);
      setUserName(userName);
      setUserId(userId);
      setJwtToken(token);
    }
  }, []);

  const handleLogin = () => {
    // TODO: connect to google login
    const userName = "testUserName";
    const userId = "testUserId"; // Assign or generate a user ID as needed
    const jwt = "AAA.BBB.CCC"; // Use a valid JWT token

    // Store in cookies
    Cookies.set("hanabira_userName", userName, { expires: 7 });
    Cookies.set("hanabira_userId", userId, { expires: 7 });
    Cookies.set("hanabira_jwt", jwt, { expires: 7 });

    // Update state
    setLoggedIn(true);
    setUserName(userName);
    setUserId(userId);
    setJwtToken(jwt);
    notifyLogin(userName, userId, jwt); // Notify backend
  };

  const handleLogout = () => {
    // Remove user and token from cookies
    Cookies.remove("hanabira_userName");
    Cookies.remove("hanabira_userId");
    Cookies.remove("hanabira_jwt");

    // Update state
    setLoggedIn(false);
    setUserName("");
    setUserId("");
    setJwtToken("");
  };

  const notifyLogin = async (
    userName: string,
    userId: string,
    jwt: string
  ): Promise<void> => {
    try {
      const response = await fetch(`/f-api/v1/notify-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include JWT in headers if needed
          // "Authorization": `Bearer ${jwt}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data: LoginResponse = await response.json();
      if (data.message) {
        console.log(data.message); // Success message
      } else if (data.error) {
        console.error("Error notifying login:", data.error); // Error handling
      }
    } catch (error) {
      console.error("Error notifying login:", error);
    }
  };

  // --- //

  return (
    <div className="flex flex-col items-center p-1 border-r border-gray-200 dark:border-gray-600 fixed w-full bg-slate-100 dark:bg-gray-800 lg:sticky top-0 z-20">
      <div className="flex lg:flex-col items-center justify-between w-full p-1 px-4 lg:p-0">
        <div className="text-center lg:mt-3">
          <Link href="/" className="dashboardOption">
            <h1 className="text-blue-900 dark:text-blue-300 text-3xl font-bold">
              Hanabira
            </h1>
            {/* <h1 className="text-blue-900 dark:text-blue-300 text-3xl font-bold">
            花びら
            </h1> */}
            {/* <h1 className="text-blue-900 dark:text-blue-300 text-3xl font-bold">
            하나비라
            </h1> */}
            {/* <h1 className="text-blue-900 dark:text-blue-300 text-3xl font-bold">
            哈娜比拉
            </h1> */}
            {/* <h1 className="text-blue-900 dark:text-blue-300 text-3xl font-bold">
            ฮานาบิระ
            </h1> */}
          </Link>

          {/* Here’s how "hanabira" (はなびら, meaning "flower petal" in Japanese) could be written phonetically in various languages:
           Korean (Hangul): 하나비라 (hanabira)
           Thai: ฮานาบิระ (ha-na-bi-ra)
           Mandarin (Pinyin): 哈娜比拉 (hānàbǐlā)
           Vietnamese: ha-na-bi-ra
           These are phonetic transliterations and not literal translations.  */}

          {/* <h2 className=" text-blue-900 dark:text-blue-300 text-xl  text-left ml-3">
              花びら
            </h2> */}
          <p className="hidden lg:flex ml-3 text-blue-900/90 dark:text-blue-300/60">
            hanabira.org
          </p>
          <p className=" lg:flex ml-3 text-blue-900/90 dark:text-blue-300/60 text-left text-xs">
            Public Alpha v0.3.5
          </p>
          {/* <p className="lg:hidden mt-2 ml-3 text-sm text-blue-900/60 dark:text-blue-300/60">
            Your journey to Japanese fluency (JLPT N5-N1).
          </p> */}
        </div>

        <div className="hidden lg:flex flex-col w-full">
          <div className="flex flex-col items-center justify-center space-y-4 mt-4">
            {/* Conditionally render login/logout button based on login status */}
            {loggedIn ? (
              <div className="text-center">
                <p className="text-lg font-bold text-primary dark:text-white mb-2">
                  Welcome, {userName}!
                </p>
                <p className="text-xs font-bold text-primary dark:text-white mb-2">
                  userName: {userName}
                </p>
                <p className="text-xs font-bold text-primary dark:text-white mb-2">
                  userId: {userId}
                </p>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white font-bold text-lg rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-slate-500 text-white font-bold text-lg rounded hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                Login
              </button>
            )}
          </div>

          <div className="flex flex-col w-full mt-10">
            <hr />
            {/* Main Section */}
            {/* <div className="text-sm font-bold mt-4 mb-1 ml-3">Main</div> */}
            {/* <Link href="/" className="dashboardOption">
              Home
            </Link>
            <Link href="/content" className="dashboardOption">
              Content
            </Link> */}
            <Link href="/user-dashboard" className="dashboardOption">
              User Dashboard
            </Link>

            {/* Tools */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Tools
            </div>
            <hr />
            <Link href="/text-parser" className="dashboardOption">
              Text Parser
            </Link>
            <Link href="/text-parser?type=youtube" className="dashboardOption">
              YouTube immersion
            </Link>
            <Link href="/grammar-graph" className="dashboardOption">
              Grammar graph
            </Link>
            <Link href="/translate" className="dashboardOption">
              Translator
            </Link>
            <Link href="/word-relations" className="dashboardOption">
              Word relations
            </Link>

            {/* Library */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Library
            </div>
            <Link href="/podcasts" className="dashboardOption">
              YouTube library
            </Link>
            <Link href="/custom-text" className="dashboardOption">
              My articles library
            </Link>
            <Link href="/my-vocabulary" className="dashboardOption">
              My vocabulary
            </Link>

            {/* Japanese Section */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Japanese
            </div>
            <hr />
            <Link href="/japanese/grammarlist" className="dashboardOption">
              JLPT Grammar List
            </Link>
            <Link
              href="/japanese/vocabulary_selection/essential_verbs"
              className="dashboardOption"
            >
              Essential Japanese verbs
            </Link>
            <Link href="/japanese/kanji" className="dashboardOption">
              Kanji
            </Link>
            <Link href="/japanese/flashcards" className="dashboardOption">
              SRS Flashcards
            </Link>
            {/* <Link href="/japanese/flashcards-kanji" className="dashboardOption">
              SRS Flashcards - Kanji
            </Link>
            <Link href="/japanese/flashcards-words" className="dashboardOption">
              SRS Flashcards - Vocabulary
            </Link> */}

            {/* NEEDS SERIOUS REWORK */}
            {/* <Link href="/japanese/reading" className="dashboardOption">
              Japanese Reading
            </Link> */}

            {/* Korean Section */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Korean
            </div>
            <hr />
            <Link href="/langs/korean/grammarlist" className="dashboardOption">
              Korean Grammar
            </Link>

            {/* Other */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Other
            </div>
            <hr />
            <Link href="/downloads" className="dashboardOption">
              Downloads
            </Link>
            <Link href="/about" className="dashboardOption">
              About
            </Link>

            {/* Experimental */}
            <div className="text-sm font-bold mt-4 mb-1 ml-3 text-gray-800 dark:text-gray-200">
              Experimental
            </div>
            {/* <hr /> */}
            <Link href="/songify-vocabulary" className="dashboardOption">
              Songify vocabulary
            </Link>

            <br></br>
            <br></br>

            {/* <Link href="/blog" className="dashboardOption">
              Blog
            </Link> */}

            <Link
              href="/langs/mandarin/grammarlist"
              className="dashboardOption"
            >
              Chinese Grammar
            </Link>

            {/* <Link
              href="/langs/vietnamese/grammarlist"
              className="dashboardOption"
            >
              Vietnamese Grammar
            </Link>
            <Link
              href="/langs/mandarin/grammarlist"
              className="dashboardOption"
            >
              Chinese Grammar
            </Link>
            <Link href="/langs/thai/grammarlist" className="dashboardOption">
              Thai Grammar
            </Link> */}
          </div>
        </div>
        <div>
          {/* Conditionally render login/logout button based on login status */}
          {loggedIn ? (
            <div>
              <p className="block text-primary dark:text-white text-lg font-bold lg:hidden focus:outline-none">
                {userName}
              </p>
              <button
                onClick={handleLogout}
                className="block text-primary dark:text-white text-lg font-bold lg:hidden focus:outline-none"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="block text-primary dark:text-white text-lg font-bold lg:hidden focus:outline-none"
            >
              Login
            </button>
          )}
        </div>
        <div>
          <button
            onClick={showMenu}
            className="block text-primary dark:text-white text-lg font-bold lg:hidden focus:outline-none"
          >
            {active ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>
      {/* Phone Bar */}
      <div
        id="menu"
        className={
          active
            ? "relative lg:hidden mt-6 text-l w-11/12 text-black dark:text-white rounded-lg flex-auto h-screen"
            : "hidden"
        }
      >
        <div
          className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => setDarkMode(!darkMode)}
        >
          {/* Display SunIcon or MoonIcon based on darkMode */}
          {darkMode ? <MoonIcon /> : <SunIcon />}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4">
          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/"
          >
            {" "}
            Home{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/content"
          >
            {" "}
            Content{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/about"
          >
            {" "}
            About{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/text-parser"
          >
            {" "}
            Text Parser{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/text-parser?type=youtube"
          >
            {" "}
            Youtube Immersion{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/grammar-graph"
          >
            {" "}
            Grammar graph{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/translate"
          >
            {" "}
            Translator{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/word-relations"
          >
            {" "}
            Word relations{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/blog"
          >
            {" "}
            Blog{" "}
          </Link> */}

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/songify-vocabulary"
          >
            {" "}
            Songify vocabulary{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/kanji"
          >
            {" "}
            Kanji{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/vocabulary_selection/JLPT_N3"
          >
            {" "}
            Vocabulary JLPT N3{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/grammarlist"
          >
            {" "}
            Japanese Grammar List{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/langs/korean/grammarlist"
          >
            {" "}
            Korean Grammar List{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/vocabulary_selection/essential_verbs"
          >
            {" "}
            Essential Japanese verbs{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/flashcards"
          >
            {" "}
            SRS flashcards{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/flashcards-kanji"
          >
            {" "}
            Kanji flashcards{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/flashcards-words"
          >
            {" "}
            Vocabulary flashcards{" "}
          </Link> */}

          {/* NEEDS SERIOUS REWORK */}
          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/reading"
          >
            {" "}
            Japanese reading{" "}
          </Link> */}

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/kana"
          >
            {" "}
            Kana{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/radicals"
          >
            {" "}
            Radicals{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/quick_kanji"
          >
            {" "}
            Quick Kanji{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/japanese/quick_vocab"
          >
            {" "}
            Quick JLPT Vocabulary{" "}
          </Link>

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/my-vocabulary"
          >
            {" "}
            My vocabulary{" "}
          </Link> */}

          {/* <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/custom-text"
          >
            {" "}
            My text library{" "}
          </Link> */}

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/podcasts"
          >
            {" "}
            YouTube library{" "}
          </Link>

          <Link
            onClick={showMenu}
            className="border-b py-2 text-black dark:text-white"
            href="/user-dashboard"
          >
            {" "}
            User Dashboard{" "}
          </Link>

          <div></div>
        </div>
      </div>
    </div>
  );
}

// SunIcon component
const SunIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
      />
    </svg>
  );
};

// MoonIcon component
const MoonIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
};
