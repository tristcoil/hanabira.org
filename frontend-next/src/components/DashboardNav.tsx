"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";

import { useState, useEffect } from "react";

export default function DashboardNav() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]); // Re-run when darkMode changes

  return (
    <div className="w-full flex items-center justify-between border-b py-3 px-7 mt-20 lg:mt-0 bg-white dark:bg-gray-300">
      <div
        className="hidden ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full cursor-pointer"
        onClick={() => setDarkMode(!darkMode)}
      >
        {/* Display SunIcon or MoonIcon based on darkMode */}
        {darkMode ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
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




//         {/* <div className="p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full dark:border-gray-500">
//           <BellIcon className="h-5" />
//         </div>
//         <div className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full dark:border-gray-500">
//           <ChatBubbleLeftIcon className="h-5" />
//         </div> */}

// export default function DashboardNav() {
//   return (
//     <div className="w-full flex items-center justify-between border-b py-3 px-7 mt-16 lg:mt-0">
//       <input
//         type="text"
//         className="text-sm w-full flex-1 p-3 border rounded-md mr-3 lg:max-w-xl focus:outline-none"
//         placeholder="Search for Language, Verb, Nouns"
//       />
//       <div className="flex items-center">
//         <div className="p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full">
//           {/* <BellIcon className="h-5" /> */}
//         </div>
//         <div className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full">
//           {/* <ChatBubbleLeftIcon className="h-5" /> */}
//         </div>
//         <div className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full bg-dp bg-center bg-cover"></div>
//       </div>
//     </div>
//   );
// }

//DARK THEME
// export default function DashboardNav() {
//   return (
//     <div className="w-full flex items-center justify-between border-b py-3 px-7 mt-16 lg:mt-0 bg-white dark:bg-gray-300">
//       <input
//         type="text"
//         className="text-sm w-full flex-1 p-3 border rounded-md mr-3 lg:max-w-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-300 dark:border-gray-500 dark:bg-gray-200 dark:text-gray-200"
//         placeholder="Search for Language, Verb, Nouns"
//       />
//       <div className="flex items-center">
//         <div className="p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full dark:border-gray-500">
//           <BellIcon className="h-5" />
//         </div>
//         <div className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full dark:border-gray-500">
//           <ChatBubbleLeftIcon className="h-5" />
//         </div>
//         <div className="ml-2 p-1 border-2 h-9 w-9 flex items-center justify-center rounded-full bg-dp bg-center bg-cover dark:border-gray-500">
//         </div>
//       </div>
//     </div>
//   );
// }
