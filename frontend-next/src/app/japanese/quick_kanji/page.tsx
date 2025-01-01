"use client";

import Link from "next/link";
import React from "react";
import { useState, useEffect } from "react";

//http://localhost:3000/japanese/kanji_overview

// pages/index.js

export default function Home() {
  // Define your hiragana characters and their romaji
  const hiragana = [
    { kanji: "末", reading: "マツ", k_audio: "/audio/japanese/kanji/k_末.mp3" },
    {
      kanji: "若い",
      reading: "わかい",
      k_audio: "/audio/japanese/kanji/k_若い.mp3",
    },
    { kanji: "晩", reading: "バン", k_audio: "/audio/japanese/kanji/k_晩.mp3" },
    { kanji: "皿", reading: "さら", k_audio: "/audio/japanese/kanji/k_皿.mp3" },

    //... add all characters
  ];

  interface HiraganaCardProps {
    kanji: string;
    reading: string;
    k_audio: string;
  }

  const HiraganaCard: React.FC<HiraganaCardProps> = ({
    kanji,
    reading,
    k_audio,
  }) => {
    // Function to play audio
    const playAudio = () => {
      const audioElement = new Audio(k_audio);
      audioElement.play();
    };

    // return (
    //   <div className="w-24 h-16" onClick={playAudio}>
    //     <div className="relative w-full h-full">
    //       <div className="bg-slate-100 absolute inset-0 transition duration-75 ease-in-out transform hover:opacity-0 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
    //         <h5 className="text-2xl text-gray-900">{kanji}</h5>
    //       </div>
    //       <div className="bg-slate-300 absolute inset-0 transition duration-75 ease-in-out transform opacity-0 hover:opacity-100 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
    //         <h5 className="text-xl text-gray-700">{reading}</h5>
    //       </div>
    //     </div>
    //   </div>
    // );


    return (
      <div className="w-24 h-16" onClick={playAudio}>
        <div className="relative w-full h-full">
          {/* Front of the Card */}
          <div className="bg-slate-100 absolute inset-0 transition duration-75 ease-in-out transform hover:opacity-0 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
            <h5 className="text-2xl text-gray-900">{kanji}</h5>
          </div>
  
          {/* Back of the Card */}
          <div className="bg-slate-300 absolute inset-0 transition duration-75 ease-in-out transform opacity-0 hover:opacity-100 rounded-lg shadow-md flex items-center justify-center p-2 border border-gray-200">
            <h5 className="text-xl text-gray-700">{reading}</h5>
  
            {/* Icon Link at the Bottom Left */}
            <Link
              href={`https://www.japandict.com/kanji/?s=${encodeURIComponent(kanji)}`}
              passHref
              className="absolute bottom-1 left-1 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 -960 960 960"
                  className="w-4 h-4 text-gray-700"
                >
                  <path d="M240-400q-33 0-56.5-23.5T160-480t23.5-56.5T240-560t56.5 23.5T320-480t-23.5 56.5T240-400m240 0q-33 0-56.5-23.5T400-480t23.5-56.5T480-560t56.5 23.5T560-480t-23.5 56.5T480-400m240 0q-33 0-56.5-23.5T640-480t23.5-56.5T720-560t56.5 23.5T800-480t-23.5 56.5T720-400" />
                </svg>
            </Link>
          </div>
        </div>
      </div>
    );





















  };

  // Define the type for a single item of Kanji data
  interface KanjiItem {
    kanji: string;
    reading: string;
    k_audio: string;
  }

  interface KanjiTableProps {
    p_tag: string; // Explicitly stating p_tag is of any type
  }
  
  const KanjiTable: React.FC<KanjiTableProps> = ({ p_tag }) => {
    const [kanjiData, setKanjiData] = useState<KanjiItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        if (!p_tag) return; // If no p_tag is provided, don't attempt to fetch data

        setLoading(true);
        try {
          console.log(
            "##################################  ENV VARS  #######################################"
          );
          console.log(process.env.REACT_APP_HOST_IP);

          //const host = "localhost";
          const port = 8000;


          // NOTE: process.env propagates to client components only when we prefix our vars as 
          // - NEXT_PUBLIC_XXXX=${API_URL}

          let apiUrl;
          // If REACT_APP_HOST_IP is defined, use it. Otherwise default to localhost:7000 for VM
          if (process.env.REACT_APP_HOST_IP) {
            apiUrl = `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/kanji?p_tag=${p_tag}`;
          } else {
            //apiUrl = `http://${host}:${port}/e-api/v1/kanji?p_tag=${p_tag}`;
            apiUrl = `/e-api/v1/kanji?p_tag=${p_tag}`;   // use for client components
          }

          const response = await fetch(`${apiUrl}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`); // Throw error for bad response
          }
          const data: KanjiItem[] = await response.json();
          setKanjiData(data); // Assuming the API returns the array of kanji data
        } catch (error) {
          console.error("Error fetching kanji data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [p_tag]); // Only re-run the effect if p_tag changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
      <div>
        <div className="flex flex-wrap justify-center gap-4">
          {kanjiData.map((item, index) => (
            <HiraganaCard
              key={index}
              kanji={item.kanji}
              reading={item.reading}
              k_audio={item.k_audio}
            />
          ))}
        </div>
      </div>
    );
  };

  const TabComponent = () => {
    const [activeTab, setActiveTab] = useState("jlpt n3");

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex border-b overflow-auto">
          {["JLPT N5", "JLPT N4", "JLPT N3"].map((tab, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-lg font-medium ${
                activeTab === tab.toLowerCase()
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "jlpt n5" && <KanjiTable p_tag="JLPT_N5" />}
          {activeTab === "jlpt n4" && <KanjiTable p_tag="JLPT_N4" />}
          {activeTab === "jlpt n3" && <KanjiTable p_tag="JLPT_N3" />}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-4 mt-4">Quick Kanji</h1>
        <p className="text-gray-700 text-sm">
          We are picking a subset of kanji for each JLPT level that has one
          dominant reading. While these kanji generally have multiple readings,
          chosen readings should be sufficient for given JLPT level. This
          section is meant to treat specific kanji more like an alphabet, so we
          can anchor our reading around them. Once we master these kanji sets,
          reading Japanese texts should become significantly easier. Keep in
          mind that this is NOT full kanji list for JLPT N5-N1 and even chosen
          readings are just partial.
        </p>
      </div>

      <TabComponent />
    </div>
  );
}
