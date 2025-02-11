"use client";

import { useState } from "react";

function SubtitleInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full mt-1 mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-left text-sm font-bold flex items-center justify-between w-full p-1 bg-gray-100 text-gray-800 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors"
      >
        How to get YouTube Subtitles
        <svg
          className={`w-5 h-5 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-white text-gray-700 rounded-md border border-gray-200 shadow-sm">
          <p className="text-sm font-bold text-slate-600 mb-2">
            YouTube subtitles work automatically for self-hosting case.
          </p>
          <p className="text-sm font-bold text-slate-600 mb-2">
            On hanabira.org website, you need to import subtitles manually
            (YouTube blocking Hanabira server/datacenter).
          </p>
          <div className="text-xs text-slate-600 space-y-1">
            <p>
              You can import your own YouTube subtitles, available for example
              via this service:
            </p>
            <p>
              <a
                href="https://www.downloadyoutubesubtitles.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                https://www.downloadyoutubesubtitles.com
              </a>{" "}
              (or any other subtitle source).
            </p>
            <p>
              We currently support upload of Japanese and secondary language
              subtitles in .srt format. Imported subtitles will be stored in browser Local Storage.
            </p>
            <p>
              Eventually, we will pre-generate subtitles for all videos in our
              YouTube Library.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubtitleInfo;
