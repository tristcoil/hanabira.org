"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import axios from "axios";
import he from "he";

import Tabs from "@/components-parser/Tabs";
import Tab from "@/components-parser/Tab";
import FuriganaConverterV2 from "@/components-parser/FuriganaConverterV2";

interface Subtitle {
  offset: number;
  duration: number;
  text: string;
}

interface YouTubeComponentProps {
  videoUrl: string;
  onSubtitleUpdate: (
    japaneseSubtitle: string,
    englishSubtitle: string,
    customSubtitle: string
  ) => void;
}

const YouTubeComponent: React.FC<YouTubeComponentProps> = ({
  videoUrl,
  onSubtitleUpdate,
}) => {
  const [videoId, setVideoId] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [japaneseSubtitles, setJapaneseSubtitles] = useState<
    Record<number, string>
  >({});
  const [englishSubtitles, setEnglishSubtitles] = useState<
    Record<number, string>
  >({});
  const [customSubtitles, setCustomSubtitles] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentJapaneseSubtitle, setCurrentJapaneseSubtitle] =
    useState<string>("");
  const [currentEnglishSubtitle, setCurrentEnglishSubtitle] =
    useState<string>("");
  const [currentCustomSubtitle, setCurrentCustomSubtitle] =
    useState<string>("");

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    if (videoUrl) {
      const url = new URL(videoUrl);
      const params = new URLSearchParams(url.search);
      const vParam = params.get("v");
      if (vParam) {
        setVideoId(vParam);
      }

      // Reset currentTime to 0 for new video
      setCurrentTime(0);

      setLoading(true);
      const fetchSubtitles = async () => {
        const [fetchedJapaneseSubtitles, fetchedEnglishSubtitles] =
          await Promise.all([
            getVideoSubtitles(videoUrl, "ja"),
            getVideoSubtitles(videoUrl, "en"),
          ]);
        setLoading(false);

        setSubtitles(fetchedJapaneseSubtitles, setJapaneseSubtitles);
        setSubtitles(fetchedEnglishSubtitles, setEnglishSubtitles);
      };

      fetchSubtitles();
    }
  }, [videoUrl]);

  const setSubtitles = (
    subtitles: Subtitle[],
    setSubtitlesState: React.Dispatch<
      React.SetStateAction<Record<number, string>>
    >
  ) => {
    if (subtitles.length > 0) {
      const subtitlesObj: Record<number, string> = {};
      subtitles.forEach((sub: Subtitle) => {
        const endTime = sub.offset + sub.duration;
        for (let i = Math.floor(sub.offset); i < Math.floor(endTime); i++) {
          subtitlesObj[i] = sub.text;
        }
      });
      setSubtitlesState(subtitlesObj);
    } else {
      setSubtitlesState({});
    }
  };

  const getVideoSubtitles = async (
    videoURL: string,
    lang: string
  ): Promise<Subtitle[]> => {
    const cachedSubtitles = localStorage.getItem(`${videoURL}_${lang}`);
    const url = `/d-api/v1/get-transcript?url=${videoURL}&lang=${lang}`;

    if (cachedSubtitles) {
      return JSON.parse(cachedSubtitles);
    } else {
      try {
        const transcriptResponse = await axios.get(url);
        const fetchedSubtitles: Subtitle[] = transcriptResponse.data.transcript;
        localStorage.setItem(
          `${videoURL}_${lang}`,
          JSON.stringify(fetchedSubtitles)
        );
        return fetchedSubtitles;
      } catch (error) {
        console.error("Failed to fetch subtitles:", error);
        return [];
      }
    }
  };

  const handleOnReady = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime);
    }
    setIsPlaying(true);
  };

  const handleOnProgress: ReactPlayerProps["onProgress"] = ({
    playedSeconds,
  }) => {
    setCurrentTime(Math.floor(playedSeconds));
    // Decode the fetched subtitle text before setting it
    const rawJapaneseSubtitle = japaneseSubtitles[Math.floor(playedSeconds)] || "";
    const rawEnglishSubtitle = englishSubtitles[Math.floor(playedSeconds)] || "";
    const rawCustomSubtitle = customSubtitles[Math.floor(playedSeconds)] || "";

    const decodedJapaneseSubtitle = he.decode(rawJapaneseSubtitle);
    const decodedEnglishSubtitle = he.decode(rawEnglishSubtitle);
    const decodedCustomSubtitle = he.decode(rawCustomSubtitle);

    setCurrentJapaneseSubtitle(decodedJapaneseSubtitle);
    setCurrentEnglishSubtitle(decodedEnglishSubtitle);
    setCurrentCustomSubtitle(decodedCustomSubtitle);

    onSubtitleUpdate(
      decodedJapaneseSubtitle,
      decodedEnglishSubtitle,
      decodedCustomSubtitle
    );
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      {videoId && (
        <>
          <div className="flex justify-center mt-5">
            {videoUrl && (
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                playing={isPlaying}
                onReady={handleOnReady}
                onProgress={handleOnProgress}
                controls={true}
              />
            )}
          </div>
          <div className="flex justify-center my-5">
            <button
              className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
              onClick={handlePlayPause}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </div>

          <Tabs>
            <Tab label="Furigana">
              <div className="h-40">
                <FuriganaConverterV2
                  japaneseSubtitle={currentJapaneseSubtitle}
                />
              </div>
            </Tab>

            <Tab label="Japanese">
              <div className="flex justify-center mt-2 text-4xl h-40">
                <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
                  {currentJapaneseSubtitle || "\u00A0"}
                </div>
              </div>
            </Tab>

            <Tab label="English">
              <div className="flex justify-center mt-2 text-2xl h-24">
                <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
                  {currentEnglishSubtitle || "\u00A0"}
                </div>
              </div>
            </Tab>

            <Tab label="Japanese+English">
              <div className="flex justify-center mt-2 text-4xl h-40">
                <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
                  {currentJapaneseSubtitle || "\u00A0"}
                </div>
              </div>
              <div className="flex justify-center mt-2 text-2xl h-24">
                <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
                  {currentEnglishSubtitle || "\u00A0"}
                </div>
              </div>
            </Tab>

            <Tab label="Furigana+English">
              <div className="h-40">
                <FuriganaConverterV2
                  japaneseSubtitle={currentJapaneseSubtitle}
                />
              </div>
              <div className="flex justify-center mt-2 text-2xl h-24">
                <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
                  {currentEnglishSubtitle || "\u00A0"}
                </div>
              </div>
            </Tab>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default YouTubeComponent;

















// ORIGINAL CODE THAT WORKED DECENT IN PROD, just had those ampersands in english subtitles

// "use client";

// // ---------------------- YouTube component------------------------------------ //
// // url injection as props, returns current subtitle back to parent //

// import React, { useEffect, useState, useRef } from "react";
// import ReactPlayer, { ReactPlayerProps } from "react-player";
// import { FaPlay, FaPause } from "react-icons/fa";
// import axios from "axios";

// import Tabs from "@/components-parser/Tabs";
// import Tab from "@/components-parser/Tab";

// import FuriganaConverterV2 from "@/components-parser/FuriganaConverterV2";

// interface Subtitle {
//   offset: number;
//   duration: number;
//   text: string;
// }

// interface YouTubeComponentProps {
//   videoUrl: string;
//   onSubtitleUpdate: (
//     japaneseSubtitle: string,
//     englishSubtitle: string,
//     customSubtitle: string
//   ) => void;
// }

// const YouTubeComponent: React.FC<YouTubeComponentProps> = ({
//   videoUrl,
//   onSubtitleUpdate,
// }) => {
//   const [videoId, setVideoId] = useState<string>("");
//   const [currentTime, setCurrentTime] = useState<number>(0);
//   const [japaneseSubtitles, setJapaneseSubtitles] = useState<
//     Record<number, string>
//   >({});
//   const [englishSubtitles, setEnglishSubtitles] = useState<
//     Record<number, string>
//   >({});
//   const [customSubtitles, setCustomSubtitles] = useState<
//     Record<number, string>
//   >({});
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isPlaying, setIsPlaying] = useState<boolean>(false);
//   const [currentJapaneseSubtitle, setCurrentJapaneseSubtitle] =
//     useState<string>("");
//   const [currentEnglishSubtitle, setCurrentEnglishSubtitle] =
//     useState<string>("");
//   const [currentCustomSubtitle, setCurrentCustomSubtitle] =
//     useState<string>("");

//   const playerRef = useRef<ReactPlayer>(null);



//   useEffect(() => {
//     if (videoUrl) {
//       const url = new URL(videoUrl);
//       const params = new URLSearchParams(url.search);
//       const vParam = params.get("v");
//       if (vParam) {
//         setVideoId(vParam);
//       }
  
//       // Reset currentTime to 0 for new video
//       setCurrentTime(0);
  
//       setLoading(true);
//       const fetchSubtitles = async () => {
//         const [fetchedJapaneseSubtitles, fetchedEnglishSubtitles] =
//           await Promise.all([
//             getVideoSubtitles(videoUrl, "ja"),
//             getVideoSubtitles(videoUrl, "en"),
//           ]);
//         setLoading(false);
  
//         setSubtitles(fetchedJapaneseSubtitles, setJapaneseSubtitles);
//         setSubtitles(fetchedEnglishSubtitles, setEnglishSubtitles);
//       };
  
//       fetchSubtitles();
//     }
//   }, [videoUrl]);
  







//   const setSubtitles = (
//     subtitles: Subtitle[],
//     setSubtitlesState: React.Dispatch<
//       React.SetStateAction<Record<number, string>>
//     >
//   ) => {
//     if (subtitles.length > 0) {
//       const subtitlesObj: Record<number, string> = {};
//       subtitles.forEach((sub: Subtitle) => {
//         const endTime = sub.offset + sub.duration;
//         for (let i = Math.floor(sub.offset); i < Math.floor(endTime); i++) {
//           subtitlesObj[i] = sub.text;
//         }
//       });
//       setSubtitlesState(subtitlesObj);
//     } else {
//       setSubtitlesState({});
//     }
//   };


//   const handleOnReady = () => {
//     if (playerRef.current) {
//       playerRef.current.seekTo(currentTime);
//     }
//     setIsPlaying(true);
//   };



//   const handleOnProgress: ReactPlayerProps["onProgress"] = ({
//     playedSeconds,
//   }) => {
//     setCurrentTime(Math.floor(playedSeconds));
//     const newJapaneseSubtitle =
//       japaneseSubtitles[Math.floor(playedSeconds)] || "";
//     const newEnglishSubtitle =
//       englishSubtitles[Math.floor(playedSeconds)] || "";
//     const newCustomSubtitle = customSubtitles[Math.floor(playedSeconds)] || "";

//     setCurrentJapaneseSubtitle(newJapaneseSubtitle);
//     setCurrentEnglishSubtitle(newEnglishSubtitle);
//     setCurrentCustomSubtitle(newCustomSubtitle);

//     onSubtitleUpdate(
//       newJapaneseSubtitle,
//       newEnglishSubtitle,
//       newCustomSubtitle
//     );
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };



// // ----


// useEffect(() => {
//   if (videoUrl) {
//     // Clear cached subtitles to ensure fresh data
//     localStorage.removeItem(`${videoUrl}_ja`);
//     localStorage.removeItem(`${videoUrl}_en`);

//     // Reset currentTime to 0 for new video
//     setCurrentTime(0);

//     setLoading(true);
//     const fetchSubtitles = async () => {
//       const [fetchedJapaneseSubtitles, fetchedEnglishSubtitles] = await Promise.all([
//         getVideoSubtitles(videoUrl, "ja"),
//         getVideoSubtitles(videoUrl, "en"),
//       ]);
//       setLoading(false);

//       setSubtitles(fetchedJapaneseSubtitles, setJapaneseSubtitles);
//       setSubtitles(fetchedEnglishSubtitles, setEnglishSubtitles);
//     };

//     fetchSubtitles();
//   }
// }, [videoUrl]);

// const getVideoSubtitles = async (videoURL: string, lang: string): Promise<Subtitle[]> => {
//   const url = `/d-api/v1/get-transcript?url=${videoURL}&lang=${lang}`;
//   try {
//     const transcriptResponse = await axios.get(url);
//     const fetchedSubtitles: Subtitle[] = transcriptResponse.data.transcript;
//     // Re-cache with decoded data (optional)
//     localStorage.setItem(`${videoURL}_${lang}`, JSON.stringify(fetchedSubtitles));
//     return fetchedSubtitles;
//   } catch (error) {
//     console.error("Failed to fetch subtitles:", error);
//     return [];
//   }
// };


// // ---

//   return (
//     <div>
//       {videoId && (
//         <>
//           <div className="flex justify-center mt-5">
//             {videoUrl && (
//               <ReactPlayer
//                 ref={playerRef}
//                 url={videoUrl}
//                 playing={isPlaying}
//                 onReady={handleOnReady}
//                 onProgress={handleOnProgress}
//                 controls={true}
//               />
//             )}
//           </div>
//           <div className="flex justify-center my-5">
//             <button
//               className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
//               onClick={handlePlayPause}
//             >
//               {isPlaying ? <FaPause /> : <FaPlay />}
//             </button>
//           </div>

//           <Tabs>
//             <Tab label="Furigana">
//               <div className="h-40">
//                 <FuriganaConverterV2
//                   japaneseSubtitle={currentJapaneseSubtitle}
//                 />
//               </div>
//             </Tab>

//             <Tab label="Japanese">
//               <div className="flex justify-center mt-2 text-4xl h-40">
//                 <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
//                   {currentJapaneseSubtitle || "\u00A0"}
//                 </div>
//               </div>
//             </Tab>

//             <Tab label="English">
//               <div className="flex justify-center mt-2 text-2xl h-24">
//                 <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
//                   {currentEnglishSubtitle || "\u00A0"}
//                 </div>
//               </div>
//             </Tab>

//             <Tab label="Japanese+English">
//               <div className="flex justify-center mt-2 text-4xl h-40">
//                 <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
//                   {currentJapaneseSubtitle || "\u00A0"}
//                 </div>
//               </div>
//               <div className="flex justify-center mt-2 text-2xl h-24">
//                 <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
//                   {currentEnglishSubtitle || "\u00A0"}
//                 </div>
//               </div>
//             </Tab>

//             <Tab label="Furigana+English">
//               <div className="h-40">
//                 <FuriganaConverterV2
//                   japaneseSubtitle={currentJapaneseSubtitle}
//                 />
//               </div>
//               <div className="flex justify-center mt-2 text-2xl h-24">
//                 <div className="bg-gray-200 bg-opacity-50 p-4 rounded min-h-full">
//                   {currentEnglishSubtitle || "\u00A0"}
//                 </div>
//               </div>
//             </Tab>
//           </Tabs>
//         </>
//       )}
//     </div>
//   );
// };

// export default YouTubeComponent;
