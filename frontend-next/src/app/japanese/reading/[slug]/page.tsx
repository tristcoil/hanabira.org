"use client";

import useSWR from "swr";

import ReadingComponent from "@/components/ReadingComponent";

interface SentenceData {
  japanese: string;
  romanization: string;
  translation: string;
  audioPath: string;
}

interface ReadingData {
  key: string;
  title: string;
  p_tag: string;
  s_tag: string;
  textAudio: string;
  textAudio_1: string;
  japaneseText: string[];
  romanizedText: string[];
  englishTranslation: string[];
  readingVocabulary: string[];
  readingGrammar: string[];
  sentencePayload: SentenceData[];
}



export default function ReadingPage( { params }: { params: {slug: string} }) {  
  // here we can get the params from page uri and then call api accordingly

  // call with URI like
  // http://localhost:3000/reading/JLPT_n3/reading_1
  // CAREFUL - Edge is casting JLPT_N3 to JLPT_n3 in URI for some reason, better use lowercase in DB as well
  //http://localhost:3000/reading/JLPT_N3/reading_1
  //
  //so we will just use lowercase straight away in db
  //http://localhost:3000/japanese/reading/jlpt_n3_reading_01

  const fetcher = (...args: Parameters<typeof fetch>) =>
    fetch(...args).then((res) => res.json());


  //const apiUrl = "http://localhost:8000/api/v1/reading?key=reading_1";
////////////  const apiUrl = `http://localhost:8000/api/v1/reading?key=${params.slug}`;


 let apiUrl;
 if (process.env.REACT_APP_HOST_IP) {
   apiUrl = `http://${process.env.REACT_APP_HOST_IP}/api/v1/reading?key=${params.slug}`;
 } else {
   apiUrl = `/api/v1/reading?key=${params.slug}`;
 }










  const { data: readingPayload, error } = useSWR(apiUrl, fetcher);
  if (error) return <div>Failed to load</div>;
  if (!readingPayload) return <div>Loading...</div>;

  return (
    <div className="bg-white dark:bg-gray-800">
      <h1 className="text-black dark:text-white">{params.slug}</h1>

      <h1 className="text-black dark:text-white">Reading Exercise</h1>
      {/* <ReadingComponent data={exampleData} /> */}
      <ReadingComponent data={readingPayload} />
    </div>
  );
};












// Example data conforming to the ReadingData type
// const exampleData: ReadingData = {
//   key: "reading_1",
//   title: "reading 1",
//   p_tag: "JLPT_N2",
//   s_tag: "sci-fi",
//   textAudio: "/audio/japanese/reading/reading_3.mp3",
//   textAudio_1: "/audio/japanese/reading/reading_3.mp3",
//   japaneseText: [
//     "2137年、地球はほとんどの天然資源を使い果たし、",
//     "AeolisがZephyriaに",
//   ],
//   romanizedText: [
//     "2137-nen, Chikyū wa hotondo XXXXXXXXXXXXX",
//     "Aeolis ga Zephyria ni sekkin ",
//   ],
//   englishTranslation: [
//     "In the year 2137, Earth had ",
//     "As the Aeolis approached Zephyria,",
//   ],
//   readingVocabulary: [
//     "天然資源 (てんねんしげん) - Ten'nen shigen - Natural resources",
//     "救済 (きゅうさい) - Kyūsai - Relief or salvation",
//   ],
//   readingGrammar: [
//     "使い果たし - This is the conjugation of th.",
//     "駆り立てました - This is the past tense ofindicates politeness and past tense.",
//   ],
//   sentencePayload: [
//     {
//       japanese: "2137年、地球はほとんどの天然資源を使い果たし。",
//       romanization:
//         "2137-nen, Chikyū wa hotondo no tennen shigen o tsukaihatashi.",
//       translation:
//         "In 2137, Earth had exhausted most of its natural resources.",
//       audioPath: "/audio/japanese/reading_1/r_1.mp3",
//     },
//     {
//       japanese: "人類を宇宙の空間での救済を探るように駆り立てました。",
//       romanization:
//         "Jinrui o uchū no kūkan de no kyūsai o saguru yō ni karitatemashita.",
//       translation:
//         "It compelled humanity to probe the void of space in search of salvation.",
//       audioPath: "/audio/japanese/reading_1/r_2.mp3",
//     },
//   ],
// };















