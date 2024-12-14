"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

//DARK MODE
export default function Nav() {
  const [active, setActive] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]); // Re-run when darkMode changes

  const showMenu = () => {
    setActive(!active);
  };

  return (
    <div className="hidden lg:block py-1 lg:p-1 flex flex-col items-center w-full bg-white dark:bg-zinc-400 sticky top-0 z-50 mr-0 bg-opacity-95">
      <div className="w-12/12 flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden lg:flex ml-20">
            <Link
              href="/"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Home{" "}
            </Link>
            {/* ... other links ... */}

            <Link
              href="/content"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Content{" "}
            </Link>

            {/* <Link
              href="/"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Features{" "}
            </Link> */}

            {/* <Link
              href="/blog"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Blog{" "}
            </Link> */}


            <Link
              href="/japanese/kana"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Kana{" "}
            </Link>

            <Link
              href="/radicals"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Radicals{" "}
            </Link>


            <Link
              href="/japanese/quick_kanji"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Quick Kanji{" "}
            </Link>

            <Link
              href="/japanese/quick_vocab"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Quick JLPT Vocabulary{" "}
            </Link>

            {/* <Link
              href="/downloads"
              className="mr-10 hover:text-gray-800 dark:hover:text-gray-600 font-medium"
            >
              {" "}
              Downloads{" "}
            </Link> */}
          </div>
        </div>

        <div className="hidden lg:flex mr-12">
          <div className="py-3 px-7 mt-16 lg:mt-0 ">
            <div
              className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full cursor-pointer"
              onClick={() => setDarkMode(!darkMode)}
            >
              {/* Display SunIcon or MoonIcon based on darkMode */}
              {darkMode ? <MoonIcon /> : <SunIcon />}
            </div>
          </div>

          {/* <div className="hidden lg:flex">
            <BuyMeACoffeeButton />
          </div> */}
        </div>

        <button
          onClick={showMenu}
          className="block text-gray-800 dark:text-gray-600 text-lg font-bold lg:hidden focus:outline-none"
        >
          {active ? "CLOSE" : "MENU"}
        </button>
      </div>

      <div
        id="menu"
        className={
          active
            ? "fixed lg:hidden bg-white dark:bg-gray-200 p-1 mt-8 text-xl w-10/12 text-black dark:text-gray-800 rounded-lg flex-auto h-screen bg-opacity-95"
            : "hidden"
        }
      >
        <div className="flex flex-col justify-center text-start mt-6">
          {/* ... mobile menu links ... */}
          <Link
            onClick={showMenu}
            className="border-b py-4 text-black dark:text-gray-800"
            href="/"
          >
            {" "}
            Home{" "}
          </Link>
          {/* ... other mobile menu links ... */}
        </div>
      </div>
    </div>
  );
}

// good version
const BuyMeACoffeeButton: React.FC = () => {
  return (
    <div>
      {/* causes huge delay */}
      {/* <link
        href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext"
        rel="stylesheet"
      /> */}
      <a
        className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.buymeacoffee.com/tcoilinfo"
      >
        <img
          className="h-9 w-9 mb-1"
          src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          alt="Buy me a coffee"
        />
        <span className="ml-3 text-lg">coffee</span>
      </a>
    </div>
  );
};

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
