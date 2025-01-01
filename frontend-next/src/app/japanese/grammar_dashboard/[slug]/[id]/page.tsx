"use client";

//http://localhost:3000/japanese/grammar_dashboard/JLPT_N3/10

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

import GrammarHead from "@/components/GrammarHead";

import "./GrammarCard.css";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import axios from "axios";

type GrammarCardProps = {
  _id: any;
  title: string;
  short_explanation: string;
  long_explanation: string;
  formation: string;
  p_tag: string;
  s_tag: any;
  examples: {
    jp: string;
    romaji: string;
    en: string;
    grammar_audio: string;
  }[];
};

const GrammarDashboard = ({
  params,
}: {
  params: { slug: string; id: string };
}) => {
  const p_dashboardId = params.slug;
  const s_dashboardId = params.id;

  const [grammarCardData, setGrammarCardData] = useState<GrammarCardProps[]>(
    []
  );
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      console.log('##############################################   ENV VARS   #######################################################')
      console.log('process.env.REACT_APP_HOST_IP')
      console.log(process.env.REACT_APP_HOST_IP)

      // hmm, looks like the process.env vars get propagated only to SSR components, this is client rendered
      // and env IP has not propagated at all, hence component thinks it is on localhost VM
      // plus call to localhost from hanabira gets blocked by CORS

      let apiUrl;
      if (process.env.REACT_APP_HOST_IP) {
        apiUrl = `http://${process.env.REACT_APP_HOST_IP}/e-api/v1/grammars?p_tag=${p_dashboardId}&s_tag=${s_dashboardId}`;
      } else {
        //apiUrl = `http://localhost:7000/e-api/v1/grammars?p_tag=${p_dashboardId}&s_tag=${s_dashboardId}`;     // works well on localhost VM
        //apiUrl = `https://hanabira.org/e-api/v1/grammars?p_tag=${p_dashboardId}&s_tag=${s_dashboardId}`;
        apiUrl = `/e-api/v1/grammars?p_tag=${p_dashboardId}&s_tag=${s_dashboardId}`;      // works well on remote server
      }

      console.log(apiUrl)


      try {
        const response = await axios.get<{ grammars: GrammarCardProps[] }>(
          apiUrl
        );

        if (response.data.grammars) {
          setGrammarCardData(response.data.grammars);
        } else {
          setGrammarCardData([]);
        }
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }
    fetchData();
  }, [p_dashboardId, s_dashboardId]);

  console.log("loading:", loading);
  console.log("error:", error);
  console.log("grammarCardData:", grammarCardData);

  return (
    <div className="p-5">
      <GrammarHead />

      {/* <div>Parent Dashboard ID: {p_dashboardId}</div>
      <div>Sub Dashboard ID: {s_dashboardId}</div> */}

      <br></br>
      <div className="flex space-x-2 text-sm">
        <a href="#" className="text-gray-400 hover:text-gray-600 transition">
          Home
        </a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-gray-400 hover:text-gray-600 transition">
          Parent Dashboard
        </a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-gray-500 hover:text-gray-600 transition">
          ID: {p_dashboardId}
        </a>
      </div>
      <div className="flex space-x-2 text-sm mt-2">
        <a href="#" className="text-gray-400 hover:text-gray-600 transition">
          Home
        </a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-gray-400 hover:text-gray-600 transition">
          Sub Dashboard
        </a>
        <span className="text-gray-400">/</span>
        <a href="#" className="text-gray-500 hover:text-gray-600 transition">
          ID: {s_dashboardId}
        </a>
      </div>
      <br></br>

      {loading ? (
        <div className="loading-message">
          <p>Loading data...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>Failed to load data. Please try again later.</p>
        </div>
      ) : (
        <div className="app">
          {grammarCardData.map((grammarPoint, index) => (
            <AccordionGrammarCard key={index} {...grammarPoint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GrammarDashboard;

const GrammarCard: React.FC<GrammarCardProps> = (props) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [audio]);

  const handlePlayAudio = (audioSrc: string) => {
    if (audio) {
      audio.pause();
    }

    const newAudio = new Audio(audioSrc);
    newAudio.play();
    setAudio(newAudio);
  };

  return (
    <div className="grammar-card">
      <div className="grammar-card__title">{props.title}</div>
      <div className="grammar-card__grid">
        <p className="font-bold">Short explanation:</p>
        <div className="grammar-card__explanation">
          {props.short_explanation}
        </div>

        <p className="font-bold">Formation:</p>
        <div className="grammar-card__formation">{props.formation}</div>

        <div>
          <p className="font-bold">Examples:</p>
          <div className="grammar-card__examples">
            {props.examples.map((example, index) => (
              <div key={index} className="grammar-card__example">
                <div className="grammar-card__example-jp">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="grammar-card__audio-icon"
                    onClick={() => handlePlayAudio(example.grammar_audio)}
                  />
                  {example.jp}
                </div>
                <div className="grammar-card__example-romaji">
                  {example.romaji}
                </div>
                <div className="grammar-card__example-en">{example.en}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grammar-card__explanation">
          <p className="font-bold">Long explanation:</p>
          <div>{props.long_explanation}</div>
        </div>
      </div>
    </div>
  );
};

const AccordionGrammarCard: React.FC<GrammarCardProps> = (props) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          backgroundColor: "#748BA0",
          borderRadius: "4px",
          borderColor: "#ccc",
          borderStyle: "solid",
          borderWidth: "1px",
          marginBottom: "8px",
          color: "white",
        }}
      >
        <Typography>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <GrammarCard {...props} />
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

// the _id is from mongodb api response
// const grammarCardData: GrammarCardProps[] = [
//   {
//     _id: "64503724544eb35093176707",
//     title: "～としたら (〜to shitara)",
//     short_explanation:
//       "Express a hypothetical situation; 'if', 'suppose', 'assuming'.",
//     long_explanation:
//       "Express a hypothetical situation; 'if', 'suppose', 'assuming'. Express a hypothetical situation; 'if', 'suppose', 'assuming'. Express a hypothetical situation; 'if', 'suppose', 'assuming'. Express a hypothetical situation; 'if', 'suppose', 'assuming'.",
//     formation:
//       "Verb-casual + としたら\nい-Adjective + としたら\nな-Adjective + だとしたら\nNoun + だとしたら",
//     examples: [
//       {
//         jp: "明日雨が降るとしたら、傘を持って行きましょう。",
//         romaji: "Ashita ame ga furu to shitara, kasa wo motte ikimashou.",
//         en: "If it rains tomorrow, let's bring an umbrella.",
//         grammar_audio:
//           "/audio/grammar/s_としたらtoshitara_20230501_明日雨が降るとしたら傘を持って行きましょう.mp3",
//       },
//       {
//         jp: "このケーキが美味しくないとしたら、誰も食べないでしょう。",
//         romaji: "Kono keeki ga oishikunai to shitara, daremo tabenai deshou.",
//         en: "If this cake is not delicious, nobody will eat it.",
//         grammar_audio:
//           "/audio/grammar/s_としたらtoshitara_20230501_このケーキが美味しくないとしたら誰も食べないでしょう.mp3",
//       },
//       {
//         jp: "彼が病気だとしたら、すぐに病院に行かせてあげてください。",
//         romaji:
//           "Kare ga byouki da to shitara, sugu ni byouin ni ikasete agete kudasai.",
//         en: "If he is sick, please take him to the hospital right away.",
//         grammar_audio:
//           "/audio/grammar/s_としたらtoshitara_20230501_彼が病気だとしたらすぐに病院に行かせてあげてください.mp3",
//       },
//       {
//         jp: "彼女が学生だとしたら、このレストランは割引があるでしょう。",
//         romaji:
//           "Kanojo ga gakusei da to shitara, kono resutoran wa waribiki ga aru deshou.",
//         en: "If she is a student, there will be a discount at this restaurant.",
//         grammar_audio:
//           "/audio/grammar/s_としたらtoshitara_20230501_彼女が学生だとしたらこのレストランは割引があるでしょう.mp3",
//       },
//     ],
//     p_tag: "JLPT_N3",
//     s_tag: "100",
//   },
// ];
