"use client";

//import { useEffect, useState } from "react";
import { useState } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";


const MySpeakerWaveIcon = ({ audio_path }: { audio_path: string }) => {
  const [color, setColor] = useState("black");
  const [cursor, setCursor] = useState("default");

  const start = (url: string) => {
    const audio = new Audio(url);
    audio.play();

    // Clean up after the audio finishes
    audio.onended = () => {
      audio.pause();
      audio.src = "";
    };
  };

  return (
    <SpeakerWaveIcon
      className="h-5 text-blue-900"
      style={{ color, cursor }}
      onMouseEnter={() => {
        setColor("blue");
        setCursor("pointer");
      }}
      onMouseLeave={() => {
        setColor("black");
        setCursor("default");
      }}
      onClick={() => {
        console.log(audio_path);
        start(audio_path);
      }}
    />
  );
};

export default MySpeakerWaveIcon;



// const MySpeakerWaveIcon = ({ audio_path }: { audio_path: any }) => {
//   const [color, setColor] = useState("black");
//   const [cursor, setCursor] = useState("default");
//   const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
//
//   useEffect(() => {
//     setAudio(new Audio());
//     // Clean up the audio element on component unmount
//     return () => {
//       if (audio) {
//         audio.pause();
//         setAudio(null);
//       }
//     };
//   }, []);
//
//   const start = (url: string) => {
//     if (audio) {
//       audio.src = url;
//       audio.play();
//     }
//   };
//
//   useEffect(() => {
//     if (audio) {
//       audio.play();
//     }
//   }, [audio]);
//
//   return (
//     <SpeakerWaveIcon
//       className="h-5 text-blue-900"
//       style={{ color, cursor }}
//       onMouseEnter={() => {
//         setColor("blue");
//         setCursor("pointer");
//       }}
//       onMouseLeave={() => {
//         setColor("black");
//         setCursor("default");
//       }}
//       onClick={() => {
//         console.log(audio_path);
//         start(audio_path);
//       }}
//     />
//   );
// };
//
// export default MySpeakerWaveIcon;
