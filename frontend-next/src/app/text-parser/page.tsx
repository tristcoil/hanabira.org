"use client";

// call like:
// https://localhost/text-parser?type=youtube&url=https://www.youtube.com/watch?v=-cbuS40rNSw
// https://localhost/text-parser?type=custom_text
// text for parser testing:
// https://www.dreamslandlyrics.com/2020/04/yorushika-hana-ni-bourei-lyrics.html

import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";

import { useSearchParams } from "next/navigation";

import { Suspense } from "react";

import axios from "axios";
import ReactMarkdown from "react-markdown";

import DictionaryEntryWrapper from "@/components-parser/DictionaryEntryWrapper"; // needs rework, api data inconsistency
import KanjiDisplay from "@/components-parser/KanjiDisplay";
import CreateReadingFlashcard from "@/components-parser/CreateReadingFlashcard";
import RadicalInfo from "@/components-parser/RadicalInfo";
import UnifiedGptComponent from "@/components-parser/UnifiedGptComponent";
import KuroShiroPropsConverter from "@/components-parser/KuroShiroPropsConverter";
import WordDetailsSidebar from "@/components-parser/WordDetailsSidebar";
import DisplayHoveredWord from "@/components-parser/DisplayHoveredWord";
import DisplaySentence from "@/components-parser/DisplaySentence";
import DisplaySentenceV2 from "@/components-parser/DisplaySentenceV2";
import DisplayWord from "@/components-parser/DisplayWord";
import JapaneseTextParser from "@/components-parser/JapaneseTextParser"; // mecab parser
import GrammarExplanation from "@/components-parser/GrammarExplanation";

import ExampleVideos from "@/components-parser/ExampleVideos";
import Disclaimer from "@/components-parser/Disclaimer";

import YouTubeUrlInputForm from "@/components-parser/YouTubeUrlInputForm";
import SubtitlesAccordion from "@/components-parser/SubtitlesAccordion";
import TextFormattingOptions from "@/components-parser/TextFormattingOptions";
import YouTubeComponent from "@/components-parser/YouTubeComponent";
import FuriganaConverter from "@/components-parser/FuriganaConverter";
import FuriganaConverterV2 from "@/components-parser/FuriganaConverterV2";
import Tabs from "@/components-parser/Tabs";
import Tab from "@/components-parser/Tab";

import { getUserFromCookies } from "@/utils/helperFunctions";

import { useUser } from "@/context/UserContext";

interface Word {
  original: string;
  dictionary: string;
  furigana: string;
  status: string;
}

interface WordDetails {
  original: string;
  dictionary: string;
  furigana: string;
  status: string;
}

interface WordDetailsSidebarProps {
  clickedWordDetails: WordDetails | null;
  userId: string;
  url0: string;
  url1: string;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeComponent />
    </Suspense>
  );
}

function HomeComponent() {
  const [clickedWord, setClickedWord] = useState<string | null>(null);
  const [clickedWordDictForm, setClickedWordDictForm] = useState<string | null>(
    null
  );
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  const [hoveredSentence, setHoveredSentence] = useState<Word[] | null>(null);
  const [clickedWordSentence, setClickedWordSentence] = useState<Word[] | null>(
    null
  );

  const [clickedWordDetails, setClickedWordDetails] =
    useState<WordDetails | null>(null);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const url = searchParams.get("url");
  console.log(`type: ${type}`);
  console.log(`url:  ${url}`);

  const [activeTabIndex, setActiveTabIndex] = useState(0); // Default tab is 0

  //const [userId] = useState("testUser"); // Define userId
  //const [userId, setUserId] = useState(null);
  //const [userId, setUserId] = useState('tempUserBeforeMCompMount');
  const { userId, loggedIn } = useUser();

  // useEffect(() => {
  //   const fetchuserId = async () => {
  //     const { userId, userName, jwt } = getUserFromCookies();
  //     setUserId(userId);
  //   };

  //   fetchuserId();
  // }, [userId]);

  useEffect(() => {
    if (type === "youtube" && url) {
      setInputUrl(url as string);
      setActiveTabIndex(1);
    }

    if (type === "youtube") {
      setActiveTabIndex(1);
    }
  }, [type, url]);

  const [inputText, setInputText] = useState(
    `
    Example Japanese text (Iroha poem):
    
    いろは歌

    色は匂えど
    散りぬるを
    我が世誰ぞ
    常ならん
    有為の奥山
    今日越えて
    浅き夢見じ
    酔いもせず
  `
  );

  const [parsedData, setParsedData] = useState<string | null>(null); // State to store parsed data
  const [enhancedData, setEnhancedData] = useState<any | null>(null); // State to store enhanced data

  // JS Backend (parsing, translations, dictionaries, mecab, kuroshiro, ...)
  // localhost port 5200, redirections by nginx for /d-api/v1/
  const extractKanjiUrl = "/d-api/v1/extract-kanji";
  const kanjiUrl = "/d-api/v1/kanji";
  const mecabApiUrl = "/d-api/v1/parse-split";
  const convertAllUrl = "/d-api/v1/convert/all";
  const deeplUrl = "/d-api/v1/deepl-translate"; // url0 - deeplUrl
  const simpleVocabUrl = "/d-api/v1/simple-vocabulary"; // url1
  const convertHiraganaUrl = "/d-api/v1/convert/hiragana"; // url2
  const furiganaUrl = "/d-api/v1/convert/all";
  const radicalUrl = "/d-api/v1/radical-info";

  // we have this on separate prototype GPT js backend
  const gptGrammarUrl = "/d-api/v1/grammar";
  const gptTranslateUrl = "/d-api/v1/translate";
  const gptTranslateSbSUrl = "/d-api/v1/translate-side-by-side";
  const gptSummaryUrl = "/d-api/v1/summary";
  const gptSentimentUrl = "/d-api/v1/sentiment";

  // Python Backend (user specific) - dynamic backend
  const userVocabApiUrl = "/f-api/v1/enhance-vocabulary";
  const userVocabUrl = "/f-api/v1/user-vocabulary";
  const storeVocabUrl = "/f-api/v1/store-vocabulary-data"; // url3

  // --- functions --- //
  const [revisionCount, setRevisionCount] = useState(0); // Initialize revisionCount

  // for input mode button component
  const [inputMode, setInputMode] = useState(`lyrics`); // 'book'
  const handleModeChange = (event: any) => {
    setInputMode(event.target.value);
  };

  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(inputText); // Log the input text for testing
    // Increment revision count by one
    setRevisionCount((prevCount) => prevCount + 1);
  };

  // --- form and youtube player logic --- //

  const [inputUrl, setInputUrl] = useState<string>("");
  const [finalInputUrl, setFinalInputUrl] = useState<string>("");
  const [currentJapaneseSubtitle, setCurrentJapaneseSubtitle] =
    useState<string>("");
  const [currentEnglishSubtitle, setCurrentEnglishSubtitle] =
    useState<string>("");
  const [currentCustomSubtitle, setCurrentCustomSubtitle] =
    useState<string>("");

  const handleSubtitleUpdate = (
    japaneseSubtitle: string,
    englishSubtitle: string,
    customSubtitle: string
  ) => {
    setCurrentJapaneseSubtitle(japaneseSubtitle);
    setCurrentEnglishSubtitle(englishSubtitle);
    setCurrentCustomSubtitle(customSubtitle);
  };

  // --- global japanese subtitles dependant on youtube url
  const [japaneseSubtitles, setJapaneseSubtitles] = useState([]);
  const [japaneseSubtitlesPlainText, setJapaneseSubtitlesPlainText] =
    useState("");
  const [englishSubtitles, setEnglishSubtitles] = useState([]);
  const [englishSubtitlesPlainText, setEnglishSubtitlesPlainText] =
    useState("");

  useEffect(() => {
    console.log("finalInputUrl:", finalInputUrl);

    if (finalInputUrl) {
      fetchSubtitles(
        finalInputUrl,
        "ja",
        setJapaneseSubtitles,
        setJapaneseSubtitlesPlainText
      );
      fetchSubtitles(
        finalInputUrl,
        "en",
        setEnglishSubtitles,
        setEnglishSubtitlesPlainText
      );
    }
  }, [finalInputUrl]);

  const fetchSubtitles = async (
    url,
    lang,
    setSubtitles,
    setSubtitlesPlainText
  ) => {
    try {
      const response = await axios.get(
        `/d-api/v1/get-transcript?url=${url}&lang=${lang}`
      );
      setSubtitles(formatSubtitles(response.data.transcript));
      setSubtitlesPlainText(
        formatSubtitles(response.data.transcript)
          .map((sub) => `${sub.text}`)
          .join("\n")
      );
    } catch (error) {
      console.error(`Failed to fetch ${lang} subtitles:`, error);
    }
  };

  const formatSubtitles = (subtitles) => {
    return subtitles.map((sub) => ({
      time: new Date(sub.offset * 1000).toISOString().substr(11, 8),
      text: sub.text,
    }));
  };

  useEffect(() => {
    if (japaneseSubtitlesPlainText) {
      setInputText(japaneseSubtitlesPlainText);
    }
  }, [japaneseSubtitlesPlainText]);

  // ---

  // DYNAMIC PAGE LAYOUT
  const [leftWidth, setLeftWidth] = useState<string>("66.6667%"); // Initial width 2/3
  const [leftHeight, setLeftHeight] = useState<string>("50%"); // Initial height for mobile
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isHorizontal, setIsHorizontal] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsHorizontal(window.innerWidth >= 768); // Switch to vertical on mobile screens
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (leftPaneRef.current && rightPaneRef.current && dividerRef.current) {
        if (isHorizontal) {
          const containerOffsetLeft =
            leftPaneRef.current.parentElement!.getBoundingClientRect().left;
          const newLeftWidth =
            ((e.clientX - containerOffsetLeft) / window.innerWidth) * 100;
          if (newLeftWidth > 20 && newLeftWidth < 80) {
            // Optional: set min/max width
            setLeftWidth(`${newLeftWidth}%`);
          }
        } else {
          const containerOffsetTop =
            leftPaneRef.current.parentElement!.getBoundingClientRect().top;
          const newLeftHeight =
            ((e.clientY - containerOffsetTop) / window.innerHeight) * 100;
          if (newLeftHeight > 20 && newLeftHeight < 80) {
            // Optional: set min/max height
            setLeftHeight(`${newLeftHeight}%`);
          }
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const divider = dividerRef.current; // Store the reference in a variable

    if (divider) {
      divider.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (divider) {
        divider.removeEventListener("mousedown", handleMouseDown);
      }
    };
  }, [isHorizontal]);

  // ---

  // ----------------------------------- JSX HTML ------------------------------------ //
  return (
    <div className="h-full w-full">
      <div
        className={`flex ${
          isHorizontal
            ? "h-full flex-col md:flex-row"
            : "h-full w-full flex-col"
        } min-h-screen`}
      >
        <div
          ref={leftPaneRef}
          style={{
            width: isHorizontal ? leftWidth : "100%",
            height: isHorizontal ? "100%" : leftHeight,
          }}
          className="flex-shrink-0 bg-slate-100 text-gray-800 overflow-auto p-4"
        >
          {/* <p> This is the left div, taking full width on mobile and 2/3 of the space on wider screens. </p> */}

          <p className="text-xl">userId: {userId}</p>
          <h1 className="text-3xl font-bold mr-5">
            Japanese Reading/YouTube Assistant
          </h1>
          <br />

          <Disclaimer />
          {/* <br /> */}

          <TextFormattingOptions
            inputMode={inputMode}
            handleModeChange={handleModeChange}
          />

          <Tabs activeTabIndex={activeTabIndex}>
            <Tab label="Custom text input">
              {/* CUSTOM TEXT INPUT */}
              <form onSubmit={handleSubmit}>
                <textarea
                  value={inputText}
                  onChange={handleInputChange}
                  className="w-full h-40 p-2 mt-4 mb-2 rounded-md resize text-black"
                  placeholder="Enter Japanese text here..."
                />
                <button
                  type="submit"
                  className="bg-slate-500 text-white px-4 py-2 rounded-md hover:bg-slate-600"
                >
                  Submit
                </button>
              </form>
            </Tab>

            <Tab label="YouTube video subtitle parser">
              <h1 className="text-3xl font-bold text-slate-600">
                YouTube video subtitle analyzer
              </h1>
              <br></br>
              <ExampleVideos />
              <br />

              <YouTubeUrlInputForm
                inputUrl={inputUrl}
                setInputUrl={setInputUrl}
                setFinalInputUrl={setFinalInputUrl}
              />

              {finalInputUrl && (
                <YouTubeComponent
                  videoUrl={finalInputUrl}
                  onSubtitleUpdate={handleSubtitleUpdate}
                />
              )}

              <h1 className="mt-2">
                Current japanese subtitle (sentence mining, MECAB tokenizer):
              </h1>

              {/* <JapaneseTextParser
                inputText={currentJapaneseSubtitle}
                inputMode={inputMode}
                revisionCount={revisionCount}
                userId={userId}
                setClickedWord={setClickedWord}
                setClickedWordDictForm={setClickedWordDictForm}
                setHoveredWord={setHoveredWord}
                setHoveredSentence={setHoveredSentence}
                setClickedWordSentence={setClickedWordSentence}
                setClickedWordDetails={setClickedWordDetails}
              /> */}

              {userId ? (
                <JapaneseTextParser
                  inputText={currentJapaneseSubtitle}
                  inputMode={inputMode}
                  revisionCount={revisionCount}
                  userId={userId}
                  setClickedWord={setClickedWord}
                  setClickedWordDictForm={setClickedWordDictForm}
                  setHoveredWord={setHoveredWord}
                  setHoveredSentence={setHoveredSentence}
                  setClickedWordSentence={setClickedWordSentence}
                  setClickedWordDetails={setClickedWordDetails}
                />
              ) : (
                <p>Please log in to access this feature.</p>
              )}

              {/* <h1>Current subtitle with furigana:</h1>
              <FuriganaConverterV2 japaneseSubtitle={currentJapaneseSubtitle} /> */}

              <SubtitlesAccordion
                japaneseSubtitlesPlainText={japaneseSubtitlesPlainText}
                englishSubtitlesPlainText={englishSubtitlesPlainText}
              />
            </Tab>
          </Tabs>

          {/* COMMON STANDARD CONTENT */}
          <br />

          <Tabs>
            <Tab label="Japanese Mecab Parser">
              <JapaneseTextParser
                inputText={inputText}
                inputMode={inputMode}
                revisionCount={revisionCount}
                userId={userId}
                setClickedWord={setClickedWord}
                setClickedWordDictForm={setClickedWordDictForm}
                setHoveredWord={setHoveredWord}
                setHoveredSentence={setHoveredSentence}
                setClickedWordSentence={setClickedWordSentence}
                setClickedWordDetails={setClickedWordDetails}
              />
            </Tab>
            <Tab label="Kuroshiro Text Converter">
              <KuroShiroPropsConverter text={inputText} url={convertAllUrl} />
            </Tab>

            <Tab label="Translation">
              <UnifiedGptComponent
                japaneseText={inputText}
                url={gptTranslateUrl}
                task="translate"
              />
            </Tab>

            <Tab label="Translation Side by Side (Lyrics, Poetry)">
              <UnifiedGptComponent
                japaneseText={inputText}
                url={gptTranslateSbSUrl}
                task="translate"
              />
            </Tab>

            <Tab label="Summary">
              <UnifiedGptComponent
                japaneseText={inputText}
                url={gptSummaryUrl}
                task="summarize"
              />
            </Tab>

            <Tab label="Sentiment">
              <UnifiedGptComponent
                japaneseText={inputText}
                url={gptSentimentUrl}
                task="analyzeSentiment"
              />
            </Tab>
          </Tabs>

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>

        <div
          ref={dividerRef}
          className={`w-1 md:w-1 bg-gray-300 cursor-${
            isHorizontal ? "col" : "row"
          }-resize ${isHorizontal ? "h-full" : "w-full"}`}
        ></div>

        <div
          ref={rightPaneRef}
          style={{
            width: isHorizontal ? "100%" : "100%",
            height: isHorizontal ? "100%" : `calc(100% - ${leftHeight})`,
          }}
          className="flex-1 flex-shrink-0 bg-zinc-100 flex flex-col justify-start items-center text-gray-600 overflow-y-auto p-2"
        >
          {/* <p className="fixed top-50"> This is the right div, taking full width on mobile and 1/3 of the space on wider screens. </p> */}

          {/* Right side floating panel container */}
          <div className="lg:fixed lg:top-50 lg:overflow-y-auto">
            <Tabs>
              <Tab label="Word Details">
                <WordDetailsSidebar
                  clickedWordDetails={clickedWordDetails}
                  userId={userId}
                  url0={userVocabUrl}
                  url1={simpleVocabUrl}
                  setRevisionCount={setRevisionCount}
                />
              </Tab>

              <Tab label="Create Flashcard">
                <CreateReadingFlashcard
                  word={clickedWord}
                  wordDictForm={clickedWordDictForm}
                  sentence={clickedWordSentence}
                  userId={userId}
                  url0={deeplUrl}
                  url1={simpleVocabUrl}
                  url2={convertHiraganaUrl}
                  url3={storeVocabUrl}
                  url4={gptTranslateUrl}
                />
              </Tab>

              <Tab label="Hovered Data">
                <DisplayHoveredWord hoveredWord={hoveredWord} />
                <DisplaySentence sentence={hoveredSentence} />
                <DisplaySentenceV2
                  sentence={hoveredSentence}
                  url={furiganaUrl}
                />
              </Tab>

              <Tab label="Translate sentence">
                <DisplayWord
                  word={clickedWord}
                  sentence={clickedWordSentence}
                  url={deeplUrl}
                />
              </Tab>
              <Tab label="Kanji">
                <KanjiDisplay
                  word={clickedWord || ""}
                  url0={extractKanjiUrl}
                  url1={kanjiUrl}
                />
              </Tab>
              <Tab label="Radicals">
                <RadicalInfo word={clickedWord || ""} url={radicalUrl} />
              </Tab>
              <Tab label="Grammar">
                <GrammarExplanation
                  word={clickedWord}
                  sentence={clickedWordSentence}
                  url={gptGrammarUrl}
                />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------- //
// -------------------------------- Independent components -------------------------------- //
// ---------------------------------------------------------------------------------------- //

// ----------------------------------------------- //

// ---

// ---------------------------- cookies ----------------------------- //

// ---------------------- data structures --------------------- //

// const [inputText, setInputText] = useState(
//   "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！"
// );

//   const [inputText, setInputText] = useState(
//     `
//     花に亡霊

//     もう忘れて しまったかな 夏の木陰に 座ったまま、
//     氷菓を口に 放り込んで 風を 待っていた

//     もう忘れてしまったかな世の中の全部嘘だらけ
//     本当の価値を二人で探しに行こうと笑ったこと

//     忘れないように色褪せないように
//     形に残るものが全てじゃないように

//     言葉をもっと教えて夏が来るって教えて
//     僕は描いてる眼に映ったのは夏の亡霊だ

//     風にスカートが揺れて想い出なんて忘れて
//     浅い呼吸をする、汗を拭って夏めく

//     もう忘れてしまったかな夏の木陰に座った頃、
//     遠くの丘から顔出した雲があったじゃないか

//     君はそれを掴もうとして、馬鹿みたいに空を切った手で
//     僕は紙に雲一つを書いて、笑って握って見せて

//     忘れないように色褪せないように歴史に残るものが全てじゃないから
//     今だけ顔も失くして言葉も全部忘れて君は笑ってる

//     夏を待っている僕ら亡霊だ心をもっと教えて
//     夏の匂いを教えて浅い呼吸をする

//     忘れないように色褪せないように
//     心に響くものが全てじゃないから

//     言葉をもっと教えてさよならだって教えて
//     今も見るんだよ夏に咲いてる花に亡霊を言葉じゃなくて

//     時間を時間じゃなくて心を浅い呼吸をする、
//     汗を拭って夏めく夏の匂いがする

//     もう忘れてしまったかな夏の木陰に座ったまま、
//     氷菓を口に放り込んで風を待っていた
// `
//   );

//   const [inputText, setInputText] = useState(
//     `
//     https://www.youtube.com/watch?v=msLkh1fE8Os&list=RDMZIJ2vFxu9Y&index=15

//     レイメイ（黎明）

//     作詞：さユり＆ Hiro
//     作曲：さユり＆ Sho
//     編曲：MY FIRST STORY
//     歌：さユり＆ Hiro

//     哀しい欲望に手を伸ばし続けて夢を見る
//     何もかも嘘に塗れた眼の中に真相が隠れたまま

//     希望の淵に飲まれて
//     沈んでしまった本当の答えを
//     探し続けながら

//     何百回でも遮るモノに翳してみせる僕の願い
//     必ず君に伝える日まで
//     正しさは譲れないから進み続けてゆくの
//     何度でも彷徨いながら目指して

//     いつか黎明の元へ帰る時まで
//     痛む泥濘の中で祈りを描くよ
//     心配ないと言い聞かせながら今
//     歩き出すの

//     –

//     冷たい約束の絵を繋ぎ合わせた道を往く
//     重ね合う夢に息吐く場所など無いと心は怯えながら

//     鼓動は光求めて不自由な軌道を選んだ
//     それが今を苦しめても

//     もう一回はない！
//     愚かな程に望んでしまう光る世界
//     抱えて押し潰されかけても

//     後悔なら呆れる程に繰り返してきたけど
//     真実はもう失いたくないから

//     歪な運命の中に囚われている
//     荒ぶ人生を共にあなたと歩くよ
//     涙の果ては此処ではないとまた
//     夜を渡ってゆく

//     –

//     あの日僕らが出会った時に見た大きな夢は
//     二人のレンズにはそれぞれ別の景色だった
//     それでも何故か二人には美しく見えて心が緊くなって
//     どうしようもなく叫びたくなったのを今でも覚えてる

//     主題はきっとそれだけで過不足ないから
//     美しい問いを限りある足で永遠に追いかけながら
//     “何も間違いじゃない" 声を震わせ歌いながら
//     “君の手を引く" 今を生き抜くことが出来たら

//     –

//     深い深い旅をしよう
//     (その先はほとんどが罪かもしれないし)
//     (その先はほとんどが失ってばかりかもしれないけれど)

//     永い永い地図を記そう
//     (分かってたって僕らきっと逃げることなんて出来なかったから)

//     青い青い星を巡って
//     (最後の最後にたった一つの答えにたどり着くまで)
//     (決して止めてはいけないのだときっと誰もが知っていた)

//     苦しみさえ引き連れて深層へ

//     –

//     何百回でも遮るモノに翳してみせる僕の願い
//     必ず君に伝える日まで
//     正しさは譲れないから進み続けてゆくの
//     何度でも彷徨いながら目指して

//     いつか黎明の元へ帰る時まで
//     痛む泥濘の中で祈りを描くよ
//     心配ないと言い聞かせながら今
//     歩き出すの

//     たった一つの朝焼けを手に入れるの
// `
//   );

// const sentencesRaw = [
//   [
//     { original: "彼女", dictionary: "彼女", furigana: "かのじょ" },
//     { original: "は", dictionary: "は", furigana: "" },
//   ],
//   [
//     { original: "今日", dictionary: "今日", furigana: "きょう" },
//     { original: "は", dictionary: "は", furigana: "" },
//   ],
//   [
//     { original: "寿司屋", dictionary: "寿司屋", furigana: "すしや" },
//     { original: "は", dictionary: "は", furigana: "" },
//   ],
// ];

// const sentences = [
//   [
//     {
//       dictionary: "彼女",
//       furigana: "かのじょ",
//       original: "彼女",
//       status: "known",
//     },
//     {
//       dictionary: "は",
//       furigana: "",
//       original: "は",
//       status: "unknown",
//     },
//   ],
//   [
//     {
//       dictionary: "今日",
//       furigana: "きょう",
//       original: "今日",
//       status: "known",
//     },
//     {
//       dictionary: "は",
//       furigana: "",
//       original: "は",
//       status: "unknown",
//     },
//   ],
//   [
//     {
//       dictionary: "寿司屋",
//       furigana: "すしや",
//       original: "寿司屋",
//       status: "known",
//     },
//     {
//       dictionary: "は",
//       furigana: "",
//       original: "は",
//       status: "unknown",
//     },
//   ],
// ];

// --- //
