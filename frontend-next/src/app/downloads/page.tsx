//'use client';

import Link from "next/link";
import React from "react";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";

export default function Downloads() {
  // const files = [
  //   "grammar_ja_N1_full_alphabetical_0001.json",
  //   "grammar_ja_N2_full_alphabetical_0001.json",
  //   "grammar_ja_N3_full_alphabetical_0001.json",
  //   "grammar_ja_N4_full_alphabetical_0001.json",
  //   "grammar_ja_N5_full_alphabetical_0001.json",
  // ];

  return (
    <div className="grid lg:grid-cols-body p-5">
      <div className="lg:col-span-10">
        <h1 className="text-blue-900 text-3xl font-bold">Downloads</h1>

        <div className="grid grid-cols-3 gap-4 text-center m-2 sm:m-8">
          <div className="m-2 p-2 sm:m-4 sm:p-4 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="text-lg sm:text-xl font-semibold text-slate-600">
              <p>花びらより</p>
              <p>無料でダウンロード</p>
              <p>流れるよう</p>
            </div>
          </div>

          <div className="m-2 p-2 sm:m-4 sm:p-4 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="text-md sm:text-lg text-gray-600">
              <p>Hanabira yori</p>
              <p>Muryou de daunroodo</p>
              <p>Nagareru you</p>
            </div>
          </div>

          <div className="m-2 p-2 sm:m-4 sm:p-4 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <div className="text-sm sm:text-base text-gray-600">
              <p>From the petals</p>
              <p>Downloads free, drifting</p>
              <p>Flowing gracefully</p>
            </div>
          </div>
        </div>

        <br></br>

        <div className="max-w-4xl w-full p-6 bg-white shadow-xl rounded-lg border border-gray-200">
          <h2 className="text-gray-800 font-semibold text-2xl mb-5 border-b pb-2 border-gray-300">
            Downloads:
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            These files are the contents of vocabulary, grammar and example
            sentences created in-house at hanabira.org. They might still contain
            errors and typos. Use with caution. The files can be used for
            personal or commercial purposes for free. We only ask that you
            credit hanabira.org as the source. Creative Commons License.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Download:
          </h3>

          <a
            href="https://github.com/tristcoil/hanabira.org-japanese-content"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub Repository
          </a>

          {/* <ul className="list-disc pl-5">
            {files.map((file, index) => (
              <li key={index} className="mb-2">
                <a
                  href={`/downloads/json/${file}`}
                  download
                  className="text-blue-600 hover:text-blue-800 transition duration-300"
                >
                  {file}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Audio Download:
            </h3>
            <a
              href="/downloads/audio/japanese_grammar_audio.zip"
              download
              className="text-blue-600 hover:text-blue-800 transition duration-300"
            >
              japanese_grammar_audio.zip (~50MB)
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
