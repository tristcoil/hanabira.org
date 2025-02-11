"use client";

import { useState } from "react";

function ExampleVideos() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-left text-sm font-bold flex items-center justify-between w-full p-1 bg-gray-100 text-gray-800 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors"
      >
        Example Videos
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
          <p className="text-bold mb-2">Example videos:</p>
          <table className="min-w-full table-auto border-collapse">
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (BSJ Podcast) 仕事:
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=-cbuS40rNSw`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=-cbuS40rNSw
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (BSJ Podcast) 外国人:
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=UQ05S65tKPc`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=UQ05S65tKPc
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (BSJ Podcast) 日本人が使うSNS:
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=2ySIJ1wj4UE`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=2ySIJ1wj4UE
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (BSJ Podcast) 日本でイライラすること:
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=7_6OMDtbA7E`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=7_6OMDtbA7E
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (BSJ Podcast):
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=mjzZ5i9i2rY`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=mjzZ5i9i2rY
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (Akane):
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=r20IdWOSBFE`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=r20IdWOSBFE
                  </a>
                </td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-2 py-2 font-semibold text-slate-600">
                  (Yoshie):
                </td>
                <td className="px-2 py-2 text-slate-600">
                  <a
                    href={`/text-parser?type=youtube&url=https://www.youtube.com/watch?v=jSTH9NQoSUs`}
                    className="text-blue-600 hover:underline"
                  >
                    https://www.youtube.com/watch?v=jSTH9NQoSUs
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ExampleVideos;
