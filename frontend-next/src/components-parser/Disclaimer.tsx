'use client';

import { useState } from "react";


function Disclaimer() {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="w-full mr-5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-left text-sm font-bold flex items-center justify-between w-full p-4 bg-blue-100 text-blue-800 rounded-md border border-blue-200 hover:bg-blue-200 transition-colors"
        >
          Disclaimer
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? "rotate-180" : ""
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
          <div className="mt-2 p-4 bg-blue-50 text-blue-900 rounded-md border border-blue-200 shadow-sm">
            <p className="text-xs">
              Japanese text parser is using Mecab, KuroShiro, Jitendex, JMDICT,
              KANJIDIC, Deepl (for translations) and Chat GPT for grammar
              explanations. We have noticed that Mecab parser is sometimes
              injecting incorrect furigana above single kanji words. But when we
              use KuroShiro on the whole sentence, we typically get correct
              furigana injections. Also Chat GPT and Deepl sometimes make
              mistakes. But overall we would say that the text reading assistant
              is reliable tool in general. It is expected that reader will have
              some basic knowledge of Japanese when using this tool.
            </p>
            <p className="text-xs mt-2">
              Keep in mind that automatic translations made by DEEPL/Chat GPT may
              be misleading. The same applies to grammar and sentiment
              explanations made by Chat GPT. Do not use for translations of
              materials of high importance—such as medical, legal, and so on.
            </p>
          </div>
        )}
      </div>
    );
  }

export default Disclaimer;