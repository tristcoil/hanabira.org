"use client"; // if using Next.js App Router
import { useState, useEffect } from "react";
import Link from "next/link";

type CardState = "unknown" | "seen" | "known" | "hard";

interface KanjiCardProps {
  kanji: string;
  uri: string;
}

//export default 
function KanjiCard({ kanji, uri }: KanjiCardProps) {
  const [cardState, setCardState] = useState<CardState>("unknown");

  // Load saved state from localStorage on mount
  useEffect(() => {
    const storedState = localStorage.getItem(`kanjiState-${kanji}`);
    if (storedState === "unknown" || storedState === "seen" || storedState === "known" || storedState === "hard") {
      setCardState(storedState as CardState);
    }
  }, [kanji]);

  // Cycle through states: unknown -> seen -> known -> unknown (plus hard)
  const handleToggleState = () => {
    let nextState: CardState;
    if (cardState === "unknown") {
      nextState = "seen";
    } else if (cardState === "seen") {
      nextState = "known";
    } else if (cardState === "known") {
      nextState = "hard";
    } else {
      nextState = "unknown";
    }
    setCardState(nextState);
    localStorage.setItem(`kanjiState-${kanji}`, nextState);
  };

  // Adjust pastel colors accordingly
  const cardColors: Record<CardState, string> = {
    unknown: "bg-gray-50 border-gray-200",   // pastel gray
    seen: "bg-blue-50 border-blue-200",      // pastel blue
    known: "bg-orange-50 border-orange-200", // pastel orange
    hard: "bg-red-100 border-red-200",       // pastel red
  };

  return (
    <div
      className={`relative w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 
                  text-center rounded-lg shadow-sm border 
                  px-3 py-4 transition duration-200 
                  hover:shadow-md ${cardColors[cardState]}`}
    >
      {/* Toggle button in the bottom-left corner */}
      <div
        onClick={handleToggleState}
        className="absolute bottom-1 left-1 
                   text-[0.65rem] leading-none font-bold 
                   px-2 py-1 rounded-full
                   bg-gray-200 hover:bg-gray-300 cursor-pointer
                   select-none"
      >
        {cardState === "unknown" && "U"}
        {cardState === "seen" && "S"}
        {cardState === "known" && "K"}
        {cardState === "hard" && "H"}
      </div>

      {/* Kanji link */}
      <Link href={`https://www.kanjidamage.com${uri}`} legacyBehavior>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <span className="text-3xl sm:text-4xl font-semibold text-gray-700">
            {kanji}
          </span>
        </a>
      </Link>
    </div>
  );
}


//import KanjiCard from "./KanjiCard";

interface KanjiItem {
  kanji: string;
  uri: string;
}

interface KanjiGridProps {
  data: KanjiItem[];
}

//export default 
function KanjiGrid({ data }: KanjiGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
      {data.map((item, index) => (
        <KanjiCard key={index} kanji={item.kanji} uri={item.uri} />
      ))}
    </div>
  );
}




//import { useState } from "react";
//import KanjiGrid from "@/components/KanjiGrid";  // update the path as needed

// import {
//   kanjiDataN5,
//   kanjiDataN4,
//   kanjiDataN3,
//   kanjiDataN2,
//   kanjiDataN1,
// } from "@/lib/kanjiData";  // your actual data import

export default function KanjiPage() {
  // Default tab is "N3"
  const [activeTab, setActiveTab] = useState("N3");

  // Tab definitions
  const tabs = [
    { label: "JLPT N5", level: "N5", data: kanjiDataN5 },
    { label: "JLPT N4", level: "N4", data: kanjiDataN4 },
    { label: "JLPT N3", level: "N3", data: kanjiDataN3 },
    { label: "JLPT N2", level: "N2", data: kanjiDataN2 },
    { label: "JLPT N1", level: "N1", data: kanjiDataN1 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          JLPT Graded Kanji Cards
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-center text-gray-700 mb-6">
          We have created JLPT-graded kanji lists with links to the KanjiDamage website for
          mnemonics and example words. Our kanji lists are based on the JLPT levels provided
          by{" "}
          <a
            href="https://tanos.co.uk/jlpt/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            tanos.co.uk
          </a>, 
          ensuring you study only the kanji needed for your desired JLPT level. 
          KanjiDamage mnemonics might be occasionally controversial, but that can make them memorable.
        </p>

        <p className="text-sm text-center text-gray-700 mb-6">
          You can toggle a card to &quot;Known&quot;, &quot;Seen&quot;, &quot;Hard&quot; or &quot;Unknown&quot;.
        </p>

        {/* Tabs */}
        <div className="flex justify-center space-x-2 mb-6">
          {tabs.map((tab) => {
            const isActive = tab.level === activeTab;
            return (
              <button
                key={tab.level}
                onClick={() => setActiveTab(tab.level)}
                className={`px-2 py-2 border-b-2 font-medium 
                  text-sm transition-colors 
                  ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Selected Tab Content */}
        {tabs.map((tab) => {
          if (tab.level !== activeTab) return null; // only show the active tab's content

          return (
            <div key={tab.level} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {tab.label}
              </h2>
              <KanjiGrid data={tab.data} />
            </div>
          );
        })}

      </div>
    </div>
  );
}


































// --------------------------------------------------------------------------------------------- //


// // components/KanjiCard.tsx
// "use client"; // for Next.js App Router
// import { useState, useEffect } from "react";
// import Link from "next/link";

// type CardState = "unknown" | "seen" | "known";

// interface KanjiCardProps {
//   kanji: string;
//   uri: string;
// }

// function KanjiCard({ kanji, uri }: KanjiCardProps) {
//   const [cardState, setCardState] = useState<CardState>("unknown");

//   // Load saved state from localStorage on mount
//   useEffect(() => {
//     const storedState = localStorage.getItem(`kanjiState-${kanji}`);
//     if (storedState === "unknown" || storedState === "seen" || storedState === "known") {
//       setCardState(storedState as CardState);
//     }
//   }, [kanji]);

//   // Cycle through states: unknown -> seen -> known -> unknown ...
//   const handleToggleState = () => {
//     let nextState: CardState;
//     if (cardState === "unknown") {
//       nextState = "seen";
//     } else if (cardState === "seen") {
//       nextState = "known";
//     } else {
//       nextState = "unknown";
//     }

//     setCardState(nextState);
//     localStorage.setItem(`kanjiState-${kanji}`, nextState);
//   };

//   // Adjust pastel colors accordingly
//   // unknown: pastel gray, seen: pastel blue, known: pastel orange
//   const cardColors: Record<CardState, string> = {
//     unknown: "bg-gray-50 border-gray-200",    // pastel gray
//     seen: "bg-blue-50 border-blue-200",       // pastel blue
//     known: "bg-orange-50 border-orange-200",  // pastel orange
//   };

//   return (
//     <div
//       className={`relative w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 
//                   text-center rounded-lg shadow-sm border 
//                   px-3 py-4 transition duration-200 
//                   hover:shadow-md ${cardColors[cardState]}`}
//     >
//       {/* Toggle button in the bottom-left corner */}
//       <div
//         onClick={handleToggleState}
//         className="absolute bottom-1 left-1 
//                    text-[0.65rem] leading-none font-bold 
//                    px-2 py-1 rounded-full
//                    bg-gray-200 hover:bg-gray-300 cursor-pointer
//                    select-none"
//       >
//         {cardState === "unknown" && "U"}
//         {cardState === "seen" && "S"}
//         {cardState === "known" && "K"}
//       </div>

//       {/* Kanji link */}
//       <Link href={`https://www.kanjidamage.com${uri}`} legacyBehavior>
//         <a
//           target="_blank"
//           rel="noopener noreferrer"
//           className="block w-full h-full"
//         >
//           <span className="text-3xl sm:text-4xl font-semibold text-gray-700">
//             {kanji}
//           </span>
//         </a>
//       </Link>
//     </div>
//   );
// }

// //export default KanjiCard;


// // ------------------------------------------------------------------------- //

// // components/KanjiGrid.js
// //import KanjiCard from "./KanjiCard";

// interface KanjiGridProps {
//   data: { kanji: string; uri: string }[];
// }

// function KanjiGrid({ data }: KanjiGridProps) {
//   return (
//     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
//       {data.map((item, index) => (
//         <KanjiCard key={index} kanji={item.kanji} uri={item.uri} />
//       ))}
//     </div>
//   );
// }

// // pages/kanji.js
// //import KanjiGrid from "../components/KanjiGrid";


// export default function KanjiPage() {
//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="container mx-auto px-4">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
//           JLPT Graded Kanji Cards
//         </h1>
//         <p className="text-sm text-center text-gray-700 mb-2">
//           We have created JLPT-graded kanji lists with links to the KanjiDamage website for
//           mnemonics and example words (since KanjiDamage is not JLPT graded). Our kanji lists are based on the JLPT levels provided
//           by <a href="https://tanos.co.uk/jlpt/" target="_blank" className="text-blue-500 underline">tanos.co.uk</a>,
//           ensuring you study only the kanji needed for your desired JLPT level, saving time and effort. 
//           KanjiDamage mnemonics might be sometimes rather controversial, on the other hand it makes them easy to remember.
//         </p>

//         <p className="text-sm text-center text-gray-700 mb-6">
//           You can toggle card to &quot;Known&quot;, &quot;Seen&quot;, &quot;Unknown&quot; state.
//         </p>

//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">JLPT N5 Kanji</h2>
//           <KanjiGrid data={kanjiDataN5} />
//         </div>

//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">JLPT N4 Kanji</h2>
//           <KanjiGrid data={kanjiDataN4} />
//         </div>

//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">JLPT N3 Kanji</h2>
//           <KanjiGrid data={kanjiDataN3} />
//         </div>

//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">JLPT N2 Kanji</h2>
//           <KanjiGrid data={kanjiDataN2} />
//         </div>

//         <div className="mb-12">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">JLPT N1 Kanji</h2>
//           <KanjiGrid data={kanjiDataN1} />
//         </div>

//       </div>
//     </div>
//   );
// }



// ---------------------------------- kanji --------------------------------- //



const kanjiDataN5 = [
    {
      "kanji": "日",
      "uri": "/kanji/23-sun-day-%E6%97%A5"
    },
    {
      "kanji": "一",
      "uri": "/kanji/1-one-line-radical-%E4%B8%80"
    },
    {
      "kanji": "国",
      "uri": "/kanji/438-country-%E5%9B%BD"
    },
    {
      "kanji": "人",
      "uri": "/kanji/61-person-%E4%BA%BA"
    },
    {
      "kanji": "年",
      "uri": "/kanji/1572-year-%E5%B9%B4"
    },
    {
      "kanji": "大",
      "uri": "/kanji/397-big-%E5%A4%A7"
    },
    {
      "kanji": "十",
      "uri": "/kanji/15-ten-%E5%8D%81"
    },
    {
      "kanji": "二",
      "uri": "/kanji/2-two-%E4%BA%8C"
    },
    {
      "kanji": "本",
      "uri": "/kanji/338-book-the-real-%E6%9C%AC"
    },
    {
      "kanji": "中",
      "uri": "/kanji/489-middle-%E4%B8%AD"
    },
    {
      "kanji": "長",
      "uri": "/kanji/905-long-boss-%E9%95%B7"
    },
    {
      "kanji": "出",
      "uri": "/kanji/1024-pull-out-hand-over-%E5%87%BA"
    },
    {
      "kanji": "三",
      "uri": "/kanji/3-three-%E4%B8%89"
    },
    {
      "kanji": "時",
      "uri": "/kanji/1002-time-%E6%99%82"
    },
    {
      "kanji": "行",
      "uri": "/kanji/1229-go-%E8%A1%8C"
    },
    {
      "kanji": "見",
      "uri": "/kanji/520-look-%E8%A6%8B"
    },
    {
      "kanji": "月",
      "uri": "/kanji/41-moon-organ-%E6%9C%88"
    },
    {
      "kanji": "後",
      "uri": "/kanji/1234-afterwards-behind-%E5%BE%8C"
    },
    {
      "kanji": "前",
      "uri": "/kanji/865-before-%E5%89%8D"
    },
    {
      "kanji": "生",
      "uri": "/kanji/473-life-birth-%E7%94%9F"
    },
    {
      "kanji": "五",
      "uri": "/kanji/1573-five-%E4%BA%94"
    },
    {
      "kanji": "間",
      "uri": "/kanji/162-a-period-of-time-%E9%96%93"
    },
    {
      "kanji": "上",
      "uri": "/kanji/123-above-%E4%B8%8A"
    },
    {
      "kanji": "東",
      "uri": "/kanji/357-east-%E6%9D%B1"
    },
    {
      "kanji": "四",
      "uri": "/kanji/694-the-numeral-4-%E5%9B%9B"
    },
    {
      "kanji": "今",
      "uri": "/kanji/943-now-%E4%BB%8A"
    },
    {
      "kanji": "金",
      "uri": "/kanji/909-gold-%E9%87%91"
    },
    {
      "kanji": "九",
      "uri": "/kanji/181-the-number-9-%E4%B9%9D"
    },
    {
      "kanji": "入",
      "uri": "/kanji/60-putgo-in-%E5%85%A5"
    },
    {
      "kanji": "学",
      "uri": "/kanji/1624-knowledge-%E5%AD%A6"
    },
    {
      "kanji": "高",
      "uri": "/kanji/1639-tall-%E9%AB%98"
    },
    {
      "kanji": "円",
      "uri": "/kanji/72-yencircle-%E5%86%86"
    },
    {
      "kanji": "子",
      "uri": "/kanji/5-child-%E5%AD%90"
    },
    {
      "kanji": "外",
      "uri": "/kanji/122-outside-%E5%A4%96"
    },
    {
      "kanji": "八",
      "uri": "/kanji/132-eight-%E5%85%AB"
    },
    {
      "kanji": "六",
      "uri": "/kanji/134-six-%E5%85%AD"
    },
    {
      "kanji": "下",
      "uri": "/kanji/12-below-%E4%B8%8B"
    },
    {
      "kanji": "来",
      "uri": "/kanji/394-comefuture-%E6%9D%A5"
    },
    {
      "kanji": "気",
      "uri": "/kanji/983-mood-%E6%B0%97"
    },
    {
      "kanji": "小",
      "uri": "/kanji/192-small-size-%E5%B0%8F"
    },
    {
      "kanji": "七",
      "uri": "/kanji/20-seven-%E4%B8%83"
    },
    {
      "kanji": "山",
      "uri": "/kanji/823-mountain-%E5%B1%B1"
    },
    {
      "kanji": "話",
      "uri": "/kanji/231-conversation-%E8%A9%B1"
    },
    {
      "kanji": "女",
      "uri": "/kanji/6-woman-%E5%A5%B3"
    },
    {
      "kanji": "北",
      "uri": "/kanji/803-north-%E5%8C%97"
    },
    {
      "kanji": "午",
      "uri": "/kanji/1192-noon-%E5%8D%88"
    },
    {
      "kanji": "百",
      "uri": "/kanji/814-hundred-%E7%99%BE"
    },
    {
      "kanji": "書",
      "uri": "/kanji/1659-write-%E6%9B%B8"
    },
    {
      "kanji": "先",
      "uri": "/kanji/810-earlier-the-tip-%E5%85%88"
    },
    {
      "kanji": "名",
      "uri": "/kanji/119-name-famous-%E5%90%8D"
    },
    {
      "kanji": "川",
      "uri": "/kanji/853-river-%E5%B7%9D"
    },
    {
      "kanji": "千",
      "uri": "/kanji/229-thousand-%E5%8D%83"
    },
    {
      "kanji": "水",
      "uri": "/kanji/33-water-%E6%B0%B4"
    },
    {
      "kanji": "半",
      "uri": "/kanji/186-half-%E5%8D%8A"
    },
    {
      "kanji": "男",
      "uri": "/kanji/180-man-%E7%94%B7"
    },
    {
      "kanji": "西",
      "uri": "/kanji/574-west-%E8%A5%BF"
    },
    {
      "kanji": "電",
      "uri": "/kanji/1403-electricity-%E9%9B%BB"
    },
    {
      "kanji": "校",
      "uri": "/kanji/1011-school-%E6%A0%A1"
    },
    {
      "kanji": "語",
      "uri": "/kanji/1574-language-%E8%AA%9E"
    },
    {
      "kanji": "土",
      "uri": "/kanji/235-earth-%E5%9C%9F"
    },
    {
      "kanji": "木",
      "uri": "/kanji/335-tree-%E6%9C%A8"
    },
    {
      "kanji": "聞",
      "uri": "/kanji/1748-listen-ask-%E8%81%9E"
    },
    {
      "kanji": "食",
      "uri": "/kanji/921-eat-%E9%A3%9F"
    },
    {
      "kanji": "車",
      "uri": "/kanji/1058-car-%E8%BB%8A"
    },
    {
      "kanji": "何",
      "uri": "/kanji/62-what-%E4%BD%95"
    },
    {
      "kanji": "南",
      "uri": "/kanji/869-south-%E5%8D%97"
    },
    {
      "kanji": "万",
      "uri": "/kanji/85-10000-%E4%B8%87"
    },
    {
      "kanji": "毎",
      "uri": "/kanji/484-every-%E6%AF%8E"
    },
    {
      "kanji": "白",
      "uri": "/kanji/31-white-%E7%99%BD"
    },
    {
      "kanji": "天",
      "uri": "/kanji/880-heaven-%E5%A4%A9"
    },
    {
      "kanji": "母",
      "uri": "/kanji/482-your-moms-%E6%AF%8D"
    },
    {
      "kanji": "火",
      "uri": "/kanji/47-fire-%E7%81%AB"
    },
    {
      "kanji": "右",
      "uri": "/kanji/1097-right-%E5%8F%B3"
    },
    {
      "kanji": "読",
      "uri": "/kanji/566-read-%E8%AA%AD"
    },
    {
      "kanji": "友",
      "uri": "/kanji/1105-friend-%E5%8F%8B"
    },
    {
      "kanji": "左",
      "uri": "/kanji/1098-left-%E5%B7%A6"
    },
    {
      "kanji": "休",
      "uri": "/kanji/340-rest-%E4%BC%91"
    },
    {
      "kanji": "父",
      "uri": "/kanji/1008-dad-%E7%88%B6"
    },
    {
      "kanji": "雨",
      "uri": "/kanji/1383-rain-%E9%9B%A8"
    }
  ];
  
  const kanjiDataN4 = [
    {
      "kanji": "会",
      "uri": "/kanji/1269-big-meeting-%E4%BC%9A"
    },
    {
      "kanji": "同",
      "uri": "/kanji/974-same-%E5%90%8C"
    },
    {
      "kanji": "事",
      "uri": "/kanji/1660-action-incident-%E4%BA%8B"
    },
    {
      "kanji": "自",
      "uri": "/kanji/78-my-own-%E8%87%AA"
    },
    {
      "kanji": "社",
      "uri": "/kanji/1495-company-%E7%A4%BE"
    },
    {
      "kanji": "発",
      "uri": "/kanji/1186-launch-%E7%99%BA"
    },
    {
      "kanji": "者",
      "uri": "/kanji/255-professional-%E8%80%85"
    },
    {
      "kanji": "地",
      "uri": "/kanji/1600-area-%E5%9C%B0"
    },
    {
      "kanji": "業",
      "uri": "/kanji/1397-business-%E6%A5%AD"
    },
    {
      "kanji": "方",
      "uri": "/kanji/84-direction-method-person-%E6%96%B9"
    },
    {
      "kanji": "新",
      "uri": "/kanji/345-new-%E6%96%B0"
    },
    {
      "kanji": "場",
      "uri": "/kanji/1208-place-%E5%A0%B4"
    },
    {
      "kanji": "員",
      "uri": "/kanji/544-clerk-%E5%93%A1"
    },
    {
      "kanji": "立",
      "uri": "/kanji/148-stand-up-%E7%AB%8B"
    },
    {
      "kanji": "開",
      "uri": "/kanji/1185-open-%E9%96%8B"
    },
    {
      "kanji": "手",
      "uri": "/kanji/293-hand-%E6%89%8B"
    },
    {
      "kanji": "力",
      "uri": "/kanji/175-strong-%E5%8A%9B"
    },
    {
      "kanji": "問",
      "uri": "/kanji/163-question-problem-%E5%95%8F"
    },
    {
      "kanji": "代",
      "uri": "/kanji/663-generation-instead-of-%E4%BB%A3"
    },
    {
      "kanji": "明",
      "uri": "/kanji/43-bright-%E6%98%8E"
    },
    {
      "kanji": "動",
      "uri": "/kanji/1078-movement-%E5%8B%95"
    },
    {
      "kanji": "京",
      "uri": "/kanji/197-capital-%E4%BA%AC"
    },
    {
      "kanji": "目",
      "uri": "/kanji/76-eye-%E7%9B%AE"
    },
    {
      "kanji": "通",
      "uri": "/kanji/1342-pass-%E9%80%9A"
    },
    {
      "kanji": "言",
      "uri": "/kanji/11-say-%E8%A8%80"
    },
    {
      "kanji": "理",
      "uri": "/kanji/445-reason-%E7%90%86"
    },
    {
      "kanji": "体",
      "uri": "/kanji/339-body-%E4%BD%93"
    },
    {
      "kanji": "田",
      "uri": "/kanji/56-rice-field-%E7%94%B0"
    },
    {
      "kanji": "主",
      "uri": "/kanji/454-mastermainly-%E4%B8%BB"
    },
    {
      "kanji": "題",
      "uri": "/kanji/849-topic-%E9%A1%8C"
    },
    {
      "kanji": "意",
      "uri": "/kanji/157-meaning-%E6%84%8F"
    },
    {
      "kanji": "不",
      "uri": "/kanji/13-un-%E4%B8%8D"
    },
    {
      "kanji": "作",
      "uri": "/kanji/325-make-%E4%BD%9C"
    },
    {
      "kanji": "用",
      "uri": "/kanji/224-utilize-%E7%94%A8"
    },
    {
      "kanji": "度",
      "uri": "/kanji/1144-times-%E5%BA%A6"
    },
    {
      "kanji": "強",
      "uri": "/kanji/897-burly-%E5%BC%B7"
    },
    {
      "kanji": "公",
      "uri": "/kanji/137-public-%E5%85%AC"
    },
    {
      "kanji": "持",
      "uri": "/kanji/1003-hold-%E6%8C%81"
    },
    {
      "kanji": "野",
      "uri": "/kanji/1332-field-%E9%87%8E"
    },
    {
      "kanji": "以",
      "uri": "/kanji/1721-compared-to-%E4%BB%A5"
    },
    {
      "kanji": "思",
      "uri": "/kanji/102-think-%E6%80%9D"
    },
    {
      "kanji": "家",
      "uri": "/kanji/1223-home-%E5%AE%B6"
    },
    {
      "kanji": "世",
      "uri": "/kanji/1029-society-%E4%B8%96"
    },
    {
      "kanji": "多",
      "uri": "/kanji/115-many-%E5%A4%9A"
    },
    {
      "kanji": "正",
      "uri": "/kanji/280-correct-%E6%AD%A3"
    },
    {
      "kanji": "安",
      "uri": "/kanji/128-cheap-safe-%E5%AE%89"
    },
    {
      "kanji": "院",
      "uri": "/kanji/788-institution-%E9%99%A2"
    },
    {
      "kanji": "心",
      "uri": "/kanji/98-heart-%E5%BF%83"
    },
    {
      "kanji": "界",
      "uri": "/kanji/935-the-world-%E7%95%8C"
    },
    {
      "kanji": "教",
      "uri": "/kanji/710-teach-%E6%95%99"
    },
    {
      "kanji": "文",
      "uri": "/kanji/92-culture-sentence-%E6%96%87"
    },
    {
      "kanji": "元",
      "uri": "/kanji/571-original-%E5%85%83"
    },
    {
      "kanji": "重",
      "uri": "/kanji/1059-heavy-overlap-%E9%87%8D"
    },
    {
      "kanji": "近",
      "uri": "/kanji/328-near-%E8%BF%91"
    },
    {
      "kanji": "考",
      "uri": "/kanji/657-consider-%E8%80%83"
    },
    {
      "kanji": "画",
      "uri": "/kanji/1039-a-drawing-%E7%94%BB"
    },
    {
      "kanji": "海",
      "uri": "/kanji/486-ocean-%E6%B5%B7"
    },
    {
      "kanji": "売",
      "uri": "/kanji/564-sell-%E5%A3%B2"
    },
    {
      "kanji": "知",
      "uri": "/kanji/1050-know-%E7%9F%A5"
    },
    {
      "kanji": "道",
      "uri": "/kanji/861-street-%E9%81%93"
    },
    {
      "kanji": "集",
      "uri": "/kanji/346-collect-%E9%9B%86"
    },
    {
      "kanji": "別",
      "uri": "/kanji/1314-separate-%E5%88%A5"
    },
    {
      "kanji": "物",
      "uri": "/kanji/1201-animal-thing-%E7%89%A9"
    },
    {
      "kanji": "使",
      "uri": "/kanji/1593-use-%E4%BD%BF"
    },
    {
      "kanji": "品",
      "uri": "/kanji/10-products-%E5%93%81"
    },
    {
      "kanji": "計",
      "uri": "/kanji/18-measure-%E8%A8%88"
    },
    {
      "kanji": "死",
      "uri": "/kanji/120-death-%E6%AD%BB"
    },
    {
      "kanji": "特",
      "uri": "/kanji/1196-special-%E7%89%B9"
    },
    {
      "kanji": "私",
      "uri": "/kanji/371-me-private-%E7%A7%81"
    },
    {
      "kanji": "始",
      "uri": "/kanji/141-begin-%E5%A7%8B"
    },
    {
      "kanji": "朝",
      "uri": "/kanji/46-morning-%E6%9C%9D"
    },
    {
      "kanji": "運",
      "uri": "/kanji/1071-carry-luck-%E9%81%8B"
    },
    {
      "kanji": "終",
      "uri": "/kanji/955-end-%E7%B5%82"
    },
    {
      "kanji": "台",
      "uri": "/kanji/139-big-thing-counter-%E5%8F%B0"
    },
    {
      "kanji": "広",
      "uri": "/kanji/1139-wide-%E5%BA%83"
    },
    {
      "kanji": "住",
      "uri": "/kanji/460-dwell-%E4%BD%8F"
    },
    {
      "kanji": "真",
      "uri": "/kanji/1304-really-%E7%9C%9F"
    },
    {
      "kanji": "有",
      "uri": "/kanji/1100-exist-%E6%9C%89"
    },
    {
      "kanji": "口",
      "uri": "/kanji/9-mouth-small-box-radical-%E5%8F%A3"
    },
    {
      "kanji": "少",
      "uri": "/kanji/193-a-little-amount-%E5%B0%91"
    },
    {
      "kanji": "町",
      "uri": "/kanji/57-neighborhood-small-town-%E7%94%BA"
    },
    {
      "kanji": "料",
      "uri": "/kanji/1585-ingredients-fees-%E6%96%99"
    },
    {
      "kanji": "工",
      "uri": "/kanji/645-craft-or-industry-%E5%B7%A5"
    },
    {
      "kanji": "建",
      "uri": "/kanji/1154-build-%E5%BB%BA"
    },
    {
      "kanji": "空",
      "uri": "/kanji/646-air-%E7%A9%BA"
    },
    {
      "kanji": "急",
      "uri": "/kanji/633-urgent-%E6%80%A5"
    },
    {
      "kanji": "止",
      "uri": "/kanji/271-stop-%E6%AD%A2"
    },
    {
      "kanji": "送",
      "uri": "/kanji/885-send-%E9%80%81"
    },
    {
      "kanji": "切",
      "uri": "/kanji/165-cut-important-%E5%88%87"
    },
    {
      "kanji": "転",
      "uri": "/kanji/1266-roll-over-%E8%BB%A2"
    },
    {
      "kanji": "研",
      "uri": "/kanji/1189-polish-sharpen-%E7%A0%94"
    },
    {
      "kanji": "足",
      "uri": "/kanji/277-foot-be-enough-%E8%B6%B3"
    },
    {
      "kanji": "究",
      "uri": "/kanji/182-research-%E7%A9%B6"
    },
    {
      "kanji": "楽",
      "uri": "/kanji/1650-enjoy-%E6%A5%BD"
    },
    {
      "kanji": "起",
      "uri": "/kanji/721-wake-up-occur-%E8%B5%B7"
    },
    {
      "kanji": "着",
      "uri": "/kanji/875-wear-arrive-%E7%9D%80"
    },
    {
      "kanji": "店",
      "uri": "/kanji/1132-shop-%E5%BA%97"
    },
    {
      "kanji": "病",
      "uri": "/kanji/1347-sick-kanji-%E7%97%85"
    },
    {
      "kanji": "質",
      "uri": "/kanji/540-quality-%E8%B3%AA"
    },
    {
      "kanji": "待",
      "uri": "/kanji/1236-wait-%E5%BE%85"
    },
    {
      "kanji": "試",
      "uri": "/kanji/661-attempt-to-do-%E8%A9%A6"
    },
    {
      "kanji": "族",
      "uri": "/kanji/1048-family-%E6%97%8F"
    },
    {
      "kanji": "銀",
      "uri": "/kanji/915-silver-%E9%8A%80"
    },
    {
      "kanji": "早",
      "uri": "/kanji/29-early-%E6%97%A9"
    },
    {
      "kanji": "映",
      "uri": "/kanji/406-project-reflect-%E6%98%A0"
    },
    {
      "kanji": "親",
      "uri": "/kanji/525-parentskindness-%E8%A6%AA"
    },
    {
      "kanji": "験",
      "uri": "/kanji/419-test-%E9%A8%93"
    },
    {
      "kanji": "英",
      "uri": "/kanji/407-heroic-%E8%8B%B1"
    },
    {
      "kanji": "医",
      "uri": "/kanji/1047-doctor-%E5%8C%BB"
    },
    {
      "kanji": "仕",
      "uri": "/kanji/246-work-%E4%BB%95"
    },
    {
      "kanji": "去",
      "uri": "/kanji/1257-past-tense-%E5%8E%BB"
    },
    {
      "kanji": "味",
      "uri": "/kanji/383-flavor-%E5%91%B3"
    },
    {
      "kanji": "写",
      "uri": "/kanji/652-copy-%E5%86%99"
    },
    {
      "kanji": "字",
      "uri": "/kanji/129-letter-%E5%AD%97"
    },
    {
      "kanji": "答",
      "uri": "/kanji/941-answer-%E7%AD%94"
    },
    {
      "kanji": "夜",
      "uri": "/kanji/117-late-night-%E5%A4%9C"
    },
    {
      "kanji": "音",
      "uri": "/kanji/156-sound-%E9%9F%B3"
    },
    {
      "kanji": "注",
      "uri": "/kanji/458-pour-be-careful-%E6%B3%A8"
    },
    {
      "kanji": "帰",
      "uri": "/kanji/638-go-back-home-%E5%B8%B0"
    },
    {
      "kanji": "古",
      "uri": "/kanji/16-old-%E5%8F%A4"
    },
    {
      "kanji": "歌",
      "uri": "/kanji/700-sing-%E6%AD%8C"
    },
    {
      "kanji": "買",
      "uri": "/kanji/533-buy-%E8%B2%B7"
    },
    {
      "kanji": "悪",
      "uri": "/kanji/113-bad-%E6%82%AA"
    },
    {
      "kanji": "図",
      "uri": "/kanji/1587-diagram-map-%E5%9B%B3"
    },
    {
      "kanji": "週",
      "uri": "/kanji/1637-week-%E9%80%B1"
    },
    {
      "kanji": "室",
      "uri": "/kanji/1261-room-suffix-%E5%AE%A4"
    },
    {
      "kanji": "歩",
      "uri": "/kanji/274-walk-%E6%AD%A9"
    },
    {
      "kanji": "風",
      "uri": "/kanji/1285-wind-the-flu-style-%E9%A2%A8"
    },
    {
      "kanji": "紙",
      "uri": "/kanji/1161-paper-%E7%B4%99"
    },
    {
      "kanji": "黒",
      "uri": "/kanji/238-black-%E9%BB%92"
    },
    {
      "kanji": "花",
      "uri": "/kanji/65-flower-%E8%8A%B1"
    },
    {
      "kanji": "春",
      "uri": "/kanji/962-spring-sexy-%E6%98%A5"
    },
    {
      "kanji": "赤",
      "uri": "/kanji/900-red-%E8%B5%A4"
    },
    {
      "kanji": "青",
      "uri": "/kanji/466-blue-%E9%9D%92"
    },
    {
      "kanji": "館",
      "uri": "/kanji/1614-big-hall-%E9%A4%A8"
    },
    {
      "kanji": "屋",
      "uri": "/kanji/1260-store-%E5%B1%8B"
    },
    {
      "kanji": "色",
      "uri": "/kanji/1210-color-%E8%89%B2"
    },
    {
      "kanji": "走",
      "uri": "/kanji/286-run-%E8%B5%B0"
    },
    {
      "kanji": "秋",
      "uri": "/kanji/378-fall-%E7%A7%8B"
    },
    {
      "kanji": "夏",
      "uri": "/kanji/842-summer-%E5%A4%8F"
    },
    {
      "kanji": "習",
      "uri": "/kanji/1535-learn-%E7%BF%92"
    },
    {
      "kanji": "駅",
      "uri": "/kanji/289-train-station-%E9%A7%85"
    },
    {
      "kanji": "洋",
      "uri": "/kanji/872-pacific-ocean-the-west-%E6%B4%8B"
    },
    {
      "kanji": "旅",
      "uri": "/kanji/758-trip-%E6%97%85"
    },
    {
      "kanji": "服",
      "uri": "/kanji/1481-clothes-%E6%9C%8D"
    },
    {
      "kanji": "夕",
      "uri": "/kanji/114-evening-%E5%A4%95"
    },
    {
      "kanji": "借",
      "uri": "/kanji/1539-borrow-%E5%80%9F"
    },
    {
      "kanji": "曜",
      "uri": "/kanji/644-day-of-the-week-%E6%9B%9C"
    },
    {
      "kanji": "飲",
      "uri": "/kanji/922-drink-%E9%A3%B2"
    },
    {
      "kanji": "肉",
      "uri": "/kanji/71-meat-%E8%82%89"
    },
    {
      "kanji": "貸",
      "uri": "/kanji/664-lend-%E8%B2%B8"
    },
    {
      "kanji": "堂",
      "uri": "/kanji/1631-assembly-hall-%E5%A0%82"
    },
    {
      "kanji": "鳥",
      "uri": "/kanji/834-bird-%E9%B3%A5"
    },
    {
      "kanji": "飯",
      "uri": "/kanji/924-rice-meal-%E9%A3%AF"
    },
    {
      "kanji": "勉",
      "uri": "/kanji/1215-try-hard-%E5%8B%89"
    },
    {
      "kanji": "冬",
      "uri": "/kanji/954-winter-%E5%86%AC"
    },
    {
      "kanji": "昼",
      "uri": "/kanji/290-noon-%E6%98%BC"
    },
    {
      "kanji": "茶",
      "uri": "/kanji/917-tea-%E8%8C%B6"
    },
    {
      "kanji": "弟",
      "uri": "/kanji/893-younger-brother-%E5%BC%9F"
    },
    {
      "kanji": "牛",
      "uri": "/kanji/1194-cow-%E7%89%9B"
    },
    {
      "kanji": "魚",
      "uri": "/kanji/560-fish-%E9%AD%9A"
    },
    {
      "kanji": "兄",
      "uri": "/kanji/526-older-brother-%E5%85%84"
    },
    {
      "kanji": "犬",
      "uri": "/kanji/408-dog-%E7%8A%AC"
    },
    {
      "kanji": "妹",
      "uri": "/kanji/382-little-sister-%E5%A6%B9"
    },
    {
      "kanji": "姉",
      "uri": "/kanji/75-older-sister-%E5%A7%89"
    },
    {
      "kanji": "漢",
      "uri": "/kanji/421-chinese-%E6%BC%A2"
    }
  ];
  
  const kanjiDataN3 = [
    {
      "kanji": "政",
      "uri": "/kanji/708-politics-%E6%94%BF"
    },
    {
      "kanji": "議",
      "uri": "/kanji/1764-discussion-%E8%AD%B0"
    },
    {
      "kanji": "民",
      "uri": "/kanji/1165-folk-%E6%B0%91"
    },
    {
      "kanji": "連",
      "uri": "/kanji/1070-take-with-inform-of-%E9%80%A3"
    },
    {
      "kanji": "対",
      "uri": "/kanji/1010-against-%E5%AF%BE"
    },
    {
      "kanji": "部",
      "uri": "/kanji/795-section-%E9%83%A8"
    },
    {
      "kanji": "合",
      "uri": "/kanji/936-to-suit-%E5%90%88"
    },
    {
      "kanji": "市",
      "uri": "/kanji/73-small-city-dagger-radical-%E5%B8%82"
    },
    {
      "kanji": "内",
      "uri": "/kanji/70-the-inside-%E5%86%85"
    },
    {
      "kanji": "相",
      "uri": "/kanji/350-partner-%E7%9B%B8"
    },
    {
      "kanji": "定",
      "uri": "/kanji/282-plan-%E5%AE%9A"
    },
    {
      "kanji": "回",
      "uri": "/kanji/437-rotate-times-%E5%9B%9E"
    },
    {
      "kanji": "選",
      "uri": "/kanji/1552-choose-%E9%81%B8"
    },
    {
      "kanji": "米",
      "uri": "/kanji/384-rice-america-%E7%B1%B3"
    },
    {
      "kanji": "実",
      "uri": "/kanji/964-truth-%E5%AE%9F"
    },
    {
      "kanji": "関",
      "uri": "/kanji/887-connected-to-%E9%96%A2"
    },
    {
      "kanji": "決",
      "uri": "/kanji/984-decide-%E6%B1%BA"
    },
    {
      "kanji": "全",
      "uri": "/kanji/919-all-%E5%85%A8"
    },
    {
      "kanji": "表",
      "uri": "/kanji/767-express-%E8%A1%A8"
    },
    {
      "kanji": "戦",
      "uri": "/kanji/672-fight-%E6%88%A6"
    },
    {
      "kanji": "経",
      "uri": "/kanji/1089-experience-%E7%B5%8C"
    },
    {
      "kanji": "最",
      "uri": "/kanji/311-most-%E6%9C%80"
    },
    {
      "kanji": "現",
      "uri": "/kanji/524-reality-%E7%8F%BE"
    },
    {
      "kanji": "調",
      "uri": "/kanji/1636-check-out-%E8%AA%BF"
    },
    {
      "kanji": "化",
      "uri": "/kanji/64-transform-%E5%8C%96"
    },
    {
      "kanji": "当",
      "uri": "/kanji/634-hit-the-target-%E5%BD%93"
    },
    {
      "kanji": "約",
      "uri": "/kanji/1429-promise-roughly-speaking-%E7%B4%84"
    },
    {
      "kanji": "首",
      "uri": "/kanji/860-neck-%E9%A6%96"
    },
    {
      "kanji": "法",
      "uri": "/kanji/1258-law-%E6%B3%95"
    },
    {
      "kanji": "性",
      "uri": "/kanji/475-sex-essential-nature-%E6%80%A7"
    },
    {
      "kanji": "要",
      "uri": "/kanji/581-important-%E8%A6%81"
    },
    {
      "kanji": "制",
      "uri": "/kanji/805-system-%E5%88%B6"
    },
    {
      "kanji": "治",
      "uri": "/kanji/140-cure-%E6%B2%BB"
    },
    {
      "kanji": "務",
      "uri": "/kanji/1335-perform-a-task-%E5%8B%99"
    },
    {
      "kanji": "成",
      "uri": "/kanji/745-become-%E6%88%90"
    },
    {
      "kanji": "期",
      "uri": "/kanji/1706-period-of-time-%E6%9C%9F"
    },
    {
      "kanji": "取",
      "uri": "/kanji/310-take-%E5%8F%96"
    },
    {
      "kanji": "都",
      "uri": "/kanji/791-major-city-%E9%83%BD"
    },
    {
      "kanji": "和",
      "uri": "/kanji/369-peace-japan-%E5%92%8C"
    },
    {
      "kanji": "機",
      "uri": "/kanji/675-machine-%E6%A9%9F"
    },
    {
      "kanji": "平",
      "uri": "/kanji/187-equal-level-%E5%B9%B3"
    },
    {
      "kanji": "加",
      "uri": "/kanji/176-add-%E5%8A%A0"
    },
    {
      "kanji": "受",
      "uri": "/kanji/604-receive-%E5%8F%97"
    },
    {
      "kanji": "続",
      "uri": "/kanji/565-continue-%E7%B6%9A"
    },
    {
      "kanji": "進",
      "uri": "/kanji/333-progress-%E9%80%B2"
    },
    {
      "kanji": "数",
      "uri": "/kanji/703-integer-to-count-%E6%95%B0"
    },
    {
      "kanji": "記",
      "uri": "/kanji/723-diary-%E8%A8%98"
    },
    {
      "kanji": "初",
      "uri": "/kanji/1509-first-time-%E5%88%9D"
    },
    {
      "kanji": "指",
      "uri": "/kanji/299-finger-point-at-%E6%8C%87"
    },
    {
      "kanji": "権",
      "uri": "/kanji/1056-rights-%E6%A8%A9"
    },
    {
      "kanji": "支",
      "uri": "/kanji/1319-support-%E6%94%AF"
    },
    {
      "kanji": "産",
      "uri": "/kanji/736-childbirth-production-of-things-%E7%94%A3"
    },
    {
      "kanji": "点",
      "uri": "/kanji/126-point-%E7%82%B9"
    },
    {
      "kanji": "報",
      "uri": "/kanji/1482-data-%E5%A0%B1"
    },
    {
      "kanji": "済",
      "uri": "/kanji/94-economy-to-be-over-%E6%B8%88"
    },
    {
      "kanji": "活",
      "uri": "/kanji/232-vivid-lively-%E6%B4%BB"
    },
    {
      "kanji": "原",
      "uri": "/kanji/737-original-high-plain-%E5%8E%9F"
    },
    {
      "kanji": "共",
      "uri": "/kanji/1548-with-%E5%85%B1"
    },
    {
      "kanji": "得",
      "uri": "/kanji/1237-bargain-obtain-%E5%BE%97"
    },
    {
      "kanji": "解",
      "uri": "/kanji/1199-solve-untie-%E8%A7%A3"
    },
    {
      "kanji": "交",
      "uri": "/kanji/1009-combine-%E4%BA%A4"
    },
    {
      "kanji": "資",
      "uri": "/kanji/958-capital-as-in-%E8%B3%87"
    },
    {
      "kanji": "予",
      "uri": "/kanji/1329-beforehand-%E4%BA%88"
    },
    {
      "kanji": "向",
      "uri": "/kanji/1640-turn-to-face-%E5%90%91"
    },
    {
      "kanji": "際",
      "uri": "/kanji/1181-edge-%E9%9A%9B"
    },
    {
      "kanji": "勝",
      "uri": "/kanji/891-win-%E5%8B%9D"
    },
    {
      "kanji": "面",
      "uri": "/kanji/813-front-surface-face-%E9%9D%A2"
    },
    {
      "kanji": "告",
      "uri": "/kanji/807-inform-%E5%91%8A"
    },
    {
      "kanji": "反",
      "uri": "/kanji/739-anti-%E5%8F%8D"
    },
    {
      "kanji": "判",
      "uri": "/kanji/188-judgement-%E5%88%A4"
    },
    {
      "kanji": "認",
      "uri": "/kanji/174-admit-%E8%AA%8D"
    },
    {
      "kanji": "参",
      "uri": "/kanji/1117-admit-defeat-visit-%E5%8F%82"
    },
    {
      "kanji": "利",
      "uri": "/kanji/374-handy-%E5%88%A9"
    },
    {
      "kanji": "組",
      "uri": "/kanji/1485-ones-team-%E7%B5%84"
    },
    {
      "kanji": "信",
      "uri": "/kanji/63-believe-%E4%BF%A1"
    },
    {
      "kanji": "在",
      "uri": "/kanji/1103-be-real-%E5%9C%A8"
    },
    {
      "kanji": "件",
      "uri": "/kanji/1195-incident-%E4%BB%B6"
    },
    {
      "kanji": "側",
      "uri": "/kanji/547-side-of-something-%E5%81%B4"
    },
    {
      "kanji": "任",
      "uri": "/kanji/446-have-responsibility-for-%E4%BB%BB"
    },
    {
      "kanji": "引",
      "uri": "/kanji/898-pull-%E5%BC%95"
    },
    {
      "kanji": "求",
      "uri": "/kanji/725-demandask-%E6%B1%82"
    },
    {
      "kanji": "所",
      "uri": "/kanji/506-area-attribute-%E6%89%80"
    },
    {
      "kanji": "次",
      "uri": "/kanji/956-next-%E6%AC%A1"
    },
    {
      "kanji": "昨",
      "uri": "/kanji/326-yesterday-%E6%98%A8"
    },
    {
      "kanji": "論",
      "uri": "/kanji/972-make-a-case-for-%E8%AB%96"
    },
    {
      "kanji": "官",
      "uri": "/kanji/1613-federal-%E5%AE%98"
    },
    {
      "kanji": "増",
      "uri": "/kanji/1605-increase-%E5%A2%97"
    },
    {
      "kanji": "係",
      "uri": "/kanji/221-be-involved-with-%E4%BF%82"
    },
    {
      "kanji": "感",
      "uri": "/kanji/755-feeling-%E6%84%9F"
    },
    {
      "kanji": "情",
      "uri": "/kanji/471-emotion-%E6%83%85"
    },
    {
      "kanji": "投",
      "uri": "/kanji/1294-throw-%E6%8A%95"
    },
    {
      "kanji": "示",
      "uri": "/kanji/200-show-altar-radical-%E7%A4%BA"
    },
    {
      "kanji": "変",
      "uri": "/kanji/904-change-%E5%A4%89"
    },
    {
      "kanji": "打",
      "uri": "/kanji/300-pound-%E6%89%93"
    },
    {
      "kanji": "直",
      "uri": "/kanji/1308-correct-a-problem-direct-contact-%E7%9B%B4"
    },
    {
      "kanji": "両",
      "uri": "/kanji/1040-both-%E4%B8%A1"
    },
    {
      "kanji": "式",
      "uri": "/kanji/659-ritual-%E5%BC%8F"
    },
    {
      "kanji": "確",
      "uri": "/kanji/1057-make-certain-%E7%A2%BA"
    },
    {
      "kanji": "果",
      "uri": "/kanji/354-fruit-result-%E6%9E%9C"
    },
    {
      "kanji": "容",
      "uri": "/kanji/1521-appearance-%E5%AE%B9"
    },
    {
      "kanji": "必",
      "uri": "/kanji/99-surely-%E5%BF%85"
    },
    {
      "kanji": "演",
      "uri": "/kanji/1020-performance-%E6%BC%94"
    },
    {
      "kanji": "歳",
      "uri": "/kanji/750-years-old-%E6%AD%B3"
    },
    {
      "kanji": "争",
      "uri": "/kanji/1669-battle-%E4%BA%89"
    },
    {
      "kanji": "談",
      "uri": "/kanji/50-consult-%E8%AB%87"
    },
    {
      "kanji": "能",
      "uri": "/kanji/143-talent-%E8%83%BD"
    },
    {
      "kanji": "位",
      "uri": "/kanji/153-rank-%E4%BD%8D"
    },
    {
      "kanji": "置",
      "uri": "/kanji/1309-put-down-on-table-%E7%BD%AE"
    },
    {
      "kanji": "流",
      "uri": "/kanji/1248-flow-%E6%B5%81"
    },
    {
      "kanji": "格",
      "uri": "/kanji/613-character-aspect-%E6%A0%BC"
    },
    {
      "kanji": "疑",
      "uri": "/kanji/1044-doubt-%E7%96%91"
    },
    {
      "kanji": "過",
      "uri": "/kanji/1644-surpass-too-much-%E9%81%8E"
    },
    {
      "kanji": "局",
      "uri": "/kanji/1422-department-%E5%B1%80"
    },
    {
      "kanji": "放",
      "uri": "/kanji/709-release-%E6%94%BE"
    },
    {
      "kanji": "常",
      "uri": "/kanji/1630-usual-%E5%B8%B8"
    },
    {
      "kanji": "状",
      "uri": "/kanji/801-circumstance-%E7%8A%B6"
    },
    {
      "kanji": "球",
      "uri": "/kanji/727-sphere-%E7%90%83"
    },
    {
      "kanji": "職",
      "uri": "/kanji/677-employment-%E8%81%B7"
    },
    {
      "kanji": "与",
      "uri": "/kanji/651-bestow-%E4%B8%8E"
    },
    {
      "kanji": "供",
      "uri": "/kanji/1551-follower-%E4%BE%9B"
    },
    {
      "kanji": "役",
      "uri": "/kanji/1293-role-%E5%BD%B9"
    },
    {
      "kanji": "構",
      "uri": "/kanji/1566-set-up-care-about-%E6%A7%8B"
    },
    {
      "kanji": "割",
      "uri": "/kanji/463-divide-%E5%89%B2"
    },
    {
      "kanji": "費",
      "uri": "/kanji/896-expenses-%E8%B2%BB"
    },
    {
      "kanji": "付",
      "uri": "/kanji/987-stick-to-%E4%BB%98"
    },
    {
      "kanji": "由",
      "uri": "/kanji/1374-freedom-reason-%E7%94%B1"
    },
    {
      "kanji": "説",
      "uri": "/kanji/863-explain-%E8%AA%AC"
    },
    {
      "kanji": "難",
      "uri": "/kanji/422-difficult-%E9%9B%A3"
    },
    {
      "kanji": "優",
      "uri": "/kanji/816-kindheartedexcel-%E5%84%AA"
    },
    {
      "kanji": "夫",
      "uri": "/kanji/588-husband-%E5%A4%AB"
    },
    {
      "kanji": "収",
      "uri": "/kanji/96-get-%E5%8F%8E"
    },
    {
      "kanji": "断",
      "uri": "/kanji/387-decisionjudgementrefuse-%E6%96%AD"
    },
    {
      "kanji": "石",
      "uri": "/kanji/819-rock-%E7%9F%B3"
    },
    {
      "kanji": "違",
      "uri": "/kanji/1577-different-and-therefore-wrong-%E9%81%95"
    },
    {
      "kanji": "消",
      "uri": "/kanji/601-erase-%E6%B6%88"
    },
    {
      "kanji": "神",
      "uri": "/kanji/1498-god-kanji-%E7%A5%9E"
    },
    {
      "kanji": "番",
      "uri": "/kanji/395-number-%E7%95%AA"
    },
    {
      "kanji": "規",
      "uri": "/kanji/592-criteria-%E8%A6%8F"
    },
    {
      "kanji": "術",
      "uri": "/kanji/1240-art-technique-%E8%A1%93"
    },
    {
      "kanji": "備",
      "uri": "/kanji/734-furnish-%E5%82%99"
    },
    {
      "kanji": "宅",
      "uri": "/kanji/127-residence-%E5%AE%85"
    },
    {
      "kanji": "害",
      "uri": "/kanji/462-damage-%E5%AE%B3"
    },
    {
      "kanji": "配",
      "uri": "/kanji/724-distribute-%E9%85%8D"
    },
    {
      "kanji": "警",
      "uri": "/kanji/1420-the-fuzz-%E8%AD%A6"
    },
    {
      "kanji": "育",
      "uri": "/kanji/1247-grow-up-be-raised-%E8%82%B2"
    },
    {
      "kanji": "席",
      "uri": "/kanji/1143-seat-%E5%B8%AD"
    },
    {
      "kanji": "訪",
      "uri": "/kanji/86-formal-visit-%E8%A8%AA"
    },
    {
      "kanji": "乗",
      "uri": "/kanji/1061-ride-a-vehicle-%E4%B9%97"
    },
    {
      "kanji": "残",
      "uri": "/kanji/1678-remain-behind-%E6%AE%8B"
    },
    {
      "kanji": "想",
      "uri": "/kanji/352-ideaimagination-%E6%83%B3"
    },
    {
      "kanji": "声",
      "uri": "/kanji/1217-voice-%E5%A3%B0"
    },
    {
      "kanji": "念",
      "uri": "/kanji/945-concern-%E5%BF%B5"
    },
    {
      "kanji": "助",
      "uri": "/kanji/1490-save-%E5%8A%A9"
    },
    {
      "kanji": "労",
      "uri": "/kanji/1622-labor-%E5%8A%B4"
    },
    {
      "kanji": "例",
      "uri": "/kanji/1318-example-%E4%BE%8B"
    },
    {
      "kanji": "然",
      "uri": "/kanji/411-nature-%E7%84%B6"
    },
    {
      "kanji": "限",
      "uri": "/kanji/783-limit-%E9%99%90"
    },
    {
      "kanji": "追",
      "uri": "/kanji/1616-follow-%E8%BF%BD"
    },
    {
      "kanji": "商",
      "uri": "/kanji/1641-merchandise-%E5%95%86"
    },
    {
      "kanji": "葉",
      "uri": "/kanji/1030-leaf-%E8%91%89"
    },
    {
      "kanji": "伝",
      "uri": "/kanji/1267-transmit-%E4%BC%9D"
    },
    {
      "kanji": "働",
      "uri": "/kanji/1079-to-do-your-job-%E5%83%8D"
    },
    {
      "kanji": "形",
      "uri": "/kanji/1188-form-%E5%BD%A2"
    },
    {
      "kanji": "景",
      "uri": "/kanji/199-scene-%E6%99%AF"
    },
    {
      "kanji": "落",
      "uri": "/kanji/612-falldrop-%E8%90%BD"
    },
    {
      "kanji": "好",
      "uri": "/kanji/7-like-%E5%A5%BD"
    },
    {
      "kanji": "退",
      "uri": "/kanji/777-retreat-%E9%80%80"
    },
    {
      "kanji": "頭",
      "uri": "/kanji/841-head-%E9%A0%AD"
    },
    {
      "kanji": "負",
      "uri": "/kanji/559-lose-%E8%B2%A0"
    },
    {
      "kanji": "渡",
      "uri": "/kanji/1145-pass-by-%E6%B8%A1"
    },
    {
      "kanji": "失",
      "uri": "/kanji/1051-miss-out-on-%E5%A4%B1"
    },
    {
      "kanji": "差",
      "uri": "/kanji/874-discriminate-%E5%B7%AE"
    },
    {
      "kanji": "末",
      "uri": "/kanji/380-the-tip-%E6%9C%AB"
    },
    {
      "kanji": "守",
      "uri": "/kanji/991-protect-%E5%AE%88"
    },
    {
      "kanji": "若",
      "uri": "/kanji/1099-young-%E8%8B%A5"
    },
    {
      "kanji": "種",
      "uri": "/kanji/1077-seed-type-or-kind-%E7%A8%AE"
    },
    {
      "kanji": "美",
      "uri": "/kanji/965-beauty-%E7%BE%8E"
    },
    {
      "kanji": "命",
      "uri": "/kanji/949-life-%E5%91%BD"
    },
    {
      "kanji": "福",
      "uri": "/kanji/1500-good-luck-%E7%A6%8F"
    },
    {
      "kanji": "望",
      "uri": "/kanji/449-desire-%E6%9C%9B"
    },
    {
      "kanji": "非",
      "uri": "/kanji/1081-injustice-mistake-%E9%9D%9E"
    },
    {
      "kanji": "観",
      "uri": "/kanji/1054-point-of-view-%E8%A6%B3"
    },
    {
      "kanji": "察",
      "uri": "/kanji/1182-police-%E5%AF%9F"
    },
    {
      "kanji": "段",
      "uri": "/kanji/1726-step-stairs-%E6%AE%B5"
    },
    {
      "kanji": "横",
      "uri": "/kanji/1547-side-arrogant-%E6%A8%AA"
    },
    {
      "kanji": "深",
      "uri": "/kanji/569-deep-%E6%B7%B1"
    },
    {
      "kanji": "申",
      "uri": "/kanji/1367-humbly-say-god-radical-%E7%94%B3"
    },
    {
      "kanji": "様",
      "uri": "/kanji/879-important-person-%E6%A7%98"
    },
    {
      "kanji": "財",
      "uri": "/kanji/585-loot-%E8%B2%A1"
    },
    {
      "kanji": "港",
      "uri": "/kanji/1555-harbor-%E6%B8%AF"
    },
    {
      "kanji": "識",
      "uri": "/kanji/679-be-conscious-%E8%AD%98"
    },
    {
      "kanji": "呼",
      "uri": "/kanji/191-call-to-someone-%E5%91%BC"
    },
    {
      "kanji": "達",
      "uri": "/kanji/332-pluraldelivery-%E9%81%94"
    },
    {
      "kanji": "良",
      "uri": "/kanji/775-good-%E8%89%AF"
    },
    {
      "kanji": "候",
      "uri": "/kanji/1049-climatecandidate-%E5%80%99"
    },
    {
      "kanji": "程",
      "uri": "/kanji/451-extent-%E7%A8%8B"
    },
    {
      "kanji": "満",
      "uri": "/kanji/1041-full-%E6%BA%80"
    },
    {
      "kanji": "敗",
      "uri": "/kanji/706-be-defeated-%E6%95%97"
    },
    {
      "kanji": "値",
      "uri": "/kanji/1310-price-or-ranking-%E5%80%A4"
    },
    {
      "kanji": "突",
      "uri": "/kanji/404-thrust-%E7%AA%81"
    },
    {
      "kanji": "光",
      "uri": "/kanji/573-shining-%E5%85%89"
    },
    {
      "kanji": "路",
      "uri": "/kanji/616-road-%E8%B7%AF"
    },
    {
      "kanji": "科",
      "uri": "/kanji/1586-science-%E7%A7%91"
    },
    {
      "kanji": "積",
      "uri": "/kanji/553-pile-up-%E7%A9%8D"
    },
    {
      "kanji": "他",
      "uri": "/kanji/1602-other-%E4%BB%96"
    },
    {
      "kanji": "処",
      "uri": "/kanji/1287-dispose-of-or-manage-%E5%87%A6"
    },
    {
      "kanji": "太",
      "uri": "/kanji/413-fat-%E5%A4%AA"
    },
    {
      "kanji": "客",
      "uri": "/kanji/611-customer-%E5%AE%A2"
    },
    {
      "kanji": "否",
      "uri": "/kanji/14-no-%E5%90%A6"
    },
    {
      "kanji": "師",
      "uri": "/kanji/1619-master-teacher-%E5%B8%AB"
    },
    {
      "kanji": "登",
      "uri": "/kanji/1179-climb-%E7%99%BB"
    },
    {
      "kanji": "易",
      "uri": "/kanji/1203-easy-%E6%98%93"
    },
    {
      "kanji": "速",
      "uri": "/kanji/1339-fast-%E9%80%9F"
    },
    {
      "kanji": "存",
      "uri": "/kanji/1104-be-aware-of-%E5%AD%98"
    },
    {
      "kanji": "飛",
      "uri": "/kanji/1533-fly-%E9%A3%9B"
    },
    {
      "kanji": "殺",
      "uri": "/kanji/1297-kill-%E6%AE%BA"
    },
    {
      "kanji": "号",
      "uri": "/kanji/656-id-number-%E5%8F%B7"
    },
    {
      "kanji": "単",
      "uri": "/kanji/596-merely-%E5%8D%98"
    },
    {
      "kanji": "座",
      "uri": "/kanji/1133-sit-%E5%BA%A7"
    },
    {
      "kanji": "破",
      "uri": "/kanji/1324-rend-%E7%A0%B4"
    },
    {
      "kanji": "除",
      "uri": "/kanji/931-exclude-%E9%99%A4"
    },
    {
      "kanji": "完",
      "uri": "/kanji/572-complete-%E5%AE%8C"
    },
    {
      "kanji": "降",
      "uri": "/kanji/1571-descend-rainfall-get-out-of-vehicle-%E9%99%8D"
    },
    {
      "kanji": "責",
      "uri": "/kanji/551-condemn-%E8%B2%AC"
    },
    {
      "kanji": "捕",
      "uri": "/kanji/1564-capture-%E6%8D%95"
    },
    {
      "kanji": "危",
      "uri": "/kanji/1475-dangerous-%E5%8D%B1"
    },
    {
      "kanji": "給",
      "uri": "/kanji/937-provide-%E7%B5%A6"
    },
    {
      "kanji": "苦",
      "uri": "/kanji/66-suffer-%E8%8B%A6"
    },
    {
      "kanji": "迎",
      "uri": "/kanji/1478-go-to-pick-someone-up-%E8%BF%8E"
    },
    {
      "kanji": "園",
      "uri": "/kanji/763-public-park-%E5%9C%92"
    },
    {
      "kanji": "具",
      "uri": "/kanji/570-tool-%E5%85%B7"
    },
    {
      "kanji": "辞",
      "uri": "/kanji/233-quit-%E8%BE%9E"
    },
    {
      "kanji": "因",
      "uri": "/kanji/432-origin-%E5%9B%A0"
    },
    {
      "kanji": "馬",
      "uri": "/kanji/270-horse-%E9%A6%AC"
    },
    {
      "kanji": "愛",
      "uri": "/kanji/610-love-%E6%84%9B"
    },
    {
      "kanji": "富",
      "uri": "/kanji/1503-get-rich-%E5%AF%8C"
    },
    {
      "kanji": "彼",
      "uri": "/kanji/1326-him-%E5%BD%BC"
    },
    {
      "kanji": "未",
      "uri": "/kanji/381-not-yet-%E6%9C%AA"
    },
    {
      "kanji": "舞",
      "uri": "/kanji/1582-dance-flutter-%E8%88%9E"
    },
    {
      "kanji": "亡",
      "uri": "/kanji/104-dying-%E4%BA%A1"
    },
    {
      "kanji": "冷",
      "uri": "/kanji/951-cold-thing-%E5%86%B7"
    },
    {
      "kanji": "適",
      "uri": "/kanji/716-suitable-%E9%81%A9"
    },
    {
      "kanji": "婦",
      "uri": "/kanji/636-housewife-lady-%E5%A9%A6"
    },
    {
      "kanji": "寄",
      "uri": "/kanji/400-get-close-%E5%AF%84"
    },
    {
      "kanji": "込",
      "uri": "/kanji/331-get-crowded-%E8%BE%BC"
    },
    {
      "kanji": "顔",
      "uri": "/kanji/1116-face-%E9%A1%94"
    },
    {
      "kanji": "類",
      "uri": "/kanji/848-categorytype-%E9%A1%9E"
    },
    {
      "kanji": "余",
      "uri": "/kanji/928-excess-%E4%BD%99"
    },
    {
      "kanji": "王",
      "uri": "/kanji/444-king-%E7%8E%8B"
    },
    {
      "kanji": "返",
      "uri": "/kanji/740-return-or-respond-%E8%BF%94"
    },
    {
      "kanji": "妻",
      "uri": "/kanji/1667-wife-%E5%A6%BB"
    },
    {
      "kanji": "背",
      "uri": "/kanji/804-stature-back-of-the-body-%E8%83%8C"
    },
    {
      "kanji": "熱",
      "uri": "/kanji/1279-hot-thing-fever-%E7%86%B1"
    },
    {
      "kanji": "宿",
      "uri": "/kanji/817-lodge-at-%E5%AE%BF"
    },
    {
      "kanji": "薬",
      "uri": "/kanji/1651-medicine-%E8%96%AC"
    },
    {
      "kanji": "険",
      "uri": "/kanji/792-steep-risky-%E9%99%BA"
    },
    {
      "kanji": "頼",
      "uri": "/kanji/1338-ask-a-favor-%E9%A0%BC"
    },
    {
      "kanji": "覚",
      "uri": "/kanji/1625-bear-in-mind-%E8%A6%9A"
    },
    {
      "kanji": "船",
      "uri": "/kanji/1449-ship-%E8%88%B9"
    },
    {
      "kanji": "途",
      "uri": "/kanji/930-on-the-way-%E9%80%94"
    },
    {
      "kanji": "許",
      "uri": "/kanji/1193-allow-%E8%A8%B1"
    },
    {
      "kanji": "抜",
      "uri": "/kanji/1092-extract-%E6%8A%9C"
    },
    {
      "kanji": "便",
      "uri": "/kanji/1594-convenient-poop-%E4%BE%BF"
    },
    {
      "kanji": "留",
      "uri": "/kanji/1264-absent-stopped-%E7%95%99"
    },
    {
      "kanji": "罪",
      "uri": "/kanji/1084-sin-%E7%BD%AA"
    },
    {
      "kanji": "努",
      "uri": "/kanji/179-make-an-effort-%E5%8A%AA"
    },
    {
      "kanji": "精",
      "uri": "/kanji/469-spirit-%E7%B2%BE"
    },
    {
      "kanji": "散",
      "uri": "/kanji/1540-scatter-%E6%95%A3"
    },
    {
      "kanji": "静",
      "uri": "/kanji/1670-quiet-%E9%9D%99"
    },
    {
      "kanji": "婚",
      "uri": "/kanji/1163-marriage-%E5%A9%9A"
    },
    {
      "kanji": "喜",
      "uri": "/kanji/838-rejoice-%E5%96%9C"
    },
    {
      "kanji": "浮",
      "uri": "/kanji/603-float-%E6%B5%AE"
    },
    {
      "kanji": "絶",
      "uri": "/kanji/1214-extinct-%E7%B5%B6"
    },
    {
      "kanji": "幸",
      "uri": "/kanji/150-luck-happiness-%E5%B9%B8"
    },
    {
      "kanji": "押",
      "uri": "/kanji/1373-push-%E6%8A%BC"
    },
    {
      "kanji": "倒",
      "uri": "/kanji/1256-knock-down-%E5%80%92"
    },
    {
      "kanji": "等",
      "uri": "/kanji/1005-equal-etcplural-%E7%AD%89"
    },
    {
      "kanji": "老",
      "uri": "/kanji/253-get-old-%E8%80%81"
    },
    {
      "kanji": "曲",
      "uri": "/kanji/1167-song-turn-or-bend-%E6%9B%B2"
    },
    {
      "kanji": "払",
      "uri": "/kanji/297-pay-%E6%89%95"
    },
    {
      "kanji": "庭",
      "uri": "/kanji/1155-garden-%E5%BA%AD"
    },
    {
      "kanji": "徒",
      "uri": "/kanji/1232-pupil-follower-%E5%BE%92"
    },
    {
      "kanji": "勤",
      "uri": "/kanji/423-be-employed-at-%E5%8B%A4"
    },
    {
      "kanji": "遅",
      "uri": "/kanji/873-slow-late-%E9%81%85"
    },
    {
      "kanji": "居",
      "uri": "/kanji/499-live-%E5%B1%85"
    },
    {
      "kanji": "雑",
      "uri": "/kanji/366-miscellaneous-random-%E9%9B%91"
    },
    {
      "kanji": "招",
      "uri": "/kanji/302-beckon-%E6%8B%9B"
    },
    {
      "kanji": "困",
      "uri": "/kanji/435-trouble-%E5%9B%B0"
    },
    {
      "kanji": "欠",
      "uri": "/kanji/697-lack-%E6%AC%A0"
    },
    {
      "kanji": "更",
      "uri": "/kanji/1591-all-over-again-%E6%9B%B4"
    },
    {
      "kanji": "刻",
      "uri": "/kanji/1696-engrave-%E5%88%BB"
    },
    {
      "kanji": "賛",
      "uri": "/kanji/589-agree-%E8%B3%9B"
    },
    {
      "kanji": "抱",
      "uri": "/kanji/1417-hug-%E6%8A%B1"
    },
    {
      "kanji": "犯",
      "uri": "/kanji/1464-commit-a-crime-%E7%8A%AF"
    },
    {
      "kanji": "恐",
      "uri": "/kanji/1291-dread-%E6%81%90"
    },
    {
      "kanji": "息",
      "uri": "/kanji/101-son-breath-%E6%81%AF"
    },
    {
      "kanji": "遠",
      "uri": "/kanji/762-far-%E9%81%A0"
    },
    {
      "kanji": "戻",
      "uri": "/kanji/510-return-%E6%88%BB"
    },
    {
      "kanji": "願",
      "uri": "/kanji/843-beseech-%E9%A1%98"
    },
    {
      "kanji": "絵",
      "uri": "/kanji/1270-picture-%E7%B5%B5"
    },
    {
      "kanji": "越",
      "uri": "/kanji/747-go-beyond-%E8%B6%8A"
    },
    {
      "kanji": "欲",
      "uri": "/kanji/1519-want-%E6%AC%B2"
    },
    {
      "kanji": "痛",
      "uri": "/kanji/1348-hurts-%E7%97%9B"
    },
    {
      "kanji": "笑",
      "uri": "/kanji/882-laugh-%E7%AC%91"
    },
    {
      "kanji": "互",
      "uri": "/kanji/1747-reciprocal-%E4%BA%92"
    },
    {
      "kanji": "束",
      "uri": "/kanji/1336-bundle-of-sticks-%E6%9D%9F"
    },
    {
      "kanji": "似",
      "uri": "/kanji/1722-resemble-%E4%BC%BC"
    },
    {
      "kanji": "列",
      "uri": "/kanji/1315-row-%E5%88%97"
    },
    {
      "kanji": "探",
      "uri": "/kanji/568-look-for-%E6%8E%A2"
    },
    {
      "kanji": "逃",
      "uri": "/kanji/1653-escape-%E9%80%83"
    },
    {
      "kanji": "遊",
      "uri": "/kanji/1753-play-around-%E9%81%8A"
    },
    {
      "kanji": "迷",
      "uri": "/kanji/385-perplexed-%E8%BF%B7"
    },
    {
      "kanji": "夢",
      "uri": "/kanji/116-dream-%E5%A4%A2"
    },
    {
      "kanji": "君",
      "uri": "/kanji/1665-buddy-%E5%90%9B"
    },
    {
      "kanji": "閉",
      "uri": "/kanji/587-close-store-%E9%96%89"
    },
    {
      "kanji": "緒",
      "uri": "/kanji/257-together-%E7%B7%92"
    },
    {
      "kanji": "折",
      "uri": "/kanji/316-fold-%E6%8A%98"
    },
    {
      "kanji": "草",
      "uri": "/kanji/67-grass-%E8%8D%89"
    },
    {
      "kanji": "暮",
      "uri": "/kanji/427-make-a-living-%E6%9A%AE"
    },
    {
      "kanji": "酒",
      "uri": "/kanji/578-liquor-%E9%85%92"
    },
    {
      "kanji": "悲",
      "uri": "/kanji/1083-sad-%E6%82%B2"
    },
    {
      "kanji": "晴",
      "uri": "/kanji/470-weather-get-good-now-%E6%99%B4"
    },
    {
      "kanji": "掛",
      "uri": "/kanji/1273-hang-halfway-done-%E6%8E%9B"
    },
    {
      "kanji": "到",
      "uri": "/kanji/1254-arrive-%E5%88%B0"
    },
    {
      "kanji": "寝",
      "uri": "/kanji/802-go-to-bed-%E5%AF%9D"
    },
    {
      "kanji": "暗",
      "uri": "/kanji/155-dark-%E6%9A%97"
    },
    {
      "kanji": "盗",
      "uri": "/kanji/1434-steal-by-stealth-%E7%9B%97"
    },
    {
      "kanji": "吸",
      "uri": "/kanji/626-suck-%E5%90%B8"
    },
    {
      "kanji": "陽",
      "uri": "/kanji/1206-sun-%E9%99%BD"
    },
    {
      "kanji": "御",
      "uri": "/kanji/1470-the-honorific-o-%E5%BE%A1"
    },
    {
      "kanji": "歯",
      "uri": "/kanji/1032-tooth-%E6%AD%AF"
    },
    {
      "kanji": "忘",
      "uri": "/kanji/106-forget-%E5%BF%98"
    },
    {
      "kanji": "雪",
      "uri": "/kanji/1391-snow-%E9%9B%AA"
    },
    {
      "kanji": "吹",
      "uri": "/kanji/701-blow-%E5%90%B9"
    },
    {
      "kanji": "娘",
      "uri": "/kanji/776-daughter-%E5%A8%98"
    },
    {
      "kanji": "誤",
      "uri": "/kanji/1735-mistake-%E8%AA%A4"
    },
    {
      "kanji": "洗",
      "uri": "/kanji/811-wash-%E6%B4%97"
    },
    {
      "kanji": "慣",
      "uri": "/kanji/550-adapt-%E6%85%A3"
    },
    {
      "kanji": "礼",
      "uri": "/kanji/1504-polite-%E7%A4%BC"
    },
    {
      "kanji": "窓",
      "uri": "/kanji/567-window-%E7%AA%93"
    },
    {
      "kanji": "昔",
      "uri": "/kanji/1543-long-ago-%E6%98%94"
    },
    {
      "kanji": "貧",
      "uri": "/kanji/537-poverty-%E8%B2%A7"
    },
    {
      "kanji": "怒",
      "uri": "/kanji/100-get-mad-%E6%80%92"
    },
    {
      "kanji": "泳",
      "uri": "/kanji/37-swim-%E6%B3%B3"
    },
    {
      "kanji": "祖",
      "uri": "/kanji/1492-ancestor-%E7%A5%96"
    },
    {
      "kanji": "杯",
      "uri": "/kanji/360-one-cup-of-liquid-%E6%9D%AF"
    },
    {
      "kanji": "疲",
      "uri": "/kanji/1349-get-tired-from-hard-work-%E7%96%B2"
    },
    {
      "kanji": "皆",
      "uri": "/kanji/32-everyone-%E7%9A%86"
    },
    {
      "kanji": "鳴",
      "uri": "/kanji/836-animal-cry-%E9%B3%B4"
    },
    {
      "kanji": "腹",
      "uri": "/kanji/1514-entrails-%E8%85%B9"
    },
    {
      "kanji": "煙",
      "uri": "/kanji/583-smoky-%E7%85%99"
    },
    {
      "kanji": "眠",
      "uri": "/kanji/1166-sleepy-%E7%9C%A0"
    },
    {
      "kanji": "怖",
      "uri": "/kanji/1096-scary-%E6%80%96"
    },
    {
      "kanji": "耳",
      "uri": "/kanji/309-ear-%E8%80%B3"
    },
    {
      "kanji": "頂",
      "uri": "/kanji/846-summitclimax-%E9%A0%82"
    },
    {
      "kanji": "箱",
      "uri": "/kanji/351-box-%E7%AE%B1"
    },
    {
      "kanji": "晩",
      "uri": "/kanji/1213-night-%E6%99%A9"
    },
    {
      "kanji": "寒",
      "uri": "/kanji/960-cold-%E5%AF%92"
    },
    {
      "kanji": "髪",
      "uri": "/kanji/1113-hair-%E9%AB%AA"
    },
    {
      "kanji": "忙",
      "uri": "/kanji/105-busy-%E5%BF%99"
    },
    {
      "kanji": "才",
      "uri": "/kanji/1744-skill-age-%E6%89%8D"
    },
    {
      "kanji": "靴",
      "uri": "/kanji/515-shoe-%E9%9D%B4"
    },
    {
      "kanji": "恥",
      "uri": "/kanji/314-disgrace-%E6%81%A5"
    },
    {
      "kanji": "偶",
      "uri": "/kanji/1380-coincidence-%E5%81%B6"
    },
    {
      "kanji": "偉",
      "uri": "/kanji/1578-high-powered-prestigious-%E5%81%89"
    },
    {
      "kanji": "猫",
      "uri": "/kanji/1453-cat-%E7%8C%AB"
    },
    {
      "kanji": "幾",
      "uri": "/kanji/674-how-much-%E5%B9%BE"
    }
  ];
  
  const kanjiDataN2 = [
    {
      "kanji": "党",
      "uri": "/kanji/1626-political-party-%E5%85%9A"
    },
    {
      "kanji": "協",
      "uri": "/kanji/177-cooperate-%E5%8D%94"
    },
    {
      "kanji": "総",
      "uri": "/kanji/214-general-total-%E7%B7%8F"
    },
    {
      "kanji": "区",
      "uri": "/kanji/680-ward-%E5%8C%BA"
    },
    {
      "kanji": "領",
      "uri": "/kanji/948-territory-%E9%A0%98"
    },
    {
      "kanji": "県",
      "uri": "/kanji/1306-prefecture-%E7%9C%8C"
    },
    {
      "kanji": "設",
      "uri": "/kanji/1295-establish-%E8%A8%AD"
    },
    {
      "kanji": "改",
      "uri": "/kanji/720-renew-improve-%E6%94%B9"
    },
    {
      "kanji": "府",
      "uri": "/kanji/1129-government-%E5%BA%9C"
    },
    {
      "kanji": "査",
      "uri": "/kanji/1488-inspect-%E6%9F%BB"
    },
    {
      "kanji": "委",
      "uri": "/kanji/376-member-%E5%A7%94"
    },
    {
      "kanji": "軍",
      "uri": "/kanji/1068-army-%E8%BB%8D"
    },
    {
      "kanji": "団",
      "uri": "/kanji/992-group-%E5%9B%A3"
    },
    {
      "kanji": "各",
      "uri": "/kanji/609-each-%E5%90%84"
    },
    {
      "kanji": "島",
      "uri": "/kanji/835-island-%E5%B3%B6"
    },
    {
      "kanji": "革",
      "uri": "/kanji/514-leatherrevolution-%E9%9D%A9"
    },
    {
      "kanji": "村",
      "uri": "/kanji/994-hicktown-%E6%9D%91"
    },
    {
      "kanji": "勢",
      "uri": "/kanji/1278-power-%E5%8B%A2"
    },
    {
      "kanji": "減",
      "uri": "/kanji/754-decrease-%E6%B8%9B"
    },
    {
      "kanji": "再",
      "uri": "/kanji/1560-again-once-more-%E5%86%8D"
    },
    {
      "kanji": "税",
      "uri": "/kanji/862-tax-%E7%A8%8E"
    },
    {
      "kanji": "営",
      "uri": "/kanji/1621-manage-a-business-%E5%96%B6"
    },
    {
      "kanji": "比",
      "uri": "/kanji/21-compare-%E6%AF%94"
    },
    {
      "kanji": "防",
      "uri": "/kanji/789-ward-off-%E9%98%B2"
    },
    {
      "kanji": "補",
      "uri": "/kanji/1563-supplement-%E8%A3%9C"
    },
    {
      "kanji": "境",
      "uri": "/kanji/523-border-%E5%A2%83"
    },
    {
      "kanji": "導",
      "uri": "/kanji/998-lead-%E5%B0%8E"
    },
    {
      "kanji": "副",
      "uri": "/kanji/1501-side-or-vice-%E5%89%AF"
    },
    {
      "kanji": "算",
      "uri": "/kanji/1527-calculate-%E7%AE%97"
    },
    {
      "kanji": "輸",
      "uri": "/kanji/1358-transport-%E8%BC%B8"
    },
    {
      "kanji": "述",
      "uri": "/kanji/334-refer-to-%E8%BF%B0"
    },
    {
      "kanji": "線",
      "uri": "/kanji/211-line-%E7%B7%9A"
    },
    {
      "kanji": "農",
      "uri": "/kanji/1172-farming-%E8%BE%B2"
    },
    {
      "kanji": "州",
      "uri": "/kanji/855-state-%E5%B7%9E"
    },
    {
      "kanji": "武",
      "uri": "/kanji/662-military-%E6%AD%A6"
    },
    {
      "kanji": "象",
      "uri": "/kanji/1220-elephant-phenomenon-%E8%B1%A1"
    },
    {
      "kanji": "域",
      "uri": "/kanji/671-region-%E5%9F%9F"
    },
    {
      "kanji": "額",
      "uri": "/kanji/847-amount-of-money-forehead-%E9%A1%8D"
    },
    {
      "kanji": "欧",
      "uri": "/kanji/699-europe-%E6%AC%A7"
    },
    {
      "kanji": "担",
      "uri": "/kanji/304-carry-on-your-back-%E6%8B%85"
    },
    {
      "kanji": "準",
      "uri": "/kanji/268-prepare-criteria-%E6%BA%96"
    },
    {
      "kanji": "賞",
      "uri": "/kanji/1628-prize-%E8%B3%9E"
    },
    {
      "kanji": "辺",
      "uri": "/kanji/329-around-herearound-that-time-%E8%BE%BA"
    },
    {
      "kanji": "造",
      "uri": "/kanji/808-produce-%E9%80%A0"
    },
    {
      "kanji": "被",
      "uri": "/kanji/1511-get-injured-%E8%A2%AB"
    },
    {
      "kanji": "技",
      "uri": "/kanji/1321-technique-%E6%8A%80"
    },
    {
      "kanji": "低",
      "uri": "/kanji/1162-low-%E4%BD%8E"
    },
    {
      "kanji": "復",
      "uri": "/kanji/1515-return-or-re-do-%E5%BE%A9"
    },
    {
      "kanji": "移",
      "uri": "/kanji/373-transfer-%E7%A7%BB"
    },
    {
      "kanji": "個",
      "uri": "/kanji/440-individual-%E5%80%8B"
    },
    {
      "kanji": "門",
      "uri": "/kanji/160-gate-%E9%96%80"
    },
    {
      "kanji": "課",
      "uri": "/kanji/355-section-or-lesson-%E8%AA%B2"
    },
    {
      "kanji": "脳",
      "uri": "/kanji/1036-brain-%E8%84%B3"
    },
    {
      "kanji": "極",
      "uri": "/kanji/654-extreme-%E6%A5%B5"
    },
    {
      "kanji": "含",
      "uri": "/kanji/944-include-%E5%90%AB"
    },
    {
      "kanji": "蔵",
      "uri": "/kanji/748-traditional-storehouse-%E8%94%B5"
    },
    {
      "kanji": "量",
      "uri": "/kanji/237-quantity-%E9%87%8F"
    },
    {
      "kanji": "型",
      "uri": "/kanji/1191-type-proper-way-%E5%9E%8B"
    },
    {
      "kanji": "況",
      "uri": "/kanji/528-condition-%E6%B3%81"
    },
    {
      "kanji": "針",
      "uri": "/kanji/916-needle-%E9%87%9D"
    },
    {
      "kanji": "専",
      "uri": "/kanji/1016-specialty-%E5%B0%82"
    },
    {
      "kanji": "谷",
      "uri": "/kanji/1517-valley-swamp-thing-radical-%E8%B0%B7"
    },
    {
      "kanji": "史",
      "uri": "/kanji/1590-history-%E5%8F%B2"
    },
    {
      "kanji": "階",
      "uri": "/kanji/786-story-of-a-building-%E9%9A%8E"
    },
    {
      "kanji": "管",
      "uri": "/kanji/1618-tube-%E7%AE%A1"
    },
    {
      "kanji": "兵",
      "uri": "/kanji/556-soldier-%E5%85%B5"
    },
    {
      "kanji": "接",
      "uri": "/kanji/305-directly-contact-%E6%8E%A5"
    },
    {
      "kanji": "細",
      "uri": "/kanji/213-slender-%E7%B4%B0"
    },
    {
      "kanji": "効",
      "uri": "/kanji/1013-effective-%E5%8A%B9"
    },
    {
      "kanji": "丸",
      "uri": "/kanji/183-round-%E4%B8%B8"
    },
    {
      "kanji": "湾",
      "uri": "/kanji/901-bay-%E6%B9%BE"
    },
    {
      "kanji": "録",
      "uri": "/kanji/912-record-%E9%8C%B2"
    },
    {
      "kanji": "省",
      "uri": "/kanji/196-ministry-cut-down-on-%E7%9C%81"
    },
    {
      "kanji": "旧",
      "uri": "/kanji/28-former-%E6%97%A7"
    },
    {
      "kanji": "橋",
      "uri": "/kanji/1642-bridge-%E6%A9%8B"
    },
    {
      "kanji": "岸",
      "uri": "/kanji/831-shore-%E5%B2%B8"
    },
    {
      "kanji": "周",
      "uri": "/kanji/1635-circumference-%E5%91%A8"
    },
    {
      "kanji": "材",
      "uri": "/kanji/586-raw-materials-%E6%9D%90"
    },
    {
      "kanji": "戸",
      "uri": "/kanji/505-door-%E6%88%B8"
    },
    {
      "kanji": "央",
      "uri": "/kanji/405-central-%E5%A4%AE"
    },
    {
      "kanji": "券",
      "uri": "/kanji/890-certificate-cupon-%E5%88%B8"
    },
    {
      "kanji": "編",
      "uri": "/kanji/968-knit-%E7%B7%A8"
    },
    {
      "kanji": "捜",
      "uri": "/kanji/1370-search-%E6%8D%9C"
    },
    {
      "kanji": "竹",
      "uri": "/kanji/321-bamboo-%E7%AB%B9"
    },
    {
      "kanji": "超",
      "uri": "/kanji/287-exceed-go-over-%E8%B6%85"
    },
    {
      "kanji": "並",
      "uri": "/kanji/1549-line-up-ordinary-%E4%B8%A6"
    },
    {
      "kanji": "療",
      "uri": "/kanji/1364-medical-therapy-%E7%99%82"
    },
    {
      "kanji": "採",
      "uri": "/kanji/607-gather-%E6%8E%A1"
    },
    {
      "kanji": "森",
      "uri": "/kanji/337-forest-%E6%A3%AE"
    },
    {
      "kanji": "競",
      "uri": "/kanji/529-contest-%E7%AB%B6"
    },
    {
      "kanji": "介",
      "uri": "/kanji/934-introduce-intervene-%E4%BB%8B"
    },
    {
      "kanji": "根",
      "uri": "/kanji/781-root-%E6%A0%B9"
    },
    {
      "kanji": "販",
      "uri": "/kanji/744-transaction-%E8%B2%A9"
    },
    {
      "kanji": "歴",
      "uri": "/kanji/731-chronicle-%E6%AD%B4"
    },
    {
      "kanji": "将",
      "uri": ""
    },
    {
      "kanji": "幅",
      "uri": "/kanji/1502-width-%E5%B9%85"
    },
    {
      "kanji": "般",
      "uri": "/kanji/1451-general-overall-%E8%88%AC"
    },
    {
      "kanji": "貿",
      "uri": "/kanji/1263-international-trading-%E8%B2%BF"
    },
    {
      "kanji": "講",
      "uri": "/kanji/1567-lecture-%E8%AC%9B"
    },
    {
      "kanji": "林",
      "uri": "/kanji/336-grove-%E6%9E%97"
    },
    {
      "kanji": "装",
      "uri": "/kanji/800-dress-up-%E8%A3%85"
    },
    {
      "kanji": "諸",
      "uri": "/kanji/258-various-%E8%AB%B8"
    },
    {
      "kanji": "劇",
      "uri": "/kanji/1685-play-%E5%8A%87"
    },
    {
      "kanji": "河",
      "uri": "/kanji/53-stream-%E6%B2%B3"
    },
    {
      "kanji": "航",
      "uri": "/kanji/1450-navigation-%E8%88%AA"
    },
    {
      "kanji": "鉄",
      "uri": "/kanji/1052-iron-%E9%89%84"
    },
    {
      "kanji": "児",
      "uri": "/kanji/530-baby-%E5%85%90"
    },
    {
      "kanji": "禁",
      "uri": "/kanji/353-prohibition-%E7%A6%81"
    },
    {
      "kanji": "印",
      "uri": "/kanji/1465-stamp-%E5%8D%B0"
    },
    {
      "kanji": "逆",
      "uri": "/kanji/1720-opposite-%E9%80%86"
    },
    {
      "kanji": "換",
      "uri": "/kanji/696-exchange-%E6%8F%9B"
    },
    {
      "kanji": "久",
      "uri": "/kanji/608-been-a-long-time-%E4%B9%85"
    },
    {
      "kanji": "短",
      "uri": "/kanji/1046-short-brief-%E7%9F%AD"
    },
    {
      "kanji": "油",
      "uri": "/kanji/1377-oil-%E6%B2%B9"
    },
    {
      "kanji": "暴",
      "uri": "/kanji/1558-rampage-%E6%9A%B4"
    },
    {
      "kanji": "輪",
      "uri": "/kanji/1063-ringtire-%E8%BC%AA"
    },
    {
      "kanji": "占",
      "uri": "/kanji/125-fortune-teller-occupy-%E5%8D%A0"
    },
    {
      "kanji": "植",
      "uri": "/kanji/1311-plant-%E6%A4%8D"
    },
    {
      "kanji": "清",
      "uri": "/kanji/468-pure-%E6%B8%85"
    },
    {
      "kanji": "倍",
      "uri": "/kanji/797-double-%E5%80%8D"
    },
    {
      "kanji": "均",
      "uri": "/kanji/1432-average-%E5%9D%87"
    },
    {
      "kanji": "億",
      "uri": "/kanji/158-a-hundred-million-%E5%84%84"
    },
    {
      "kanji": "圧",
      "uri": "/kanji/733-pressure-%E5%9C%A7"
    },
    {
      "kanji": "芸",
      "uri": "/kanji/1268-art-%E8%8A%B8"
    },
    {
      "kanji": "署",
      "uri": "/kanji/259-government-office-%E7%BD%B2"
    },
    {
      "kanji": "伸",
      "uri": "/kanji/1371-stretch-%E4%BC%B8"
    },
    {
      "kanji": "停",
      "uri": "/kanji/82-bring-to-a-halt-%E5%81%9C"
    },
    {
      "kanji": "爆",
      "uri": "/kanji/1559-explode-%E7%88%86"
    },
    {
      "kanji": "陸",
      "uri": "/kanji/1277-continent-%E9%99%B8"
    },
    {
      "kanji": "玉",
      "uri": "/kanji/452-ball-%E7%8E%89"
    },
    {
      "kanji": "波",
      "uri": "/kanji/1325-wave-%E6%B3%A2"
    },
    {
      "kanji": "帯",
      "uri": "/kanji/825-belt-%E5%B8%AF"
    },
    {
      "kanji": "延",
      "uri": "/kanji/1157-prolong-%E5%BB%B6"
    },
    {
      "kanji": "羽",
      "uri": "/kanji/1532-feathers-%E7%BE%BD"
    },
    {
      "kanji": "固",
      "uri": "/kanji/439-hard-%E5%9B%BA"
    },
    {
      "kanji": "則",
      "uri": "/kanji/546-rule-%E5%89%87"
    },
    {
      "kanji": "乱",
      "uri": "/kanji/1505-disorder-%E4%B9%B1"
    },
    {
      "kanji": "普",
      "uri": "/kanji/1550-normal-%E6%99%AE"
    },
    {
      "kanji": "測",
      "uri": "/kanji/548-scientific-measurement-%E6%B8%AC"
    },
    {
      "kanji": "豊",
      "uri": "/kanji/1168-plentiful-%E8%B1%8A"
    },
    {
      "kanji": "厚",
      "uri": "/kanji/732-thick-%E5%8E%9A"
    },
    {
      "kanji": "齢",
      "uri": "/kanji/1034-stage-of-life-%E9%BD%A2"
    },
    {
      "kanji": "囲",
      "uri": "/kanji/442-surround-%E5%9B%B2"
    },
    {
      "kanji": "卒",
      "uri": "/kanji/83-graduate-%E5%8D%92"
    },
    {
      "kanji": "略",
      "uri": "/kanji/615-abbreviation-%E7%95%A5"
    },
    {
      "kanji": "承",
      "uri": "/kanji/1723-to-be-told-consent-%E6%89%BF"
    },
    {
      "kanji": "順",
      "uri": "/kanji/854-sequence-%E9%A0%86"
    },
    {
      "kanji": "岩",
      "uri": "/kanji/824-boulder-%E5%B2%A9"
    },
    {
      "kanji": "練",
      "uri": "/kanji/358-practice-%E7%B7%B4"
    },
    {
      "kanji": "軽",
      "uri": "/kanji/1088-lightweight-%E8%BB%BD"
    },
    {
      "kanji": "了",
      "uri": "/kanji/4-total-%E4%BA%86"
    },
    {
      "kanji": "庁",
      "uri": "/kanji/1130-metropolitan-government-%E5%BA%81"
    },
    {
      "kanji": "城",
      "uri": "/kanji/753-castle-%E5%9F%8E"
    },
    {
      "kanji": "患",
      "uri": "/kanji/491-medical-patient-%E6%82%A3"
    },
    {
      "kanji": "層",
      "uri": "/kanji/1609-layer-%E5%B1%A4"
    },
    {
      "kanji": "版",
      "uri": "/kanji/1107-printing-plate-%E7%89%88"
    },
    {
      "kanji": "令",
      "uri": "/kanji/946-command-%E4%BB%A4"
    },
    {
      "kanji": "角",
      "uri": "/kanji/561-horncorner-%E8%A7%92"
    },
    {
      "kanji": "絡",
      "uri": "/kanji/614-get-entangled-%E7%B5%A1"
    },
    {
      "kanji": "損",
      "uri": "/kanji/545-harm-%E6%90%8D"
    },
    {
      "kanji": "募",
      "uri": "/kanji/428-recruit-%E5%8B%9F"
    },
    {
      "kanji": "裏",
      "uri": "/kanji/772-backside-%E8%A3%8F"
    },
    {
      "kanji": "仏",
      "uri": "/kanji/146-buddha-%E4%BB%8F"
    },
    {
      "kanji": "績",
      "uri": "/kanji/552-achievements-%E7%B8%BE"
    },
    {
      "kanji": "築",
      "uri": "/kanji/1290-architect-%E7%AF%89"
    },
    {
      "kanji": "貨",
      "uri": "/kanji/536-cargo-%E8%B2%A8"
    },
    {
      "kanji": "混",
      "uri": "/kanji/40-mix-%E6%B7%B7"
    },
    {
      "kanji": "昇",
      "uri": "/kanji/1529-ascend-%E6%98%87"
    },
    {
      "kanji": "池",
      "uri": "/kanji/1601-pond-%E6%B1%A0"
    },
    {
      "kanji": "血",
      "uri": "/kanji/1441-blood-%E8%A1%80"
    },
    {
      "kanji": "温",
      "uri": "/kanji/1435-hot-or-warm-thing-%E6%B8%A9"
    },
    {
      "kanji": "季",
      "uri": "/kanji/375-season-%E5%AD%A3"
    },
    {
      "kanji": "星",
      "uri": "/kanji/474-star-%E6%98%9F"
    },
    {
      "kanji": "永",
      "uri": "/kanji/36-forever-%E6%B0%B8"
    },
    {
      "kanji": "著",
      "uri": "/kanji/256-author-%E8%91%97"
    },
    {
      "kanji": "誌",
      "uri": "/kanji/251-magazine-%E8%AA%8C"
    },
    {
      "kanji": "庫",
      "uri": "/kanji/1131-warehouse-%E5%BA%AB"
    },
    {
      "kanji": "刊",
      "uri": "/kanji/223-edition-%E5%88%8A"
    },
    {
      "kanji": "像",
      "uri": "/kanji/1221-statue-image-%E5%83%8F"
    },
    {
      "kanji": "香",
      "uri": "/kanji/377-good-smell-%E9%A6%99"
    },
    {
      "kanji": "坂",
      "uri": "/kanji/741-slope-%E5%9D%82"
    },
    {
      "kanji": "底",
      "uri": "/kanji/1160-bottom-%E5%BA%95"
    },
    {
      "kanji": "布",
      "uri": "/kanji/1094-fabric-%E5%B8%83"
    },
    {
      "kanji": "寺",
      "uri": "/kanji/1000-temple-%E5%AF%BA"
    },
    {
      "kanji": "宇",
      "uri": "/kanji/228-cosmos-%E5%AE%87"
    },
    {
      "kanji": "巨",
      "uri": "/kanji/682-giant-super-huge-%E5%B7%A8"
    },
    {
      "kanji": "震",
      "uri": "/kanji/1389-shake-tremble-%E9%9C%87"
    },
    {
      "kanji": "希",
      "uri": "/kanji/1095-request-uncommon-%E5%B8%8C"
    },
    {
      "kanji": "触",
      "uri": "/kanji/562-touch-%E8%A7%A6"
    },
    {
      "kanji": "依",
      "uri": "/kanji/768-depend-on-%E4%BE%9D"
    },
    {
      "kanji": "籍",
      "uri": "/kanji/1545-family-register-%E7%B1%8D"
    },
    {
      "kanji": "汚",
      "uri": "/kanji/653-dirty-%E6%B1%9A"
    },
    {
      "kanji": "枚",
      "uri": "/kanji/704-counter-for-flat-objects-%E6%9E%9A"
    },
    {
      "kanji": "複",
      "uri": "/kanji/1513-complicated-or-compound-%E8%A4%87"
    },
    {
      "kanji": "郵",
      "uri": "/kanji/1075-mail-%E9%83%B5"
    },
    {
      "kanji": "仲",
      "uri": "/kanji/492-friendship-%E4%BB%B2"
    },
    {
      "kanji": "栄",
      "uri": "/kanji/1623-glory-%E6%A0%84"
    },
    {
      "kanji": "札",
      "uri": "/kanji/1506-card-label-bill-%E6%9C%AD"
    },
    {
      "kanji": "板",
      "uri": "/kanji/742-plank-%E6%9D%BF"
    },
    {
      "kanji": "骨",
      "uri": "/kanji/1645-bone-%E9%AA%A8"
    },
    {
      "kanji": "傾",
      "uri": "/kanji/851-lean-%E5%82%BE"
    },
    {
      "kanji": "届",
      "uri": "/kanji/1378-extend-to-%E5%B1%8A"
    },
    {
      "kanji": "巻",
      "uri": "/kanji/888-roll-up-%E5%B7%BB"
    },
    {
      "kanji": "燃",
      "uri": "/kanji/412-burn-%E7%87%83"
    },
    {
      "kanji": "跡",
      "uri": "/kanji/902-vestiges-%E8%B7%A1"
    },
    {
      "kanji": "包",
      "uri": "/kanji/1412-wrap-%E5%8C%85"
    },
    {
      "kanji": "駐",
      "uri": "/kanji/461-stop-at-%E9%A7%90"
    },
    {
      "kanji": "弱",
      "uri": "/kanji/1536-weak-%E5%BC%B1"
    },
    {
      "kanji": "紹",
      "uri": "/kanji/210-acquaint-%E7%B4%B9"
    },
    {
      "kanji": "雇",
      "uri": "/kanji/508-hire-%E9%9B%87"
    },
    {
      "kanji": "替",
      "uri": "/kanji/590-substitute-%E6%9B%BF"
    },
    {
      "kanji": "預",
      "uri": "/kanji/1331-deposit-%E9%A0%90"
    },
    {
      "kanji": "焼",
      "uri": "/kanji/522-roast-grill-%E7%84%BC"
    },
    {
      "kanji": "簡",
      "uri": "/kanji/323-simplicity-%E7%B0%A1"
    },
    {
      "kanji": "章",
      "uri": "/kanji/154-emblem-chapter-%E7%AB%A0"
    },
    {
      "kanji": "臓",
      "uri": "/kanji/749-internal-organ-%E8%87%93"
    },
    {
      "kanji": "律",
      "uri": "/kanji/1231-regulation-%E5%BE%8B"
    },
    {
      "kanji": "贈",
      "uri": "/kanji/1606-give-%E8%B4%88"
    },
    {
      "kanji": "照",
      "uri": "/kanji/168-contrast-%E7%85%A7"
    },
    {
      "kanji": "薄",
      "uri": "/kanji/1019-weak-or-thin-%E8%96%84"
    },
    {
      "kanji": "群",
      "uri": "/kanji/1666-flock-%E7%BE%A4"
    },
    {
      "kanji": "秒",
      "uri": "/kanji/372-one-second-%E7%A7%92"
    },
    {
      "kanji": "奥",
      "uri": "/kanji/398-waaay-in-the-back-%E5%A5%A5"
    },
    {
      "kanji": "詰",
      "uri": "/kanji/249-cram-in-%E8%A9%B0"
    },
    {
      "kanji": "双",
      "uri": "/kanji/90-pair-%E5%8F%8C"
    },
    {
      "kanji": "刺",
      "uri": "/kanji/344-stab-business-card-%E5%88%BA"
    },
    {
      "kanji": "純",
      "uri": "/kanji/1718-epitome-%E7%B4%94"
    },
    {
      "kanji": "翌",
      "uri": "/kanji/1534-the-next-the-following-%E7%BF%8C"
    },
    {
      "kanji": "快",
      "uri": "/kanji/985-pleasant-%E5%BF%AB"
    },
    {
      "kanji": "片",
      "uri": "/kanji/1106-fragment-%E7%89%87"
    },
    {
      "kanji": "敬",
      "uri": "/kanji/1419-respect-%E6%95%AC"
    },
    {
      "kanji": "悩",
      "uri": "/kanji/1038-worry-%E6%82%A9"
    },
    {
      "kanji": "泉",
      "uri": "/kanji/34-spring-%E6%B3%89"
    },
    {
      "kanji": "皮",
      "uri": "/kanji/1323-skin-%E7%9A%AE"
    },
    {
      "kanji": "漁",
      "uri": ""
    },
    {
      "kanji": "荒",
      "uri": "/kanji/857-go-wild-rough-%E8%8D%92"
    },
    {
      "kanji": "貯",
      "uri": "/kanji/538-save-up-%E8%B2%AF"
    },
    {
      "kanji": "硬",
      "uri": "/kanji/1592-hard-like-a-rock-%E7%A1%AC"
    },
    {
      "kanji": "埋",
      "uri": "/kanji/241-bury-%E5%9F%8B"
    },
    {
      "kanji": "柱",
      "uri": "/kanji/459-pillar-%E6%9F%B1"
    },
    {
      "kanji": "祭",
      "uri": "/kanji/1180-festival-%E7%A5%AD"
    },
    {
      "kanji": "袋",
      "uri": "/kanji/769-sack-%E8%A2%8B"
    },
    {
      "kanji": "筆",
      "uri": "/kanji/1661-paintbrush-%E7%AD%86"
    },
    {
      "kanji": "訓",
      "uri": "/kanji/856-kunyomi-%E8%A8%93"
    },
    {
      "kanji": "浴",
      "uri": "/kanji/1523-bathe-%E6%B5%B4"
    },
    {
      "kanji": "童",
      "uri": "/kanji/239-kid-%E7%AB%A5"
    },
    {
      "kanji": "宝",
      "uri": "/kanji/453-treasure-%E5%AE%9D"
    },
    {
      "kanji": "封",
      "uri": "/kanji/1275-seal-in-%E5%B0%81"
    },
    {
      "kanji": "胸",
      "uri": "/kanji/1037-chestbreast-%E8%83%B8"
    },
    {
      "kanji": "砂",
      "uri": "/kanji/820-sand-%E7%A0%82"
    },
    {
      "kanji": "塩",
      "uri": "/kanji/1438-salt-%E5%A1%A9"
    },
    {
      "kanji": "賢",
      "uri": "/kanji/688-clever-%E8%B3%A2"
    },
    {
      "kanji": "腕",
      "uri": "/kanji/1471-arm-skill-%E8%85%95"
    },
    {
      "kanji": "兆",
      "uri": "/kanji/1652-omen-%E5%85%86"
    },
    {
      "kanji": "床",
      "uri": "/kanji/1134-floor-%E5%BA%8A"
    },
    {
      "kanji": "毛",
      "uri": "/kanji/512-fur-%E6%AF%9B"
    },
    {
      "kanji": "緑",
      "uri": "/kanji/632-green-%E7%B7%91"
    },
    {
      "kanji": "尊",
      "uri": "/kanji/1006-esteem-%E5%B0%8A"
    },
    {
      "kanji": "祝",
      "uri": "/kanji/1494-celebrate-%E7%A5%9D"
    },
    {
      "kanji": "柔",
      "uri": "/kanji/1334-flexible-%E6%9F%94"
    },
    {
      "kanji": "殿",
      "uri": ""
    },
    {
      "kanji": "濃",
      "uri": "/kanji/1173-thick-dense-%E6%BF%83"
    },
    {
      "kanji": "液",
      "uri": "/kanji/118-liquid-%E6%B6%B2"
    },
    {
      "kanji": "衣",
      "uri": "/kanji/766-cloth-%E8%A1%A3"
    },
    {
      "kanji": "肩",
      "uri": "/kanji/507-shoulder-%E8%82%A9"
    },
    {
      "kanji": "零",
      "uri": ""
    },
    {
      "kanji": "幼",
      "uri": "/kanji/205-childhood-%E5%B9%BC"
    },
    {
      "kanji": "荷",
      "uri": "/kanji/68-luggage-%E8%8D%B7"
    },
    {
      "kanji": "泊",
      "uri": "/kanji/38-stay-for-the-night-%E6%B3%8A"
    },
    {
      "kanji": "黄",
      "uri": "/kanji/1546-yellow-%E9%BB%84"
    },
    {
      "kanji": "甘",
      "uri": "/kanji/516-sweet-%E7%94%98"
    },
    {
      "kanji": "臣",
      "uri": "/kanji/685-vassal-%E8%87%A3"
    },
    {
      "kanji": "浅",
      "uri": "/kanji/1677-shallow-%E6%B5%85"
    },
    {
      "kanji": "掃",
      "uri": "/kanji/637-sweep-%E6%8E%83"
    },
    {
      "kanji": "雲",
      "uri": "/kanji/1385-cloud-%E9%9B%B2"
    },
    {
      "kanji": "掘",
      "uri": "/kanji/1026-dig-%E6%8E%98"
    },
    {
      "kanji": "捨",
      "uri": "/kanji/927-throw-away-%E6%8D%A8"
    },
    {
      "kanji": "軟",
      "uri": "/kanji/1066-soft-%E8%BB%9F"
    },
    {
      "kanji": "沈",
      "uri": "/kanji/1692-sink-%E6%B2%88"
    },
    {
      "kanji": "凍",
      "uri": "/kanji/952-to-freeze-%E5%87%8D"
    },
    {
      "kanji": "乳",
      "uri": "/kanji/1507-milk-%E4%B9%B3"
    },
    {
      "kanji": "恋",
      "uri": "/kanji/903-passion-%E6%81%8B"
    },
    {
      "kanji": "紅",
      "uri": "/kanji/647-dark-lipstick-red-color-%E7%B4%85"
    },
    {
      "kanji": "郊",
      "uri": "/kanji/1012-suburb-%E9%83%8A"
    },
    {
      "kanji": "腰",
      "uri": "/kanji/582-waist-%E8%85%B0"
    },
    {
      "kanji": "炭",
      "uri": "/kanji/832-carbon-%E7%82%AD"
    },
    {
      "kanji": "踊",
      "uri": "/kanji/1343-dance-%E8%B8%8A"
    },
    {
      "kanji": "冊",
      "uri": "/kanji/966-counter-for-books-%E5%86%8A"
    },
    {
      "kanji": "勇",
      "uri": "/kanji/1328-courage-%E5%8B%87"
    },
    {
      "kanji": "械",
      "uri": "/kanji/1531-contraption-%E6%A2%B0"
    },
    {
      "kanji": "菜",
      "uri": "/kanji/390-vegetable-%E8%8F%9C"
    },
    {
      "kanji": "珍",
      "uri": "/kanji/1121-very-rare-%E7%8F%8D"
    },
    {
      "kanji": "卵",
      "uri": "/kanji/1467-egg-%E5%8D%B5"
    },
    {
      "kanji": "湖",
      "uri": "/kanji/42-big-lake-%E6%B9%96"
    },
    {
      "kanji": "喫",
      "uri": "/kanji/456-enjoy-a-drink-and-a-smoke-%E5%96%AB"
    },
    {
      "kanji": "干",
      "uri": "/kanji/222-dry-out-%E5%B9%B2"
    },
    {
      "kanji": "虫",
      "uri": "/kanji/493-insizzect-%E8%99%AB"
    },
    {
      "kanji": "刷",
      "uri": "/kanji/504-print-%E5%88%B7"
    },
    {
      "kanji": "湯",
      "uri": "/kanji/1204-hot-water-%E6%B9%AF"
    },
    {
      "kanji": "溶",
      "uri": "/kanji/1522-melt-%E6%BA%B6"
    },
    {
      "kanji": "鉱",
      "uri": ""
    },
    {
      "kanji": "涙",
      "uri": "/kanji/511-teardrop-%E6%B6%99"
    },
    {
      "kanji": "匹",
      "uri": "/kanji/693-small-animal-%E5%8C%B9"
    },
    {
      "kanji": "孫",
      "uri": "/kanji/220-grandchild-%E5%AD%AB"
    },
    {
      "kanji": "鋭",
      "uri": "/kanji/910-sharp-%E9%8B%AD"
    },
    {
      "kanji": "枝",
      "uri": "/kanji/1320-branch-%E6%9E%9D"
    },
    {
      "kanji": "塗",
      "uri": "/kanji/929-paint-%E5%A1%97"
    },
    {
      "kanji": "軒",
      "uri": "/kanji/1064-counter-for-shops-%E8%BB%92"
    },
    {
      "kanji": "毒",
      "uri": "/kanji/483-poison-addict-%E6%AF%92"
    },
    {
      "kanji": "叫",
      "uri": "/kanji/97-shout-%E5%8F%AB"
    },
    {
      "kanji": "拝",
      "uri": "/kanji/1746-worship-%E6%8B%9D"
    },
    {
      "kanji": "氷",
      "uri": "/kanji/35-ice-%E6%B0%B7"
    },
    {
      "kanji": "乾",
      "uri": "/kanji/481-dessicate-%E4%B9%BE"
    },
    {
      "kanji": "棒",
      "uri": "/kanji/963-pole-%E6%A3%92"
    },
    {
      "kanji": "祈",
      "uri": "/kanji/1496-pray-%E7%A5%88"
    },
    {
      "kanji": "拾",
      "uri": "/kanji/939-pick-up-off-the-ground-%E6%8B%BE"
    },
    {
      "kanji": "粉",
      "uri": "/kanji/393-powder-%E7%B2%89"
    },
    {
      "kanji": "糸",
      "uri": "/kanji/209-string-%E7%B3%B8"
    },
    {
      "kanji": "綿",
      "uri": "/kanji/212-cotton-%E7%B6%BF"
    },
    {
      "kanji": "汗",
      "uri": "/kanji/227-sweat-%E6%B1%97"
    },
    {
      "kanji": "銅",
      "uri": "/kanji/975-bronze-%E9%8A%85"
    },
    {
      "kanji": "湿",
      "uri": "/kanji/1396-become-damp-moisten-%E6%B9%BF"
    },
    {
      "kanji": "瓶",
      "uri": ""
    },
    {
      "kanji": "咲",
      "uri": "/kanji/886-bloom-%E5%92%B2"
    },
    {
      "kanji": "召",
      "uri": "/kanji/166-summon-%E5%8F%AC"
    },
    {
      "kanji": "缶",
      "uri": "/kanji/1027-can-like-canned-beef-%E7%BC%B6"
    },
    {
      "kanji": "隻",
      "uri": ""
    },
    {
      "kanji": "脂",
      "uri": "/kanji/44-animal-fat-%E8%84%82"
    },
    {
      "kanji": "蒸",
      "uri": "/kanji/1724-humid-%E8%92%B8"
    },
    {
      "kanji": "肌",
      "uri": "/kanji/1282-human-skin-%E8%82%8C"
    },
    {
      "kanji": "耕",
      "uri": ""
    },
    {
      "kanji": "鈍",
      "uri": "/kanji/1719-dull-%E9%88%8D"
    },
    {
      "kanji": "泥",
      "uri": "/kanji/501-mud-%E6%B3%A5"
    },
    {
      "kanji": "隅",
      "uri": "/kanji/1381-corner-of-room-%E9%9A%85"
    },
    {
      "kanji": "灯",
      "uri": "/kanji/52-streetlight-%E7%81%AF"
    },
    {
      "kanji": "辛",
      "uri": "/kanji/149-spicy-painful-%E8%BE%9B"
    },
    {
      "kanji": "磨",
      "uri": "/kanji/1126-to-brush-%E7%A3%A8"
    },
    {
      "kanji": "麦",
      "uri": "/kanji/618-barley-%E9%BA%A6"
    },
    {
      "kanji": "姓",
      "uri": "/kanji/476-family-name-%E5%A7%93"
    },
    {
      "kanji": "筒",
      "uri": "/kanji/976-cylinder-pipe-%E7%AD%92"
    },
    {
      "kanji": "鼻",
      "uri": "/kanji/1525-nose-%E9%BC%BB"
    },
    {
      "kanji": "粒",
      "uri": "/kanji/392-grain-%E7%B2%92"
    },
    {
      "kanji": "詞",
      "uri": "/kanji/980-part-of-speech-%E8%A9%9E"
    },
    {
      "kanji": "胃",
      "uri": "/kanji/59-stomach-%E8%83%83"
    },
    {
      "kanji": "畳",
      "uri": "/kanji/1489-tatami-mat-%E7%95%B3"
    },
    {
      "kanji": "机",
      "uri": "/kanji/1284-desk-%E6%9C%BA"
    },
    {
      "kanji": "膚",
      "uri": "/kanji/1689-epidermis-%E8%86%9A"
    },
    {
      "kanji": "濯",
      "uri": "/kanji/643-rinse-%E6%BF%AF"
    },
    {
      "kanji": "塔",
      "uri": "/kanji/938-tower-%E5%A1%94"
    },
    {
      "kanji": "沸",
      "uri": "/kanji/895-boil-water-%E6%B2%B8"
    },
    {
      "kanji": "灰",
      "uri": "/kanji/735-ash-gray-%E7%81%B0"
    },
    {
      "kanji": "菓",
      "uri": "/kanji/356-sweetspastry-%E8%8F%93"
    },
    {
      "kanji": "帽",
      "uri": "/kanji/77-hat-%E5%B8%BD"
    },
    {
      "kanji": "枯",
      "uri": "/kanji/349-wither-%E6%9E%AF"
    },
    {
      "kanji": "涼",
      "uri": "/kanji/198-cool-place-%E6%B6%BC"
    },
    {
      "kanji": "舟",
      "uri": "/kanji/1448-boat-%E8%88%9F"
    },
    {
      "kanji": "貝",
      "uri": "/kanji/532-shellfish-money-%E8%B2%9D"
    },
    {
      "kanji": "符",
      "uri": "/kanji/993-ticket-%E7%AC%A6"
    },
    {
      "kanji": "憎",
      "uri": "/kanji/1607-detest-%E6%86%8E"
    },
    {
      "kanji": "皿",
      "uri": "/kanji/1433-plate-%E7%9A%BF"
    },
    {
      "kanji": "肯",
      "uri": "/kanji/273-consent-%E8%82%AF"
    },
    {
      "kanji": "燥",
      "uri": ""
    },
    {
      "kanji": "畜",
      "uri": "/kanji/207-raising-of-domestic-animals-%E7%95%9C"
    },
    {
      "kanji": "挟",
      "uri": "/kanji/593-pinch-%E6%8C%9F"
    },
    {
      "kanji": "曇",
      "uri": "/kanji/1386-get-cloudy-%E6%9B%87"
    },
    {
      "kanji": "滴",
      "uri": "/kanji/717-drip-%E6%BB%B4"
    },
    {
      "kanji": "伺",
      "uri": "/kanji/979-formal-visit-question-%E4%BC%BA"
    }
  ];
  
  const kanjiDataN1 = [
    {
      "kanji": "氏",
      "uri": "/kanji/1159-mr-speculum-radical-%E6%B0%8F"
    },
    {
      "kanji": "統",
      "uri": "/kanji/1252-tradition-%E7%B5%B1"
    },
    {
      "kanji": "保",
      "uri": "/kanji/362-guaranteemaintain-%E4%BF%9D"
    },
    {
      "kanji": "第",
      "uri": "/kanji/894-rank-or-number-in-series-%E7%AC%AC"
    },
    {
      "kanji": "結",
      "uri": "/kanji/250-bind-%E7%B5%90"
    },
    {
      "kanji": "派",
      "uri": "/kanji/759-factionbling-%E6%B4%BE"
    },
    {
      "kanji": "案",
      "uri": "/kanji/359-guideproposal-%E6%A1%88"
    },
    {
      "kanji": "策",
      "uri": "/kanji/343-take-measures-%E7%AD%96"
    },
    {
      "kanji": "基",
      "uri": "/kanji/1705-basis-%E5%9F%BA"
    },
    {
      "kanji": "価",
      "uri": "/kanji/580-value-%E4%BE%A1"
    },
    {
      "kanji": "提",
      "uri": "/kanji/283-submit-a-proposal-%E6%8F%90"
    },
    {
      "kanji": "挙",
      "uri": "/kanji/1447-raise-cite-mention-%E6%8C%99"
    },
    {
      "kanji": "応",
      "uri": "/kanji/1128-react-%E5%BF%9C"
    },
    {
      "kanji": "企",
      "uri": "/kanji/920-scheme-%E4%BC%81"
    },
    {
      "kanji": "検",
      "uri": "/kanji/416-investigate-%E6%A4%9C"
    },
    {
      "kanji": "藤",
      "uri": ""
    },
    {
      "kanji": "沢",
      "uri": "/kanji/292-swamp-bling-%E6%B2%A2"
    },
    {
      "kanji": "裁",
      "uri": "/kanji/770-trial-%E8%A3%81"
    },
    {
      "kanji": "証",
      "uri": "/kanji/284-proof-%E8%A8%BC"
    },
    {
      "kanji": "援",
      "uri": "/kanji/1110-assist-%E6%8F%B4"
    },
    {
      "kanji": "施",
      "uri": "/kanji/1603-put-into-practice-charity-%E6%96%BD"
    },
    {
      "kanji": "井",
      "uri": "/kanji/441-well-%E4%BA%95"
    },
    {
      "kanji": "護",
      "uri": "/kanji/269-defend-%E8%AD%B7"
    },
    {
      "kanji": "展",
      "uri": "/kanji/1541-exhibit-%E5%B1%95"
    },
    {
      "kanji": "態",
      "uri": "/kanji/145-looks-like-%E6%85%8B"
    },
    {
      "kanji": "鮮",
      "uri": "/kanji/870-fresh-%E9%AE%AE"
    },
    {
      "kanji": "視",
      "uri": "/kanji/1493-peer-at-%E8%A6%96"
    },
    {
      "kanji": "条",
      "uri": "/kanji/617-clause-%E6%9D%A1"
    },
    {
      "kanji": "幹",
      "uri": "/kanji/925-trunk-%E5%B9%B9"
    },
    {
      "kanji": "独",
      "uri": "/kanji/1459-solitary-%E7%8B%AC"
    },
    {
      "kanji": "宮",
      "uri": "/kanji/1612-palace-%E5%AE%AE"
    },
    {
      "kanji": "率",
      "uri": "/kanji/1648-ratio-%E7%8E%87"
    },
    {
      "kanji": "衛",
      "uri": "/kanji/1579-defense-%E8%A1%9B"
    },
    {
      "kanji": "張",
      "uri": "/kanji/906-stretch-%E5%BC%B5"
    },
    {
      "kanji": "監",
      "uri": "/kanji/1439-oversee-%E7%9B%A3"
    },
    {
      "kanji": "環",
      "uri": "/kanji/764-environment-%E7%92%B0"
    },
    {
      "kanji": "審",
      "uri": "/kanji/396-judge-%E5%AF%A9"
    },
    {
      "kanji": "義",
      "uri": "/kanji/877-righteousness-%E7%BE%A9"
    },
    {
      "kanji": "訴",
      "uri": "/kanji/320-accuse-%E8%A8%B4"
    },
    {
      "kanji": "株",
      "uri": "/kanji/478-share-stock-%E6%A0%AA"
    },
    {
      "kanji": "姿",
      "uri": "/kanji/957-someones-shape-body-form-%E5%A7%BF"
    },
    {
      "kanji": "閣",
      "uri": ""
    },
    {
      "kanji": "衆",
      "uri": "/kanji/1442-populace-%E8%A1%86"
    },
    {
      "kanji": "評",
      "uri": "/kanji/189-art-or-literary-criticism-%E8%A9%95"
    },
    {
      "kanji": "影",
      "uri": "/kanji/1115-shadow-%E5%BD%B1"
    },
    {
      "kanji": "松",
      "uri": "/kanji/348-pine-%E6%9D%BE"
    },
    {
      "kanji": "撃",
      "uri": "/kanji/1300-charge-%E6%92%83"
    },
    {
      "kanji": "佐",
      "uri": ""
    },
    {
      "kanji": "核",
      "uri": "/kanji/1697-nucleus-%E6%A0%B8"
    },
    {
      "kanji": "整",
      "uri": "/kanji/1340-arrange-%E6%95%B4"
    },
    {
      "kanji": "融",
      "uri": "/kanji/1742-fusion-%E8%9E%8D"
    },
    {
      "kanji": "製",
      "uri": "/kanji/806-mass-production-%E8%A3%BD"
    },
    {
      "kanji": "票",
      "uri": "/kanji/575-ballot-%E7%A5%A8"
    },
    {
      "kanji": "渉",
      "uri": "/kanji/275-interfere-%E6%B8%89"
    },
    {
      "kanji": "響",
      "uri": "/kanji/785-echo-%E9%9F%BF"
    },
    {
      "kanji": "推",
      "uri": "/kanji/295-infer-%E6%8E%A8"
    },
    {
      "kanji": "請",
      "uri": "/kanji/467-request-%E8%AB%8B"
    },
    {
      "kanji": "器",
      "uri": "/kanji/403-instrument-%E5%99%A8"
    },
    {
      "kanji": "士",
      "uri": "/kanji/245-samurai-radical-%E5%A3%AB"
    },
    {
      "kanji": "討",
      "uri": "/kanji/989-attackdiscuss-%E8%A8%8E"
    },
    {
      "kanji": "攻",
      "uri": "/kanji/713-attack-%E6%94%BB"
    },
    {
      "kanji": "崎",
      "uri": ""
    },
    {
      "kanji": "督",
      "uri": "/kanji/203-supervisor-%E7%9D%A3"
    },
    {
      "kanji": "授",
      "uri": "/kanji/606-instruct-%E6%8E%88"
    },
    {
      "kanji": "催",
      "uri": "/kanji/827-sponsor-%E5%82%AC"
    },
    {
      "kanji": "及",
      "uri": "/kanji/625-reach-amount-to-%E5%8F%8A"
    },
    {
      "kanji": "憲",
      "uri": "/kanji/465-constitution-%E6%86%B2"
    },
    {
      "kanji": "離",
      "uri": "/kanji/1042-divorce-physical-distance-between-things-%E9%9B%A2"
    },
    {
      "kanji": "激",
      "uri": "/kanji/711-intense-%E6%BF%80"
    },
    {
      "kanji": "摘",
      "uri": "/kanji/718-pluck-%E6%91%98"
    },
    {
      "kanji": "系",
      "uri": "/kanji/219-group-tribe-%E7%B3%BB"
    },
    {
      "kanji": "批",
      "uri": "/kanji/298-call-bullshit-on-%E6%89%B9"
    },
    {
      "kanji": "郎",
      "uri": ""
    },
    {
      "kanji": "健",
      "uri": "/kanji/1156-healthy-%E5%81%A5"
    },
    {
      "kanji": "盟",
      "uri": "/kanji/1436-oath-%E7%9B%9F"
    },
    {
      "kanji": "従",
      "uri": "/kanji/1238-obey-%E5%BE%93"
    },
    {
      "kanji": "修",
      "uri": "/kanji/1118-master-a-skill-%E4%BF%AE"
    },
    {
      "kanji": "隊",
      "uri": "/kanji/1228-troop-%E9%9A%8A"
    },
    {
      "kanji": "織",
      "uri": "/kanji/678-organization-weave-%E7%B9%94"
    },
    {
      "kanji": "拡",
      "uri": "/kanji/1140-to-expand-%E6%8B%A1"
    },
    {
      "kanji": "故",
      "uri": "/kanji/707-breakdown-accident-%E6%95%85"
    },
    {
      "kanji": "振",
      "uri": "/kanji/1176-brandish-pretend-%E6%8C%AF"
    },
    {
      "kanji": "弁",
      "uri": "/kanji/1528-dialect-%E5%BC%81"
    },
    {
      "kanji": "就",
      "uri": "/kanji/1693-get-a-job-you-bum-%E5%B0%B1"
    },
    {
      "kanji": "異",
      "uri": "/kanji/1556-to-differ-%E7%95%B0"
    },
    {
      "kanji": "献",
      "uri": ""
    },
    {
      "kanji": "厳",
      "uri": "/kanji/729-strict-%E5%8E%B3"
    },
    {
      "kanji": "維",
      "uri": "/kanji/265-upkeep-%E7%B6%AD"
    },
    {
      "kanji": "浜",
      "uri": "/kanji/557-beach-%E6%B5%9C"
    },
    {
      "kanji": "遺",
      "uri": "/kanji/555-bequeath-%E9%81%BA"
    },
    {
      "kanji": "塁",
      "uri": ""
    },
    {
      "kanji": "邦",
      "uri": ""
    },
    {
      "kanji": "素",
      "uri": "/kanji/464-element-%E7%B4%A0"
    },
    {
      "kanji": "遣",
      "uri": "/kanji/1617-apply-%E9%81%A3"
    },
    {
      "kanji": "抗",
      "uri": "/kanji/1283-oppose-%E6%8A%97"
    },
    {
      "kanji": "模",
      "uri": "/kanji/425-model-%E6%A8%A1"
    },
    {
      "kanji": "雄",
      "uri": "/kanji/1093-male-animal-or-hero-%E9%9B%84"
    },
    {
      "kanji": "益",
      "uri": "/kanji/1444-profit-%E7%9B%8A"
    },
    {
      "kanji": "緊",
      "uri": "/kanji/687-tense-%E7%B7%8A"
    },
    {
      "kanji": "標",
      "uri": "/kanji/576-sign-mark-%E6%A8%99"
    },
    {
      "kanji": "宣",
      "uri": "/kanji/130-announce-%E5%AE%A3"
    },
    {
      "kanji": "昭",
      "uri": "/kanji/167-shining-showa-era-%E6%98%AD"
    },
    {
      "kanji": "廃",
      "uri": "/kanji/1187-wane-%E5%BB%83"
    },
    {
      "kanji": "伊",
      "uri": ""
    },
    {
      "kanji": "江",
      "uri": ""
    },
    {
      "kanji": "僚",
      "uri": "/kanji/1366-coworker-%E5%83%9A"
    },
    {
      "kanji": "吉",
      "uri": "/kanji/248-good-omen-%E5%90%89"
    },
    {
      "kanji": "盛",
      "uri": "/kanji/1437-heaps-of-%E7%9B%9B"
    },
    {
      "kanji": "皇",
      "uri": "/kanji/448-emperor-%E7%9A%87"
    },
    {
      "kanji": "臨",
      "uri": "/kanji/690-to-confront-%E8%87%A8"
    },
    {
      "kanji": "踏",
      "uri": "/kanji/279-tread-on-%E8%B8%8F"
    },
    {
      "kanji": "壊",
      "uri": "/kanji/1681-break-%E5%A3%8A"
    },
    {
      "kanji": "債",
      "uri": ""
    },
    {
      "kanji": "興",
      "uri": "/kanji/1727-interest-%E8%88%88"
    },
    {
      "kanji": "源",
      "uri": "/kanji/738-hot-spring-origin-%E6%BA%90"
    },
    {
      "kanji": "儀",
      "uri": "/kanji/878-politeness-%E5%84%80"
    },
    {
      "kanji": "創",
      "uri": "/kanji/933-originate-creative-%E5%89%B5"
    },
    {
      "kanji": "障",
      "uri": "/kanji/787-impede-%E9%9A%9C"
    },
    {
      "kanji": "継",
      "uri": "/kanji/388-succeed-inherit-%E7%B6%99"
    },
    {
      "kanji": "筋",
      "uri": "/kanji/322-muscle-%E7%AD%8B"
    },
    {
      "kanji": "闘",
      "uri": "/kanji/999-struggle-%E9%97%98"
    },
    {
      "kanji": "葬",
      "uri": "/kanji/1526-mourn-%E8%91%AC"
    },
    {
      "kanji": "避",
      "uri": "/kanji/1361-avoid-dodge-%E9%81%BF"
    },
    {
      "kanji": "司",
      "uri": "/kanji/978-administer-%E5%8F%B8"
    },
    {
      "kanji": "康",
      "uri": "/kanji/1663-health-%E5%BA%B7"
    },
    {
      "kanji": "善",
      "uri": "/kanji/1632-morally-good-%E5%96%84"
    },
    {
      "kanji": "逮",
      "uri": "/kanji/1662-arrest-%E9%80%AE"
    },
    {
      "kanji": "迫",
      "uri": "/kanji/330-press-upon-%E8%BF%AB"
    },
    {
      "kanji": "惑",
      "uri": "/kanji/668-be-misguided-or-tempted-%E6%83%91"
    },
    {
      "kanji": "崩",
      "uri": "/kanji/828-collapse-%E5%B4%A9"
    },
    {
      "kanji": "紀",
      "uri": "/kanji/722-century-%E7%B4%80"
    },
    {
      "kanji": "聴",
      "uri": "/kanji/1680-listen-to-%E8%81%B4"
    },
    {
      "kanji": "脱",
      "uri": "/kanji/864-get-naked-%E8%84%B1"
    },
    {
      "kanji": "級",
      "uri": "/kanji/627-level-%E7%B4%9A"
    },
    {
      "kanji": "博",
      "uri": "/kanji/1017-museum-extensive-%E5%8D%9A"
    },
    {
      "kanji": "締",
      "uri": "/kanji/640-tighten-%E7%B7%A0"
    },
    {
      "kanji": "救",
      "uri": "/kanji/726-rescue-%E6%95%91"
    },
    {
      "kanji": "執",
      "uri": "/kanji/185-to-hella-do-%E5%9F%B7"
    },
    {
      "kanji": "房",
      "uri": "/kanji/509-wifecluster-%E6%88%BF"
    },
    {
      "kanji": "撤",
      "uri": "/kanji/1246-withdraw-%E6%92%A4"
    },
    {
      "kanji": "削",
      "uri": "/kanji/600-whittle-down-%E5%89%8A"
    },
    {
      "kanji": "密",
      "uri": "/kanji/829-hard-to-see-%E5%AF%86"
    },
    {
      "kanji": "措",
      "uri": ""
    },
    {
      "kanji": "志",
      "uri": "/kanji/247-intention-volition-%E5%BF%97"
    },
    {
      "kanji": "載",
      "uri": "/kanji/1067-appear-in-print-%E8%BC%89"
    },
    {
      "kanji": "陣",
      "uri": "/kanji/1062-base-%E9%99%A3"
    },
    {
      "kanji": "我",
      "uri": "/kanji/669-we-%E6%88%91"
    },
    {
      "kanji": "為",
      "uri": "/kanji/1740-deed-%E7%82%BA"
    },
    {
      "kanji": "抑",
      "uri": "/kanji/1477-suppress-%E6%8A%91"
    },
    {
      "kanji": "幕",
      "uri": "/kanji/429-curtain-%E5%B9%95"
    },
    {
      "kanji": "染",
      "uri": "/kanji/365-dye-%E6%9F%93"
    },
    {
      "kanji": "奈",
      "uri": ""
    },
    {
      "kanji": "傷",
      "uri": "/kanji/1207-wound-%E5%82%B7"
    },
    {
      "kanji": "択",
      "uri": "/kanji/294-select-%E6%8A%9E"
    },
    {
      "kanji": "秀",
      "uri": "/kanji/621-excel-%E7%A7%80"
    },
    {
      "kanji": "徴",
      "uri": "/kanji/1243-sign-indication-%E5%BE%B4"
    },
    {
      "kanji": "弾",
      "uri": "/kanji/899-bullet-play-guitar-bounce-%E5%BC%BE"
    },
    {
      "kanji": "償",
      "uri": "/kanji/1629-compensate-for-%E5%84%9F"
    },
    {
      "kanji": "功",
      "uri": "/kanji/648-success-%E5%8A%9F"
    },
    {
      "kanji": "拠",
      "uri": "/kanji/1288-evidence-which-is-the-basis-for-a-judgment-%E6%8B%A0"
    },
    {
      "kanji": "秘",
      "uri": "/kanji/370-secret-%E7%A7%98"
    },
    {
      "kanji": "拒",
      "uri": "/kanji/683-repel-%E6%8B%92"
    },
    {
      "kanji": "刑",
      "uri": "/kanji/1190-penalty-%E5%88%91"
    },
    {
      "kanji": "塚",
      "uri": ""
    },
    {
      "kanji": "致",
      "uri": "/kanji/1255-polite-do-%E8%87%B4"
    },
    {
      "kanji": "繰",
      "uri": "/kanji/363-spin-%E7%B9%B0"
    },
    {
      "kanji": "尾",
      "uri": "/kanji/513-tail-%E5%B0%BE"
    },
    {
      "kanji": "描",
      "uri": "/kanji/296-depict-%E6%8F%8F"
    },
    {
      "kanji": "鈴",
      "uri": "/kanji/947-tiny-electric-bell-or-buzzer-%E9%88%B4"
    },
    {
      "kanji": "盤",
      "uri": "/kanji/1452-tray-basis-%E7%9B%A4"
    },
    {
      "kanji": "項",
      "uri": "/kanji/852-itemparagraph-%E9%A0%85"
    },
    {
      "kanji": "喪",
      "uri": ""
    },
    {
      "kanji": "伴",
      "uri": "/kanji/190-accompany-%E4%BC%B4"
    },
    {
      "kanji": "養",
      "uri": "/kanji/876-cultivate-rear-%E9%A4%8A"
    },
    {
      "kanji": "懸",
      "uri": "/kanji/1307-suspend-gamble-%E6%87%B8"
    },
    {
      "kanji": "街",
      "uri": "/kanji/1272-shopping-district-%E8%A1%97"
    },
    {
      "kanji": "契",
      "uri": "/kanji/455-contract-%E5%A5%91"
    },
    {
      "kanji": "掲",
      "uri": ""
    },
    {
      "kanji": "躍",
      "uri": "/kanji/642-jump-%E8%BA%8D"
    },
    {
      "kanji": "棄",
      "uri": "/kanji/1664-discard-%E6%A3%84"
    },
    {
      "kanji": "邸",
      "uri": ""
    },
    {
      "kanji": "縮",
      "uri": "/kanji/818-contract-shrink-%E7%B8%AE"
    },
    {
      "kanji": "還",
      "uri": ""
    },
    {
      "kanji": "属",
      "uri": "/kanji/498-genusaffiliation-%E5%B1%9E"
    },
    {
      "kanji": "慮",
      "uri": "/kanji/1686-consideration-%E6%85%AE"
    },
    {
      "kanji": "枠",
      "uri": "/kanji/341-boundary-limit-%E6%9E%A0"
    },
    {
      "kanji": "恵",
      "uri": "/kanji/1021-do-a-favor-%E6%81%B5"
    },
    {
      "kanji": "露",
      "uri": "/kanji/1393-outdoors-public-%E9%9C%B2"
    },
    {
      "kanji": "沖",
      "uri": ""
    },
    {
      "kanji": "緩",
      "uri": "/kanji/1111-become-loose-abate-%E7%B7%A9"
    },
    {
      "kanji": "節",
      "uri": "/kanji/1473-season-joint-%E7%AF%80"
    },
    {
      "kanji": "需",
      "uri": "/kanji/1408-demand-%E9%9C%80"
    },
    {
      "kanji": "射",
      "uri": "/kanji/1596-shoot-%E5%B0%84"
    },
    {
      "kanji": "購",
      "uri": "/kanji/1568-subscribe-%E8%B3%BC"
    },
    {
      "kanji": "揮",
      "uri": "/kanji/1069-brandish-%E6%8F%AE"
    },
    {
      "kanji": "充",
      "uri": "/kanji/1250-fill-up-%E5%85%85"
    },
    {
      "kanji": "貢",
      "uri": ""
    },
    {
      "kanji": "鹿",
      "uri": ""
    },
    {
      "kanji": "却",
      "uri": "/kanji/1468-disregard-%E5%8D%B4"
    },
    {
      "kanji": "端",
      "uri": "/kanji/1410-the-edge-%E7%AB%AF"
    },
    {
      "kanji": "賃",
      "uri": "/kanji/541-rent-money-%E8%B3%83"
    },
    {
      "kanji": "獲",
      "uri": "/kanji/1461-prey-on-get-%E7%8D%B2"
    },
    {
      "kanji": "郡",
      "uri": ""
    },
    {
      "kanji": "併",
      "uri": ""
    },
    {
      "kanji": "徹",
      "uri": "/kanji/1245-do-thoroughly-%E5%BE%B9"
    },
    {
      "kanji": "貴",
      "uri": "/kanji/554-exalted-%E8%B2%B4"
    },
    {
      "kanji": "衝",
      "uri": "/kanji/1241-collision-%E8%A1%9D"
    },
    {
      "kanji": "焦",
      "uri": "/kanji/263-char-scorch-%E7%84%A6"
    },
    {
      "kanji": "奪",
      "uri": "/kanji/990-steal-by-force-%E5%A5%AA"
    },
    {
      "kanji": "災",
      "uri": "/kanji/1733-disaster-%E7%81%BD"
    },
    {
      "kanji": "浦",
      "uri": ""
    },
    {
      "kanji": "析",
      "uri": "/kanji/342-analyze-%E6%9E%90"
    },
    {
      "kanji": "譲",
      "uri": "/kanji/1542-concessions-%E8%AD%B2"
    },
    {
      "kanji": "称",
      "uri": "/kanji/479-symmetry-%E7%A7%B0"
    },
    {
      "kanji": "納",
      "uri": "/kanji/216-to-supply-%E7%B4%8D"
    },
    {
      "kanji": "樹",
      "uri": ""
    },
    {
      "kanji": "挑",
      "uri": "/kanji/1656-challenge-%E6%8C%91"
    },
    {
      "kanji": "誘",
      "uri": "/kanji/622-invite-entice-%E8%AA%98"
    },
    {
      "kanji": "紛",
      "uri": "/kanji/217-ambiguous-%E7%B4%9B"
    },
    {
      "kanji": "至",
      "uri": "/kanji/1253-until-%E8%87%B3"
    },
    {
      "kanji": "宗",
      "uri": "/kanji/201-religion-%E5%AE%97"
    },
    {
      "kanji": "促",
      "uri": "/kanji/278-peer-pressure-%E4%BF%83"
    },
    {
      "kanji": "慎",
      "uri": "/kanji/1305-refrain-be-prudent-%E6%85%8E"
    },
    {
      "kanji": "控",
      "uri": "/kanji/301-abstain-%E6%8E%A7"
    },
    {
      "kanji": "智",
      "uri": ""
    },
    {
      "kanji": "握",
      "uri": "/kanji/1262-grasp-%E6%8F%A1"
    },
    {
      "kanji": "宙",
      "uri": "/kanji/1376-space-%E5%AE%99"
    },
    {
      "kanji": "俊",
      "uri": ""
    },
    {
      "kanji": "銭",
      "uri": "/kanji/1676-coin-%E9%8A%AD"
    },
    {
      "kanji": "渋",
      "uri": "/kanji/1649-bitter-flavor-%E6%B8%8B"
    },
    {
      "kanji": "銃",
      "uri": "/kanji/1251-gun-%E9%8A%83"
    },
    {
      "kanji": "操",
      "uri": "/kanji/364-manipulate-chastity-%E6%93%8D"
    },
    {
      "kanji": "携",
      "uri": "/kanji/624-carry-in-hand-%E6%90%BA"
    },
    {
      "kanji": "診",
      "uri": "/kanji/1122-diagnose-%E8%A8%BA"
    },
    {
      "kanji": "託",
      "uri": ""
    },
    {
      "kanji": "撮",
      "uri": "/kanji/312-photo-shoot-%E6%92%AE"
    },
    {
      "kanji": "誕",
      "uri": "/kanji/1158-birthday-birth-%E8%AA%95"
    },
    {
      "kanji": "侵",
      "uri": "/kanji/630-perpetrate-%E4%BE%B5"
    },
    {
      "kanji": "括",
      "uri": ""
    },
    {
      "kanji": "謝",
      "uri": "/kanji/1597-apologize-%E8%AC%9D"
    },
    {
      "kanji": "駆",
      "uri": "/kanji/681-gallop-%E9%A7%86"
    },
    {
      "kanji": "透",
      "uri": "/kanji/623-transparent-%E9%80%8F"
    },
    {
      "kanji": "津",
      "uri": ""
    },
    {
      "kanji": "壁",
      "uri": "/kanji/1362-wall-%E5%A3%81"
    },
    {
      "kanji": "稲",
      "uri": ""
    },
    {
      "kanji": "仮",
      "uri": "/kanji/743-provisional-%E4%BB%AE"
    },
    {
      "kanji": "裂",
      "uri": "/kanji/1316-tear-up-%E8%A3%82"
    },
    {
      "kanji": "敏",
      "uri": "/kanji/705-agile-sensitive-%E6%95%8F"
    },
    {
      "kanji": "是",
      "uri": "/kanji/281-fer-shure-%E6%98%AF"
    },
    {
      "kanji": "排",
      "uri": "/kanji/1086-eliminate-%E6%8E%92"
    },
    {
      "kanji": "裕",
      "uri": "/kanji/1518-abundant-%E8%A3%95"
    },
    {
      "kanji": "堅",
      "uri": "/kanji/686-solid-steadfast-%E5%A0%85"
    },
    {
      "kanji": "訳",
      "uri": "/kanji/291-reason-translation-%E8%A8%B3"
    },
    {
      "kanji": "芝",
      "uri": "/kanji/1702-lawn-%E8%8A%9D"
    },
    {
      "kanji": "綱",
      "uri": ""
    },
    {
      "kanji": "典",
      "uri": "/kanji/1169-classic-%E5%85%B8"
    },
    {
      "kanji": "賀",
      "uri": ""
    },
    {
      "kanji": "扱",
      "uri": "/kanji/628-treatment-%E6%89%B1"
    },
    {
      "kanji": "顧",
      "uri": "/kanji/850-look-back-on-%E9%A1%A7"
    },
    {
      "kanji": "弘",
      "uri": ""
    },
    {
      "kanji": "看",
      "uri": "/kanji/308-observeguard-%E7%9C%8B"
    },
    {
      "kanji": "訟",
      "uri": "/kanji/138-lawsuit-%E8%A8%9F"
    },
    {
      "kanji": "戒",
      "uri": "/kanji/1530-admonish-commandment-%E6%88%92"
    },
    {
      "kanji": "祉",
      "uri": "/kanji/1497-welfare-%E7%A5%89"
    },
    {
      "kanji": "誉",
      "uri": "/kanji/1446-honor-%E8%AA%89"
    },
    {
      "kanji": "歓",
      "uri": ""
    },
    {
      "kanji": "奏",
      "uri": "/kanji/961-musical-performance-%E5%A5%8F"
    },
    {
      "kanji": "勧",
      "uri": "/kanji/1055-recommend-%E5%8B%A7"
    },
    {
      "kanji": "騒",
      "uri": "/kanji/496-make-noise-%E9%A8%92"
    },
    {
      "kanji": "閥",
      "uri": "/kanji/667-clique-%E9%96%A5"
    },
    {
      "kanji": "甲",
      "uri": "/kanji/1372-turtle-shell-%E7%94%B2"
    },
    {
      "kanji": "縄",
      "uri": "/kanji/1406-rope-%E7%B8%84"
    },
    {
      "kanji": "郷",
      "uri": "/kanji/784-ones-hometown-%E9%83%B7"
    },
    {
      "kanji": "揺",
      "uri": "/kanji/1028-sway-joggle-%E6%8F%BA"
    },
    {
      "kanji": "免",
      "uri": "/kanji/1211-exemption-license-%E5%85%8D"
    },
    {
      "kanji": "既",
      "uri": "/kanji/1713-already-%E6%97%A2"
    },
    {
      "kanji": "薦",
      "uri": ""
    },
    {
      "kanji": "隣",
      "uri": "/kanji/1583-neighbor-%E9%9A%A3"
    },
    {
      "kanji": "華",
      "uri": "/kanji/1073-flamboyant-%E8%8F%AF"
    },
    {
      "kanji": "範",
      "uri": "/kanji/1469-standard-the-best-way-to-do-%E7%AF%84"
    },
    {
      "kanji": "隠",
      "uri": "/kanji/793-hide-%E9%9A%A0"
    },
    {
      "kanji": "徳",
      "uri": "/kanji/1683-virtue-%E5%BE%B3"
    },
    {
      "kanji": "哲",
      "uri": "/kanji/318-philosophy-%E5%93%B2"
    },
    {
      "kanji": "杉",
      "uri": ""
    },
    {
      "kanji": "釈",
      "uri": ""
    },
    {
      "kanji": "己",
      "uri": "/kanji/719-myself-%E5%B7%B1"
    },
    {
      "kanji": "妥",
      "uri": "/kanji/605-compromise-%E5%A6%A5"
    },
    {
      "kanji": "威",
      "uri": "/kanji/752-terrible-majesty-%E5%A8%81"
    },
    {
      "kanji": "豪",
      "uri": "/kanji/1226-luxurious-%E8%B1%AA"
    },
    {
      "kanji": "熊",
      "uri": "/kanji/144-bear-%E7%86%8A"
    },
    {
      "kanji": "滞",
      "uri": "/kanji/826-delay-be-overdue-%E6%BB%9E"
    },
    {
      "kanji": "微",
      "uri": "/kanji/1242-teeny-%E5%BE%AE"
    },
    {
      "kanji": "隆",
      "uri": ""
    },
    {
      "kanji": "症",
      "uri": "/kanji/1352-symptom-%E7%97%87"
    },
    {
      "kanji": "暫",
      "uri": ""
    },
    {
      "kanji": "忠",
      "uri": "/kanji/490-loyalty-%E5%BF%A0"
    },
    {
      "kanji": "倉",
      "uri": "/kanji/932-storage-%E5%80%89"
    },
    {
      "kanji": "彦",
      "uri": ""
    },
    {
      "kanji": "肝",
      "uri": "/kanji/225-liver-%E8%82%9D"
    },
    {
      "kanji": "喚",
      "uri": "/kanji/695-exclaim-%E5%96%9A"
    },
    {
      "kanji": "沿",
      "uri": "/kanji/135-run-parallel-to-%E6%B2%BF"
    },
    {
      "kanji": "妙",
      "uri": "/kanji/195-odd-%E5%A6%99"
    },
    {
      "kanji": "唱",
      "uri": "/kanji/26-chant-%E5%94%B1"
    },
    {
      "kanji": "阿",
      "uri": ""
    },
    {
      "kanji": "索",
      "uri": "/kanji/215-look-up-%E7%B4%A2"
    },
    {
      "kanji": "誠",
      "uri": "/kanji/746-sincerity-%E8%AA%A0"
    },
    {
      "kanji": "襲",
      "uri": "/kanji/1730-onslaught-%E8%A5%B2"
    },
    {
      "kanji": "懇",
      "uri": ""
    },
    {
      "kanji": "俳",
      "uri": "/kanji/1085-actor-%E4%BF%B3"
    },
    {
      "kanji": "柄",
      "uri": "/kanji/1345-pattern-%E6%9F%84"
    },
    {
      "kanji": "驚",
      "uri": "/kanji/1421-astonish-%E9%A9%9A"
    },
    {
      "kanji": "麻",
      "uri": "/kanji/1135-mah-jongg-ganja-%E9%BA%BB"
    },
    {
      "kanji": "李",
      "uri": ""
    },
    {
      "kanji": "浩",
      "uri": ""
    },
    {
      "kanji": "剤",
      "uri": "/kanji/170-type-of-medicine-%E5%89%A4"
    },
    {
      "kanji": "瀬",
      "uri": ""
    },
    {
      "kanji": "趣",
      "uri": "/kanji/313-hobby-%E8%B6%A3"
    },
    {
      "kanji": "陥",
      "uri": "/kanji/790-entrapped-%E9%99%A5"
    },
    {
      "kanji": "斎",
      "uri": ""
    },
    {
      "kanji": "貫",
      "uri": "/kanji/549-pierce-%E8%B2%AB"
    },
    {
      "kanji": "仙",
      "uri": ""
    },
    {
      "kanji": "慰",
      "uri": "/kanji/996-console-%E6%85%B0"
    },
    {
      "kanji": "序",
      "uri": "/kanji/1330-first-part-preface-%E5%BA%8F"
    },
    {
      "kanji": "旬",
      "uri": "/kanji/1424-in-season-time-of-month-%E6%97%AC"
    },
    {
      "kanji": "兼",
      "uri": "/kanji/1671-double-duty-%E5%85%BC"
    },
    {
      "kanji": "聖",
      "uri": "/kanji/450-holy-%E8%81%96"
    },
    {
      "kanji": "旨",
      "uri": "/kanji/24-the-gist-%E6%97%A8"
    },
    {
      "kanji": "即",
      "uri": "/kanji/1472-immediately-%E5%8D%B3"
    },
    {
      "kanji": "柳",
      "uri": ""
    },
    {
      "kanji": "舎",
      "uri": "/kanji/926-stable-%E8%88%8E"
    },
    {
      "kanji": "偽",
      "uri": "/kanji/1741-fake-%E5%81%BD"
    },
    {
      "kanji": "較",
      "uri": "/kanji/1065-evaluate-%E8%BC%83"
    },
    {
      "kanji": "覇",
      "uri": ""
    },
    {
      "kanji": "詳",
      "uri": "/kanji/871-expert-%E8%A9%B3"
    },
    {
      "kanji": "抵",
      "uri": "/kanji/1164-resist-%E6%8A%B5"
    },
    {
      "kanji": "脅",
      "uri": "/kanji/178-threaten-%E8%84%85"
    },
    {
      "kanji": "茂",
      "uri": ""
    },
    {
      "kanji": "犠",
      "uri": "/kanji/1198-sacrifice-%E7%8A%A0"
    },
    {
      "kanji": "旗",
      "uri": "/kanji/1704-flag-%E6%97%97"
    },
    {
      "kanji": "距",
      "uri": "/kanji/684-distance-%E8%B7%9D"
    },
    {
      "kanji": "雅",
      "uri": "/kanji/1714-elegant-%E9%9B%85"
    },
    {
      "kanji": "飾",
      "uri": "/kanji/923-decorate-%E9%A3%BE"
    },
    {
      "kanji": "網",
      "uri": ""
    },
    {
      "kanji": "竜",
      "uri": "/kanji/1401-dragon-%E7%AB%9C"
    },
    {
      "kanji": "詩",
      "uri": "/kanji/1001-poem-%E8%A9%A9"
    },
    {
      "kanji": "繁",
      "uri": "/kanji/712-multiple-many-%E7%B9%81"
    },
    {
      "kanji": "翼",
      "uri": "/kanji/1557-political-wing-%E7%BF%BC"
    },
    {
      "kanji": "潟",
      "uri": ""
    },
    {
      "kanji": "敵",
      "uri": "/kanji/715-enemy-%E6%95%B5"
    },
    {
      "kanji": "魅",
      "uri": "/kanji/1149-enchant-%E9%AD%85"
    },
    {
      "kanji": "嫌",
      "uri": "/kanji/1672-eww-%E5%AB%8C"
    },
    {
      "kanji": "斉",
      "uri": "/kanji/93-unison-%E6%96%89"
    },
    {
      "kanji": "敷",
      "uri": "/kanji/1022-lay-out-site-%E6%95%B7"
    },
    {
      "kanji": "擁",
      "uri": ""
    },
    {
      "kanji": "圏",
      "uri": "/kanji/889-range-area-of-influence-%E5%9C%8F"
    },
    {
      "kanji": "酸",
      "uri": "/kanji/619-sour-%E9%85%B8"
    },
    {
      "kanji": "罰",
      "uri": "/kanji/171-punishment-%E7%BD%B0"
    },
    {
      "kanji": "滅",
      "uri": "/kanji/751-annihilate-%E6%BB%85"
    },
    {
      "kanji": "礎",
      "uri": "/kanji/822-foundation-%E7%A4%8E"
    },
    {
      "kanji": "腐",
      "uri": "/kanji/1127-rot-%E8%85%90"
    },
    {
      "kanji": "脚",
      "uri": ""
    },
    {
      "kanji": "潮",
      "uri": ""
    },
    {
      "kanji": "梅",
      "uri": "/kanji/485-plum-%E6%A2%85"
    },
    {
      "kanji": "尽",
      "uri": "/kanji/953-exhaust-use-up-%E5%B0%BD"
    },
    {
      "kanji": "僕",
      "uri": "/kanji/1398-me-for-dudes-%E5%83%95"
    },
    {
      "kanji": "桜",
      "uri": "/kanji/597-sakura-%E6%A1%9C"
    },
    {
      "kanji": "滑",
      "uri": "/kanji/1646-slippery-%E6%BB%91"
    },
    {
      "kanji": "孤",
      "uri": "/kanji/1738-isolation-%E5%AD%A4"
    },
    {
      "kanji": "炎",
      "uri": "/kanji/48-flame-%E7%82%8E"
    },
    {
      "kanji": "賠",
      "uri": ""
    },
    {
      "kanji": "句",
      "uri": "/kanji/1418-verse-of-a-poem-%E5%8F%A5"
    },
    {
      "kanji": "鋼",
      "uri": ""
    },
    {
      "kanji": "頑",
      "uri": "/kanji/844-stubborn-%E9%A0%91"
    },
    {
      "kanji": "鎖",
      "uri": "/kanji/914-shutchain-%E9%8E%96"
    },
    {
      "kanji": "彩",
      "uri": "/kanji/1114-hue-%E5%BD%A9"
    },
    {
      "kanji": "摩",
      "uri": "/kanji/1136-friction-%E6%91%A9"
    },
    {
      "kanji": "励",
      "uri": "/kanji/730-diligence-%E5%8A%B1"
    },
    {
      "kanji": "縦",
      "uri": "/kanji/1239-vertical-%E7%B8%A6"
    },
    {
      "kanji": "輝",
      "uri": "/kanji/1072-dazzle-%E8%BC%9D"
    },
    {
      "kanji": "蓄",
      "uri": "/kanji/208-store-or-put-aside-%E8%93%84"
    },
    {
      "kanji": "軸",
      "uri": ""
    },
    {
      "kanji": "巡",
      "uri": "/kanji/1732-patrol-%E5%B7%A1"
    },
    {
      "kanji": "稼",
      "uri": "/kanji/1225-bring-home-the-loot-%E7%A8%BC"
    },
    {
      "kanji": "瞬",
      "uri": "/kanji/1581-twinkle-tiny-bit-of-time-%E7%9E%AC"
    },
    {
      "kanji": "砲",
      "uri": "/kanji/1415-cannon-%E7%A0%B2"
    },
    {
      "kanji": "噴",
      "uri": "/kanji/535-spew-%E5%99%B4"
    },
    {
      "kanji": "誇",
      "uri": "/kanji/655-be-proud-of-%E8%AA%87"
    },
    {
      "kanji": "祥",
      "uri": ""
    },
    {
      "kanji": "牲",
      "uri": "/kanji/1197-sacrificial-victim-%E7%89%B2"
    },
    {
      "kanji": "秩",
      "uri": ""
    },
    {
      "kanji": "帝",
      "uri": "/kanji/639-foreign-emperor-%E5%B8%9D"
    },
    {
      "kanji": "宏",
      "uri": ""
    },
    {
      "kanji": "唆",
      "uri": ""
    },
    {
      "kanji": "阻",
      "uri": "/kanji/1486-hamper-%E9%98%BB"
    },
    {
      "kanji": "泰",
      "uri": ""
    },
    {
      "kanji": "賄",
      "uri": "/kanji/1102-bribe-provide-capital-to-%E8%B3%84"
    },
    {
      "kanji": "撲",
      "uri": "/kanji/1399-eradicate-%E6%92%B2"
    },
    {
      "kanji": "堀",
      "uri": ""
    },
    {
      "kanji": "菊",
      "uri": ""
    },
    {
      "kanji": "絞",
      "uri": "/kanji/1014-wring-out-strangle-%E7%B5%9E"
    },
    {
      "kanji": "縁",
      "uri": "/kanji/1222-rim-omen-%E7%B8%81"
    },
    {
      "kanji": "唯",
      "uri": "/kanji/266-sole-or-only-%E5%94%AF"
    },
    {
      "kanji": "膨",
      "uri": "/kanji/840-bulge-%E8%86%A8"
    },
    {
      "kanji": "矢",
      "uri": "/kanji/1043-arrow-%E7%9F%A2"
    },
    {
      "kanji": "耐",
      "uri": "/kanji/1409-withstand-%E8%80%90"
    },
    {
      "kanji": "塾",
      "uri": "/kanji/244-cram-school-%E5%A1%BE"
    },
    {
      "kanji": "漏",
      "uri": "/kanji/1390-leak-%E6%BC%8F"
    },
    {
      "kanji": "慶",
      "uri": ""
    },
    {
      "kanji": "猛",
      "uri": "/kanji/1454-fierce-%E7%8C%9B"
    },
    {
      "kanji": "芳",
      "uri": ""
    },
    {
      "kanji": "懲",
      "uri": ""
    },
    {
      "kanji": "剣",
      "uri": "/kanji/418-saber-%E5%89%A3"
    },
    {
      "kanji": "彰",
      "uri": ""
    },
    {
      "kanji": "棋",
      "uri": ""
    },
    {
      "kanji": "丁",
      "uri": "/kanji/51-nail-%E4%B8%81"
    },
    {
      "kanji": "恒",
      "uri": ""
    },
    {
      "kanji": "揚",
      "uri": "/kanji/1205-hoist-deep-fat-fry-%E6%8F%9A"
    },
    {
      "kanji": "冒",
      "uri": "/kanji/79-dare-%E5%86%92"
    },
    {
      "kanji": "之",
      "uri": "/kanji/1700-this-%E4%B9%8B"
    },
    {
      "kanji": "倫",
      "uri": "/kanji/973-principles-%E5%80%AB"
    },
    {
      "kanji": "陳",
      "uri": ""
    },
    {
      "kanji": "憶",
      "uri": "/kanji/159-recollect-%E6%86%B6"
    },
    {
      "kanji": "潜",
      "uri": "/kanji/591-lurk-%E6%BD%9C"
    },
    {
      "kanji": "梨",
      "uri": ""
    },
    {
      "kanji": "仁",
      "uri": ""
    },
    {
      "kanji": "克",
      "uri": "/kanji/527-overcome-%E5%85%8B"
    },
    {
      "kanji": "岳",
      "uri": "/kanji/833-mount-%E5%B2%B3"
    },
    {
      "kanji": "概",
      "uri": "/kanji/1715-general-concept-%E6%A6%82"
    },
    {
      "kanji": "拘",
      "uri": "/kanji/1423-put-in-custody-%E6%8B%98"
    },
    {
      "kanji": "墓",
      "uri": "/kanji/426-grave-%E5%A2%93"
    },
    {
      "kanji": "黙",
      "uri": "/kanji/410-shut-up-%E9%BB%99"
    },
    {
      "kanji": "須",
      "uri": ""
    },
    {
      "kanji": "偏",
      "uri": "/kanji/970-be-inclined-%E5%81%8F"
    },
    {
      "kanji": "雰",
      "uri": "/kanji/1392-atmosphere-%E9%9B%B0"
    },
    {
      "kanji": "遇",
      "uri": ""
    },
    {
      "kanji": "諮",
      "uri": ""
    },
    {
      "kanji": "狭",
      "uri": "/kanji/1462-narrow-%E7%8B%AD"
    },
    {
      "kanji": "卓",
      "uri": "/kanji/124-dinner-table-%E5%8D%93"
    },
    {
      "kanji": "亀",
      "uri": "/kanji/1405-turtle-%E4%BA%80"
    },
    {
      "kanji": "糧",
      "uri": ""
    },
    {
      "kanji": "簿",
      "uri": ""
    },
    {
      "kanji": "炉",
      "uri": ""
    },
    {
      "kanji": "牧",
      "uri": ""
    },
    {
      "kanji": "殊",
      "uri": ""
    },
    {
      "kanji": "殖",
      "uri": "/kanji/1313-agricultural-breeding-reproduction-%E6%AE%96"
    },
    {
      "kanji": "艦",
      "uri": ""
    },
    {
      "kanji": "輩",
      "uri": "/kanji/1082-older-or-younger-colleague-%E8%BC%A9"
    },
    {
      "kanji": "穴",
      "uri": "/kanji/133-hole-%E7%A9%B4"
    },
    {
      "kanji": "奇",
      "uri": "/kanji/399-strange-%E5%A5%87"
    },
    {
      "kanji": "慢",
      "uri": "/kanji/110-neglect-egotistic-%E6%85%A2"
    },
    {
      "kanji": "鶴",
      "uri": ""
    },
    {
      "kanji": "謀",
      "uri": "/kanji/518-plot-%E8%AC%80"
    },
    {
      "kanji": "暖",
      "uri": "/kanji/1109-warm-place-%E6%9A%96"
    },
    {
      "kanji": "昌",
      "uri": ""
    },
    {
      "kanji": "拍",
      "uri": "/kanji/306-clap-%E6%8B%8D"
    },
    {
      "kanji": "朗",
      "uri": ""
    },
    {
      "kanji": "寛",
      "uri": "/kanji/521-leniency-%E5%AF%9B"
    },
    {
      "kanji": "覆",
      "uri": ""
    },
    {
      "kanji": "胞",
      "uri": "/kanji/1413-cell-%E8%83%9E"
    },
    {
      "kanji": "泣",
      "uri": "/kanji/152-cry-%E6%B3%A3"
    },
    {
      "kanji": "隔",
      "uri": "/kanji/1743-segregate-%E9%9A%94"
    },
    {
      "kanji": "浄",
      "uri": ""
    },
    {
      "kanji": "没",
      "uri": "/kanji/1296-downfall-%E6%B2%A1"
    },
    {
      "kanji": "暇",
      "uri": "/kanji/1728-free-time-%E6%9A%87"
    },
    {
      "kanji": "肺",
      "uri": "/kanji/74-lung-%E8%82%BA"
    },
    {
      "kanji": "貞",
      "uri": "/kanji/542-chastity-%E8%B2%9E"
    },
    {
      "kanji": "靖",
      "uri": ""
    },
    {
      "kanji": "鑑",
      "uri": "/kanji/1440-expert-opinion-%E9%91%91"
    },
    {
      "kanji": "飼",
      "uri": "/kanji/981-keep-a-pet-%E9%A3%BC"
    },
    {
      "kanji": "陰",
      "uri": "/kanji/1249-shady-%E9%99%B0"
    },
    {
      "kanji": "銘",
      "uri": ""
    },
    {
      "kanji": "随",
      "uri": ""
    },
    {
      "kanji": "烈",
      "uri": "/kanji/1317-violently-intense-%E7%83%88"
    },
    {
      "kanji": "尋",
      "uri": "/kanji/997-ask-%E5%B0%8B"
    },
    {
      "kanji": "稿",
      "uri": ""
    },
    {
      "kanji": "丹",
      "uri": ""
    },
    {
      "kanji": "啓",
      "uri": ""
    },
    {
      "kanji": "也",
      "uri": ""
    },
    {
      "kanji": "丘",
      "uri": "/kanji/317-hill-%E4%B8%98"
    },
    {
      "kanji": "棟",
      "uri": ""
    },
    {
      "kanji": "壌",
      "uri": ""
    },
    {
      "kanji": "漫",
      "uri": "/kanji/111-manga-%E6%BC%AB"
    },
    {
      "kanji": "玄",
      "uri": "/kanji/206-deep-profound-%E7%8E%84"
    },
    {
      "kanji": "粘",
      "uri": "/kanji/389-be-sticky-%E7%B2%98"
    },
    {
      "kanji": "悟",
      "uri": "/kanji/1575-enlightenment-%E6%82%9F"
    },
    {
      "kanji": "舗",
      "uri": "/kanji/1562-chain-store-%E8%88%97"
    },
    {
      "kanji": "妊",
      "uri": "/kanji/447-pregnant-%E5%A6%8A"
    },
    {
      "kanji": "熟",
      "uri": "/kanji/184-get-good-at-%E7%86%9F"
    },
    {
      "kanji": "旭",
      "uri": ""
    },
    {
      "kanji": "恩",
      "uri": "/kanji/433-kindness-%E6%81%A9"
    },
    {
      "kanji": "騰",
      "uri": ""
    },
    {
      "kanji": "往",
      "uri": "/kanji/1235-depart-%E5%BE%80"
    },
    {
      "kanji": "豆",
      "uri": "/kanji/837-bean-%E8%B1%86"
    },
    {
      "kanji": "遂",
      "uri": "/kanji/1227-attain-%E9%81%82"
    },
    {
      "kanji": "狂",
      "uri": "/kanji/1458-go-nuts-%E7%8B%82"
    },
    {
      "kanji": "岐",
      "uri": ""
    },
    {
      "kanji": "陛",
      "uri": ""
    },
    {
      "kanji": "緯",
      "uri": ""
    },
    {
      "kanji": "培",
      "uri": ""
    },
    {
      "kanji": "衰",
      "uri": "/kanji/774-declinewane-%E8%A1%B0"
    },
    {
      "kanji": "艇",
      "uri": ""
    },
    {
      "kanji": "屈",
      "uri": "/kanji/1025-yield-get-out-of-the-way-%E5%B1%88"
    },
    {
      "kanji": "径",
      "uri": "/kanji/1233-diameter-%E5%BE%84"
    },
    {
      "kanji": "淡",
      "uri": "/kanji/49-faint-%E6%B7%A1"
    },
    {
      "kanji": "抽",
      "uri": "/kanji/1375-abstract-%E6%8A%BD"
    },
    {
      "kanji": "披",
      "uri": ""
    },
    {
      "kanji": "廷",
      "uri": ""
    },
    {
      "kanji": "錦",
      "uri": ""
    },
    {
      "kanji": "准",
      "uri": ""
    },
    {
      "kanji": "暑",
      "uri": "/kanji/260-hot-place-%E6%9A%91"
    },
    {
      "kanji": "磯",
      "uri": ""
    },
    {
      "kanji": "奨",
      "uri": ""
    },
    {
      "kanji": "浸",
      "uri": "/kanji/631-immerse-%E6%B5%B8"
    },
    {
      "kanji": "剰",
      "uri": "/kanji/1076-excessive-%E5%89%B0"
    },
    {
      "kanji": "胆",
      "uri": "/kanji/45-gall-bladder-daring-%E8%83%86"
    },
    {
      "kanji": "繊",
      "uri": ""
    },
    {
      "kanji": "駒",
      "uri": ""
    },
    {
      "kanji": "虚",
      "uri": "/kanji/1687-empty-%E8%99%9A"
    },
    {
      "kanji": "霊",
      "uri": "/kanji/1395-ghost-%E9%9C%8A"
    },
    {
      "kanji": "帳",
      "uri": "/kanji/907-notebook-%E5%B8%B3"
    },
    {
      "kanji": "悔",
      "uri": "/kanji/487-regret-%E6%82%94"
    },
    {
      "kanji": "諭",
      "uri": "/kanji/1357-chide-guide-%E8%AB%AD"
    },
    {
      "kanji": "惨",
      "uri": "/kanji/1119-wretched-%E6%83%A8"
    },
    {
      "kanji": "虐",
      "uri": "/kanji/1688-oppress-%E8%99%90"
    },
    {
      "kanji": "翻",
      "uri": ""
    },
    {
      "kanji": "墜",
      "uri": ""
    },
    {
      "kanji": "沼",
      "uri": ""
    },
    {
      "kanji": "据",
      "uri": ""
    },
    {
      "kanji": "肥",
      "uri": "/kanji/1218-obese-manure-%E8%82%A5"
    },
    {
      "kanji": "徐",
      "uri": "/kanji/1230-slowly-%E5%BE%90"
    },
    {
      "kanji": "糖",
      "uri": "/kanji/1138-sugar-%E7%B3%96"
    },
    {
      "kanji": "搭",
      "uri": "/kanji/940-board-%E6%90%AD"
    },
    {
      "kanji": "盾",
      "uri": "/kanji/1303-shield-%E7%9B%BE"
    },
    {
      "kanji": "脈",
      "uri": "/kanji/760-vein-%E8%84%88"
    },
    {
      "kanji": "滝",
      "uri": "/kanji/1402-waterfall-%E6%BB%9D"
    },
    {
      "kanji": "軌",
      "uri": ""
    },
    {
      "kanji": "俵",
      "uri": ""
    },
    {
      "kanji": "妨",
      "uri": "/kanji/87-prevent-%E5%A6%A8"
    },
    {
      "kanji": "擦",
      "uri": "/kanji/1183-chafe-%E6%93%A6"
    },
    {
      "kanji": "鯨",
      "uri": ""
    },
    {
      "kanji": "荘",
      "uri": ""
    },
    {
      "kanji": "諾",
      "uri": ""
    },
    {
      "kanji": "雷",
      "uri": "/kanji/1388-lightning-%E9%9B%B7"
    },
    {
      "kanji": "漂",
      "uri": "/kanji/577-drift-%E6%BC%82"
    },
    {
      "kanji": "懐",
      "uri": "/kanji/1682-nostalgia-%E6%87%90"
    },
    {
      "kanji": "勘",
      "uri": "/kanji/1709-perception-%E5%8B%98"
    },
    {
      "kanji": "栽",
      "uri": "/kanji/673-cultivate-%E6%A0%BD"
    },
    {
      "kanji": "拐",
      "uri": "/kanji/303-kidnap-%E6%8B%90"
    },
    {
      "kanji": "駄",
      "uri": "/kanji/414-bad-quality-%E9%A7%84"
    },
    {
      "kanji": "添",
      "uri": "/kanji/881-append-%E6%B7%BB"
    },
    {
      "kanji": "冠",
      "uri": ""
    },
    {
      "kanji": "斜",
      "uri": "/kanji/1588-diagonal-%E6%96%9C"
    },
    {
      "kanji": "鏡",
      "uri": "/kanji/913-mirror-%E9%8F%A1"
    },
    {
      "kanji": "聡",
      "uri": ""
    },
    {
      "kanji": "浪",
      "uri": "/kanji/778-wavelike-%E6%B5%AA"
    },
    {
      "kanji": "亜",
      "uri": "/kanji/112-sub-%E4%BA%9C"
    },
    {
      "kanji": "覧",
      "uri": "/kanji/689-view-%E8%A6%A7"
    },
    {
      "kanji": "詐",
      "uri": ""
    },
    {
      "kanji": "壇",
      "uri": ""
    },
    {
      "kanji": "勲",
      "uri": ""
    },
    {
      "kanji": "魔",
      "uri": "/kanji/1148-devil-%E9%AD%94"
    },
    {
      "kanji": "酬",
      "uri": ""
    },
    {
      "kanji": "紫",
      "uri": "/kanji/276-purple-%E7%B4%AB"
    },
    {
      "kanji": "曙",
      "uri": ""
    },
    {
      "kanji": "紋",
      "uri": ""
    },
    {
      "kanji": "卸",
      "uri": ""
    },
    {
      "kanji": "奮",
      "uri": "/kanji/402-get-worked-up-%E5%A5%AE"
    },
    {
      "kanji": "欄",
      "uri": ""
    },
    {
      "kanji": "逸",
      "uri": "/kanji/1212-more-or-less-than-normal-%E9%80%B8"
    },
    {
      "kanji": "涯",
      "uri": "/kanji/1274-lifetime-%E6%B6%AF"
    },
    {
      "kanji": "拓",
      "uri": ""
    },
    {
      "kanji": "眼",
      "uri": "/kanji/779-eyeball-%E7%9C%BC"
    },
    {
      "kanji": "獄",
      "uri": "/kanji/1460-hell-%E7%8D%84"
    },
    {
      "kanji": "尚",
      "uri": "/kanji/1627-all-the-more-%E5%B0%9A"
    },
    {
      "kanji": "彫",
      "uri": "/kanji/1638-carve-%E5%BD%AB"
    },
    {
      "kanji": "穏",
      "uri": "/kanji/629-tranquil-%E7%A9%8F"
    },
    {
      "kanji": "顕",
      "uri": ""
    },
    {
      "kanji": "巧",
      "uri": "/kanji/650-adroit-%E5%B7%A7"
    },
    {
      "kanji": "矛",
      "uri": "/kanji/1333-halberd-%E7%9F%9B"
    },
    {
      "kanji": "垣",
      "uri": ""
    },
    {
      "kanji": "欺",
      "uri": "/kanji/1707-dupe-%E6%AC%BA"
    },
    {
      "kanji": "釣",
      "uri": "/kanji/1431-fishin-%E9%87%A3"
    },
    {
      "kanji": "萩",
      "uri": ""
    },
    {
      "kanji": "粛",
      "uri": ""
    },
    {
      "kanji": "栗",
      "uri": ""
    },
    {
      "kanji": "愚",
      "uri": "/kanji/1382-dum-diddy-dum-dum-%E6%84%9A"
    },
    {
      "kanji": "嘉",
      "uri": ""
    },
    {
      "kanji": "遭",
      "uri": "/kanji/1170-chance-meeting-usually-with-something-bad-%E9%81%AD"
    },
    {
      "kanji": "架",
      "uri": ""
    },
    {
      "kanji": "鬼",
      "uri": "/kanji/1147-demon-%E9%AC%BC"
    },
    {
      "kanji": "庶",
      "uri": "/kanji/1142-populist-%E5%BA%B6"
    },
    {
      "kanji": "稚",
      "uri": "/kanji/368-childish-%E7%A8%9A"
    },
    {
      "kanji": "滋",
      "uri": ""
    },
    {
      "kanji": "幻",
      "uri": "/kanji/982-illusion-%E5%B9%BB"
    },
    {
      "kanji": "煮",
      "uri": "/kanji/261-simmerstew-%E7%85%AE"
    },
    {
      "kanji": "姫",
      "uri": "/kanji/691-princess-%E5%A7%AB"
    },
    {
      "kanji": "誓",
      "uri": "/kanji/319-vow-%E8%AA%93"
    },
    {
      "kanji": "把",
      "uri": ""
    },
    {
      "kanji": "践",
      "uri": ""
    },
    {
      "kanji": "呈",
      "uri": ""
    },
    {
      "kanji": "疎",
      "uri": "/kanji/1337-shun-%E7%96%8E"
    },
    {
      "kanji": "仰",
      "uri": "/kanji/1479-pompous-look-up-to-%E4%BB%B0"
    },
    {
      "kanji": "剛",
      "uri": ""
    },
    {
      "kanji": "疾",
      "uri": ""
    },
    {
      "kanji": "征",
      "uri": ""
    },
    {
      "kanji": "砕",
      "uri": "/kanji/821-pulverize-%E7%A0%95"
    },
    {
      "kanji": "謡",
      "uri": ""
    },
    {
      "kanji": "嫁",
      "uri": "/kanji/1224-bride-%E5%AB%81"
    },
    {
      "kanji": "謙",
      "uri": "/kanji/1674-modesty-%E8%AC%99"
    },
    {
      "kanji": "后",
      "uri": ""
    },
    {
      "kanji": "嘆",
      "uri": "/kanji/424-lament-sigh-%E5%98%86"
    },
    {
      "kanji": "菌",
      "uri": "/kanji/434-bacteria-%E8%8F%8C"
    },
    {
      "kanji": "鎌",
      "uri": ""
    },
    {
      "kanji": "巣",
      "uri": "/kanji/595-habitat-%E5%B7%A3"
    },
    {
      "kanji": "頻",
      "uri": ""
    },
    {
      "kanji": "琴",
      "uri": ""
    },
    {
      "kanji": "班",
      "uri": ""
    },
    {
      "kanji": "棚",
      "uri": "/kanji/347-shelf-%E6%A3%9A"
    },
    {
      "kanji": "潔",
      "uri": "/kanji/457-honorable-%E6%BD%94"
    },
    {
      "kanji": "酷",
      "uri": "/kanji/809-horrendous-%E9%85%B7"
    },
    {
      "kanji": "宰",
      "uri": "/kanji/151-manager-%E5%AE%B0"
    },
    {
      "kanji": "廊",
      "uri": "/kanji/1124-corridor-%E5%BB%8A"
    },
    {
      "kanji": "寂",
      "uri": "/kanji/202-lonely-%E5%AF%82"
    },
    {
      "kanji": "辰",
      "uri": ""
    },
    {
      "kanji": "霞",
      "uri": ""
    },
    {
      "kanji": "伏",
      "uri": "/kanji/409-lay-face-down-%E4%BC%8F"
    },
    {
      "kanji": "碁",
      "uri": ""
    },
    {
      "kanji": "俗",
      "uri": "/kanji/1520-uncouth-%E4%BF%97"
    },
    {
      "kanji": "漠",
      "uri": "/kanji/430-desert-%E6%BC%A0"
    },
    {
      "kanji": "邪",
      "uri": "/kanji/1712-heresy-%E9%82%AA"
    },
    {
      "kanji": "晶",
      "uri": "/kanji/27-crystal-%E6%99%B6"
    },
    {
      "kanji": "墨",
      "uri": ""
    },
    {
      "kanji": "鎮",
      "uri": ""
    },
    {
      "kanji": "洞",
      "uri": ""
    },
    {
      "kanji": "履",
      "uri": "/kanji/1516-put-on-pants-or-shoes-%E5%B1%A5"
    },
    {
      "kanji": "劣",
      "uri": "/kanji/194-inferiority-%E5%8A%A3"
    },
    {
      "kanji": "那",
      "uri": ""
    },
    {
      "kanji": "殴",
      "uri": "/kanji/1298-punch-%E6%AE%B4"
    },
    {
      "kanji": "娠",
      "uri": "/kanji/1175-pregnancy-%E5%A8%A0"
    },
    {
      "kanji": "奉",
      "uri": ""
    },
    {
      "kanji": "憂",
      "uri": "/kanji/815-grieve-%E6%86%82"
    },
    {
      "kanji": "朴",
      "uri": ""
    },
    {
      "kanji": "亭",
      "uri": "/kanji/81-restaurant-%E4%BA%AD"
    },
    {
      "kanji": "淳",
      "uri": ""
    },
    {
      "kanji": "怪",
      "uri": "/kanji/1090-suspicious-%E6%80%AA"
    },
    {
      "kanji": "鳩",
      "uri": ""
    },
    {
      "kanji": "酔",
      "uri": "/kanji/579-drunk-%E9%85%94"
    },
    {
      "kanji": "惜",
      "uri": "/kanji/1544-close-but-no-cigar-%E6%83%9C"
    },
    {
      "kanji": "穫",
      "uri": ""
    },
    {
      "kanji": "佳",
      "uri": ""
    },
    {
      "kanji": "潤",
      "uri": ""
    },
    {
      "kanji": "悼",
      "uri": ""
    },
    {
      "kanji": "乏",
      "uri": "/kanji/1701-shoddy-%E4%B9%8F"
    },
    {
      "kanji": "該",
      "uri": "/kanji/1698-correspond-to-%E8%A9%B2"
    },
    {
      "kanji": "赴",
      "uri": ""
    },
    {
      "kanji": "桑",
      "uri": ""
    },
    {
      "kanji": "桂",
      "uri": ""
    },
    {
      "kanji": "髄",
      "uri": ""
    },
    {
      "kanji": "虎",
      "uri": ""
    },
    {
      "kanji": "盆",
      "uri": ""
    },
    {
      "kanji": "晋",
      "uri": ""
    },
    {
      "kanji": "穂",
      "uri": ""
    },
    {
      "kanji": "壮",
      "uri": "/kanji/799-epic-%E5%A3%AE"
    },
    {
      "kanji": "堤",
      "uri": ""
    },
    {
      "kanji": "飢",
      "uri": "/kanji/1286-starve-%E9%A3%A2"
    },
    {
      "kanji": "傍",
      "uri": ""
    },
    {
      "kanji": "疫",
      "uri": ""
    },
    {
      "kanji": "累",
      "uri": ""
    },
    {
      "kanji": "痴",
      "uri": "/kanji/1351-molester-%E7%97%B4"
    },
    {
      "kanji": "搬",
      "uri": ""
    },
    {
      "kanji": "晃",
      "uri": ""
    },
    {
      "kanji": "癒",
      "uri": "/kanji/1355-cure-%E7%99%92"
    },
    {
      "kanji": "桐",
      "uri": ""
    },
    {
      "kanji": "寸",
      "uri": "/kanji/986-glue-glue-%E5%AF%B8"
    },
    {
      "kanji": "郭",
      "uri": ""
    },
    {
      "kanji": "尿",
      "uri": "/kanji/502-urine-%E5%B0%BF"
    },
    {
      "kanji": "凶",
      "uri": "/kanji/1035-terrible-%E5%87%B6"
    },
    {
      "kanji": "吐",
      "uri": "/kanji/243-puke-%E5%90%90"
    },
    {
      "kanji": "宴",
      "uri": ""
    },
    {
      "kanji": "鷹",
      "uri": ""
    },
    {
      "kanji": "賓",
      "uri": ""
    },
    {
      "kanji": "虜",
      "uri": ""
    },
    {
      "kanji": "陶",
      "uri": "/kanji/1425-pottery-%E9%99%B6"
    },
    {
      "kanji": "鐘",
      "uri": ""
    },
    {
      "kanji": "憾",
      "uri": "/kanji/756-regrettable-%E6%86%BE"
    },
    {
      "kanji": "猪",
      "uri": ""
    },
    {
      "kanji": "紘",
      "uri": ""
    },
    {
      "kanji": "磁",
      "uri": "/kanji/866-magnet-%E7%A3%81"
    },
    {
      "kanji": "弥",
      "uri": ""
    },
    {
      "kanji": "昆",
      "uri": "/kanji/25-insect-%E6%98%86"
    },
    {
      "kanji": "粗",
      "uri": "/kanji/1487-rough-texture-bad-quality-%E7%B2%97"
    },
    {
      "kanji": "訂",
      "uri": "/kanji/54-revise-%E8%A8%82"
    },
    {
      "kanji": "芽",
      "uri": ""
    },
    {
      "kanji": "庄",
      "uri": ""
    },
    {
      "kanji": "傘",
      "uri": "/kanji/918-umbrella-%E5%82%98"
    },
    {
      "kanji": "敦",
      "uri": ""
    },
    {
      "kanji": "騎",
      "uri": ""
    },
    {
      "kanji": "寧",
      "uri": ""
    },
    {
      "kanji": "循",
      "uri": "/kanji/1302-circulate-%E5%BE%AA"
    },
    {
      "kanji": "忍",
      "uri": "/kanji/173-hide-endure-%E5%BF%8D"
    },
    {
      "kanji": "怠",
      "uri": "/kanji/142-lazy-%E6%80%A0"
    },
    {
      "kanji": "如",
      "uri": ""
    },
    {
      "kanji": "寮",
      "uri": "/kanji/1365-dormitory-%E5%AF%AE"
    },
    {
      "kanji": "祐",
      "uri": ""
    },
    {
      "kanji": "鵬",
      "uri": ""
    },
    {
      "kanji": "鉛",
      "uri": ""
    },
    {
      "kanji": "珠",
      "uri": ""
    },
    {
      "kanji": "凝",
      "uri": ""
    },
    {
      "kanji": "苗",
      "uri": ""
    },
    {
      "kanji": "獣",
      "uri": "/kanji/598-beast-%E7%8D%A3"
    },
    {
      "kanji": "哀",
      "uri": "/kanji/773-pitiful-%E5%93%80"
    },
    {
      "kanji": "跳",
      "uri": "/kanji/1654-leap-up-%E8%B7%B3"
    },
    {
      "kanji": "匠",
      "uri": "/kanji/692-artisan-%E5%8C%A0"
    },
    {
      "kanji": "垂",
      "uri": "/kanji/1060-drip-dangle-%E5%9E%82"
    },
    {
      "kanji": "蛇",
      "uri": "/kanji/494-snake-%E8%9B%87"
    },
    {
      "kanji": "澄",
      "uri": ""
    },
    {
      "kanji": "縫",
      "uri": ""
    },
    {
      "kanji": "僧",
      "uri": "/kanji/1608-buddhist-monk-%E5%83%A7"
    },
    {
      "kanji": "眺",
      "uri": "/kanji/1655-look-at-for-a-long-time-while-lost-in-thought-%E7%9C%BA"
    },
    {
      "kanji": "亘",
      "uri": ""
    },
    {
      "kanji": "呉",
      "uri": "/kanji/1734-wu-dynasty-of-china-%E5%91%89"
    },
    {
      "kanji": "凡",
      "uri": "/kanji/1289-mediocre-%E5%87%A1"
    },
    {
      "kanji": "憩",
      "uri": "/kanji/234-break-at-work-%E6%86%A9"
    },
    {
      "kanji": "媛",
      "uri": ""
    },
    {
      "kanji": "溝",
      "uri": "/kanji/1569-ditch-%E6%BA%9D"
    },
    {
      "kanji": "恭",
      "uri": ""
    },
    {
      "kanji": "刈",
      "uri": ""
    },
    {
      "kanji": "睡",
      "uri": "/kanji/1074-sleep-%E7%9D%A1"
    },
    {
      "kanji": "錯",
      "uri": ""
    },
    {
      "kanji": "伯",
      "uri": ""
    },
    {
      "kanji": "笹",
      "uri": ""
    },
    {
      "kanji": "穀",
      "uri": ""
    },
    {
      "kanji": "陵",
      "uri": ""
    },
    {
      "kanji": "霧",
      "uri": "/kanji/1384-fog-%E9%9C%A7"
    },
    {
      "kanji": "魂",
      "uri": "/kanji/1150-soul-%E9%AD%82"
    },
    {
      "kanji": "弊",
      "uri": ""
    },
    {
      "kanji": "妃",
      "uri": ""
    },
    {
      "kanji": "舶",
      "uri": ""
    },
    {
      "kanji": "餓",
      "uri": ""
    },
    {
      "kanji": "窮",
      "uri": "/kanji/1598-to-be-in-trouble-%E7%AA%AE"
    },
    {
      "kanji": "掌",
      "uri": ""
    },
    {
      "kanji": "麗",
      "uri": "/kanji/1768-gorgeous-%E9%BA%97"
    },
    {
      "kanji": "綾",
      "uri": ""
    },
    {
      "kanji": "臭",
      "uri": "/kanji/401-stinky-odor-%E8%87%AD"
    },
    {
      "kanji": "悦",
      "uri": ""
    },
    {
      "kanji": "刃",
      "uri": "/kanji/172-blade-%E5%88%83"
    },
    {
      "kanji": "縛",
      "uri": "/kanji/1018-tie-up-%E7%B8%9B"
    },
    {
      "kanji": "暦",
      "uri": ""
    },
    {
      "kanji": "宜",
      "uri": ""
    },
    {
      "kanji": "盲",
      "uri": "/kanji/107-blind-ignorant-%E7%9B%B2"
    },
    {
      "kanji": "粋",
      "uri": "/kanji/391-essence-%E7%B2%8B"
    },
    {
      "kanji": "辱",
      "uri": "/kanji/1174-humiliate-%E8%BE%B1"
    },
    {
      "kanji": "毅",
      "uri": ""
    },
    {
      "kanji": "轄",
      "uri": ""
    },
    {
      "kanji": "猿",
      "uri": "/kanji/1456-monkey-%E7%8C%BF"
    },
    {
      "kanji": "弦",
      "uri": ""
    },
    {
      "kanji": "稔",
      "uri": ""
    },
    {
      "kanji": "窒",
      "uri": ""
    },
    {
      "kanji": "炊",
      "uri": "/kanji/702-cook-rice-%E7%82%8A"
    },
    {
      "kanji": "洪",
      "uri": "/kanji/1553-flood-%E6%B4%AA"
    },
    {
      "kanji": "摂",
      "uri": ""
    },
    {
      "kanji": "飽",
      "uri": "/kanji/1416-get-sick-of-%E9%A3%BD"
    },
    {
      "kanji": "冗",
      "uri": "/kanji/1281-joke-%E5%86%97"
    },
    {
      "kanji": "桃",
      "uri": "/kanji/1657-peach-%E6%A1%83"
    },
    {
      "kanji": "狩",
      "uri": "/kanji/1457-hunt-%E7%8B%A9"
    },
    {
      "kanji": "朱",
      "uri": "/kanji/477-vermilion-%E6%9C%B1"
    },
    {
      "kanji": "渦",
      "uri": ""
    },
    {
      "kanji": "紳",
      "uri": "/kanji/1369-gentleman-%E7%B4%B3"
    },
    {
      "kanji": "枢",
      "uri": ""
    },
    {
      "kanji": "碑",
      "uri": ""
    },
    {
      "kanji": "鍛",
      "uri": ""
    },
    {
      "kanji": "刀",
      "uri": "/kanji/164-sword-%E5%88%80"
    },
    {
      "kanji": "鼓",
      "uri": "/kanji/1322-drum-%E9%BC%93"
    },
    {
      "kanji": "裸",
      "uri": "/kanji/1510-naked-%E8%A3%B8"
    },
    {
      "kanji": "猶",
      "uri": ""
    },
    {
      "kanji": "塊",
      "uri": "/kanji/1152-clump-%E5%A1%8A"
    },
    {
      "kanji": "旋",
      "uri": ""
    },
    {
      "kanji": "弓",
      "uri": "/kanji/892-bow-%E5%BC%93"
    },
    {
      "kanji": "幣",
      "uri": ""
    },
    {
      "kanji": "膜",
      "uri": ""
    },
    {
      "kanji": "扇",
      "uri": "/kanji/1537-traditional-fan-%E6%89%87"
    },
    {
      "kanji": "腸",
      "uri": ""
    },
    {
      "kanji": "槽",
      "uri": ""
    },
    {
      "kanji": "慈",
      "uri": ""
    },
    {
      "kanji": "楊",
      "uri": ""
    },
    {
      "kanji": "伐",
      "uri": ""
    },
    {
      "kanji": "駿",
      "uri": ""
    },
    {
      "kanji": "漬",
      "uri": ""
    },
    {
      "kanji": "糾",
      "uri": ""
    },
    {
      "kanji": "亮",
      "uri": ""
    },
    {
      "kanji": "墳",
      "uri": ""
    },
    {
      "kanji": "坪",
      "uri": ""
    },
    {
      "kanji": "紺",
      "uri": ""
    },
    {
      "kanji": "娯",
      "uri": "/kanji/1736-entertainment-%E5%A8%AF"
    },
    {
      "kanji": "椿",
      "uri": ""
    },
    {
      "kanji": "舌",
      "uri": "/kanji/230-tongue-%E8%88%8C"
    },
    {
      "kanji": "羅",
      "uri": ""
    },
    {
      "kanji": "峡",
      "uri": ""
    },
    {
      "kanji": "俸",
      "uri": ""
    },
    {
      "kanji": "厘",
      "uri": ""
    },
    {
      "kanji": "峰",
      "uri": ""
    },
    {
      "kanji": "圭",
      "uri": ""
    },
    {
      "kanji": "醸",
      "uri": ""
    },
    {
      "kanji": "蓮",
      "uri": ""
    },
    {
      "kanji": "弔",
      "uri": ""
    },
    {
      "kanji": "乙",
      "uri": "/kanji/480-second-rank-girl-%E4%B9%99"
    },
    {
      "kanji": "汁",
      "uri": "/kanji/39-juice-soup-%E6%B1%81"
    },
    {
      "kanji": "尼",
      "uri": "/kanji/500-nun-%E5%B0%BC"
    },
    {
      "kanji": "遍",
      "uri": ""
    },
    {
      "kanji": "衡",
      "uri": ""
    },
    {
      "kanji": "薫",
      "uri": ""
    },
    {
      "kanji": "猟",
      "uri": ""
    },
    {
      "kanji": "羊",
      "uri": "/kanji/867-sheep-%E7%BE%8A"
    },
    {
      "kanji": "款",
      "uri": ""
    },
    {
      "kanji": "閲",
      "uri": ""
    },
    {
      "kanji": "偵",
      "uri": "/kanji/543-detective-%E5%81%B5"
    },
    {
      "kanji": "喝",
      "uri": ""
    },
    {
      "kanji": "敢",
      "uri": ""
    },
    {
      "kanji": "胎",
      "uri": ""
    },
    {
      "kanji": "酵",
      "uri": ""
    },
    {
      "kanji": "憤",
      "uri": "/kanji/534-get-indignant-%E6%86%A4"
    },
    {
      "kanji": "豚",
      "uri": "/kanji/1219-pig-%E8%B1%9A"
    },
    {
      "kanji": "遮",
      "uri": ""
    },
    {
      "kanji": "扉",
      "uri": ""
    },
    {
      "kanji": "硫",
      "uri": ""
    },
    {
      "kanji": "赦",
      "uri": ""
    },
    {
      "kanji": "窃",
      "uri": ""
    },
    {
      "kanji": "泡",
      "uri": "/kanji/1414-bubble-%E6%B3%A1"
    },
    {
      "kanji": "瑞",
      "uri": ""
    },
    {
      "kanji": "又",
      "uri": "/kanji/89-again-crotch-radical-%E5%8F%88"
    },
    {
      "kanji": "慨",
      "uri": "/kanji/1716-deplore-%E6%85%A8"
    },
    {
      "kanji": "紡",
      "uri": ""
    },
    {
      "kanji": "恨",
      "uri": "/kanji/780-hold-a-grudge-%E6%81%A8"
    },
    {
      "kanji": "肪",
      "uri": "/kanji/88-fatty-food-%E8%82%AA"
    },
    {
      "kanji": "扶",
      "uri": ""
    },
    {
      "kanji": "戯",
      "uri": ""
    },
    {
      "kanji": "伍",
      "uri": ""
    },
    {
      "kanji": "忌",
      "uri": ""
    },
    {
      "kanji": "濁",
      "uri": ""
    },
    {
      "kanji": "奔",
      "uri": ""
    },
    {
      "kanji": "斗",
      "uri": ""
    },
    {
      "kanji": "蘭",
      "uri": ""
    },
    {
      "kanji": "迅",
      "uri": ""
    },
    {
      "kanji": "肖",
      "uri": "/kanji/599-carrot-%E8%82%96"
    },
    {
      "kanji": "鉢",
      "uri": ""
    },
    {
      "kanji": "朽",
      "uri": ""
    },
    {
      "kanji": "殻",
      "uri": ""
    },
    {
      "kanji": "享",
      "uri": ""
    },
    {
      "kanji": "秦",
      "uri": ""
    },
    {
      "kanji": "茅",
      "uri": ""
    },
    {
      "kanji": "藩",
      "uri": ""
    },
    {
      "kanji": "沙",
      "uri": ""
    },
    {
      "kanji": "輔",
      "uri": ""
    },
    {
      "kanji": "媒",
      "uri": ""
    },
    {
      "kanji": "鶏",
      "uri": ""
    },
    {
      "kanji": "禅",
      "uri": ""
    },
    {
      "kanji": "嘱",
      "uri": ""
    },
    {
      "kanji": "胴",
      "uri": ""
    },
    {
      "kanji": "迭",
      "uri": ""
    },
    {
      "kanji": "挿",
      "uri": "/kanji/307-insert-%E6%8C%BF"
    },
    {
      "kanji": "嵐",
      "uri": ""
    },
    {
      "kanji": "椎",
      "uri": ""
    },
    {
      "kanji": "絹",
      "uri": "/kanji/218-silk-%E7%B5%B9"
    },
    {
      "kanji": "陪",
      "uri": ""
    },
    {
      "kanji": "剖",
      "uri": "/kanji/796-dissect-%E5%89%96"
    },
    {
      "kanji": "譜",
      "uri": ""
    },
    {
      "kanji": "郁",
      "uri": ""
    },
    {
      "kanji": "悠",
      "uri": ""
    },
    {
      "kanji": "淑",
      "uri": ""
    },
    {
      "kanji": "帆",
      "uri": ""
    },
    {
      "kanji": "暁",
      "uri": ""
    },
    {
      "kanji": "傑",
      "uri": ""
    },
    {
      "kanji": "楠",
      "uri": ""
    },
    {
      "kanji": "笛",
      "uri": ""
    },
    {
      "kanji": "玲",
      "uri": ""
    },
    {
      "kanji": "奴",
      "uri": "/kanji/91-servant-dood-%E5%A5%B4"
    },
    {
      "kanji": "錠",
      "uri": ""
    },
    {
      "kanji": "拳",
      "uri": ""
    },
    {
      "kanji": "翔",
      "uri": ""
    },
    {
      "kanji": "遷",
      "uri": ""
    },
    {
      "kanji": "拙",
      "uri": ""
    },
    {
      "kanji": "侍",
      "uri": "/kanji/1004-samurai-kanji-%E4%BE%8D"
    },
    {
      "kanji": "尺",
      "uri": "/kanji/288-r-for-rock-%E5%B0%BA"
    },
    {
      "kanji": "峠",
      "uri": ""
    },
    {
      "kanji": "篤",
      "uri": ""
    },
    {
      "kanji": "肇",
      "uri": ""
    },
    {
      "kanji": "渇",
      "uri": "/kanji/1427-thirsty-%E6%B8%87"
    },
    {
      "kanji": "叔",
      "uri": ""
    },
    {
      "kanji": "雌",
      "uri": "/kanji/272-your-moms-%E9%9B%8C"
    },
    {
      "kanji": "亨",
      "uri": ""
    },
    {
      "kanji": "堪",
      "uri": "/kanji/1710-tolerate-%E5%A0%AA"
    },
    {
      "kanji": "叙",
      "uri": ""
    },
    {
      "kanji": "酢",
      "uri": ""
    },
    {
      "kanji": "吟",
      "uri": ""
    },
    {
      "kanji": "逓",
      "uri": ""
    },
    {
      "kanji": "嶺",
      "uri": ""
    },
    {
      "kanji": "甚",
      "uri": "/kanji/1708-enormous-%E7%94%9A"
    },
    {
      "kanji": "喬",
      "uri": ""
    },
    {
      "kanji": "崇",
      "uri": ""
    },
    {
      "kanji": "漆",
      "uri": ""
    },
    {
      "kanji": "岬",
      "uri": ""
    },
    {
      "kanji": "癖",
      "uri": "/kanji/1360-bad-habit-%E7%99%96"
    },
    {
      "kanji": "愉",
      "uri": "/kanji/1356-pleasure-%E6%84%89"
    },
    {
      "kanji": "寅",
      "uri": ""
    },
    {
      "kanji": "礁",
      "uri": ""
    },
    {
      "kanji": "乃",
      "uri": ""
    },
    {
      "kanji": "洲",
      "uri": ""
    },
    {
      "kanji": "屯",
      "uri": "/kanji/1717-bent-dagger-%E5%B1%AF"
    },
    {
      "kanji": "樺",
      "uri": ""
    },
    {
      "kanji": "槙",
      "uri": ""
    },
    {
      "kanji": "姻",
      "uri": ""
    },
    {
      "kanji": "巌",
      "uri": ""
    },
    {
      "kanji": "擬",
      "uri": "/kanji/1045-sham-%E6%93%AC"
    },
    {
      "kanji": "塀",
      "uri": ""
    },
    {
      "kanji": "唇",
      "uri": "/kanji/1177-lips-%E5%94%87"
    },
    {
      "kanji": "睦",
      "uri": ""
    },
    {
      "kanji": "閑",
      "uri": ""
    },
    {
      "kanji": "胡",
      "uri": ""
    },
    {
      "kanji": "幽",
      "uri": "/kanji/830-occult-%E5%B9%BD"
    },
    {
      "kanji": "峻",
      "uri": ""
    },
    {
      "kanji": "曹",
      "uri": ""
    },
    {
      "kanji": "詠",
      "uri": ""
    },
    {
      "kanji": "卑",
      "uri": "/kanji/1153-despicable-%E5%8D%91"
    },
    {
      "kanji": "侮",
      "uri": "/kanji/488-despise-%E4%BE%AE"
    },
    {
      "kanji": "鋳",
      "uri": ""
    },
    {
      "kanji": "抹",
      "uri": ""
    },
    {
      "kanji": "尉",
      "uri": ""
    },
    {
      "kanji": "槻",
      "uri": ""
    },
    {
      "kanji": "隷",
      "uri": ""
    },
    {
      "kanji": "禍",
      "uri": ""
    },
    {
      "kanji": "蝶",
      "uri": ""
    },
    {
      "kanji": "酪",
      "uri": ""
    },
    {
      "kanji": "茎",
      "uri": ""
    },
    {
      "kanji": "帥",
      "uri": ""
    },
    {
      "kanji": "逝",
      "uri": ""
    },
    {
      "kanji": "汽",
      "uri": ""
    },
    {
      "kanji": "琢",
      "uri": ""
    },
    {
      "kanji": "匿",
      "uri": ""
    },
    {
      "kanji": "襟",
      "uri": ""
    },
    {
      "kanji": "蛍",
      "uri": ""
    },
    {
      "kanji": "蕉",
      "uri": ""
    },
    {
      "kanji": "寡",
      "uri": ""
    },
    {
      "kanji": "琉",
      "uri": ""
    },
    {
      "kanji": "痢",
      "uri": "/kanji/1350-diarrhea-%E7%97%A2"
    },
    {
      "kanji": "庸",
      "uri": ""
    },
    {
      "kanji": "朋",
      "uri": ""
    },
    {
      "kanji": "坑",
      "uri": ""
    },
    {
      "kanji": "藍",
      "uri": ""
    },
    {
      "kanji": "賊",
      "uri": "/kanji/670-bandit-%E8%B3%8A"
    },
    {
      "kanji": "搾",
      "uri": ""
    },
    {
      "kanji": "畔",
      "uri": ""
    },
    {
      "kanji": "遼",
      "uri": ""
    },
    {
      "kanji": "唄",
      "uri": ""
    },
    {
      "kanji": "孔",
      "uri": ""
    },
    {
      "kanji": "橘",
      "uri": ""
    },
    {
      "kanji": "漱",
      "uri": ""
    },
    {
      "kanji": "呂",
      "uri": "/kanji/1610-washtub-%E5%91%82"
    },
    {
      "kanji": "拷",
      "uri": "/kanji/658-torture-%E6%8B%B7"
    },
    {
      "kanji": "嬢",
      "uri": "/kanji/1673-young-lady-%E5%AC%A2"
    },
    {
      "kanji": "苑",
      "uri": ""
    },
    {
      "kanji": "巽",
      "uri": ""
    },
    {
      "kanji": "杜",
      "uri": ""
    },
    {
      "kanji": "渓",
      "uri": ""
    },
    {
      "kanji": "翁",
      "uri": ""
    },
    {
      "kanji": "廉",
      "uri": ""
    },
    {
      "kanji": "謹",
      "uri": ""
    },
    {
      "kanji": "瞳",
      "uri": ""
    },
    {
      "kanji": "湧",
      "uri": ""
    },
    {
      "kanji": "欣",
      "uri": ""
    },
    {
      "kanji": "窯",
      "uri": ""
    },
    {
      "kanji": "褒",
      "uri": "/kanji/771-praise-%E8%A4%92"
    },
    {
      "kanji": "醜",
      "uri": "/kanji/1151-ugly-%E9%86%9C"
    },
    {
      "kanji": "升",
      "uri": ""
    },
    {
      "kanji": "殉",
      "uri": ""
    },
    {
      "kanji": "煩",
      "uri": ""
    },
    {
      "kanji": "巴",
      "uri": ""
    },
    {
      "kanji": "禎",
      "uri": ""
    },
    {
      "kanji": "劾",
      "uri": ""
    },
    {
      "kanji": "堕",
      "uri": "/kanji/1101-corrupt-%E5%A0%95"
    },
    {
      "kanji": "租",
      "uri": ""
    },
    {
      "kanji": "稜",
      "uri": ""
    },
    {
      "kanji": "桟",
      "uri": ""
    },
    {
      "kanji": "倭",
      "uri": ""
    },
    {
      "kanji": "婿",
      "uri": ""
    },
    {
      "kanji": "慕",
      "uri": ""
    },
    {
      "kanji": "斐",
      "uri": ""
    },
    {
      "kanji": "罷",
      "uri": ""
    },
    {
      "kanji": "矯",
      "uri": ""
    },
    {
      "kanji": "某",
      "uri": "/kanji/517-a-certain-%E6%9F%90"
    },
    {
      "kanji": "囚",
      "uri": "/kanji/436-prisoner-%E5%9B%9A"
    },
    {
      "kanji": "魁",
      "uri": ""
    },
    {
      "kanji": "虹",
      "uri": ""
    },
    {
      "kanji": "鴻",
      "uri": ""
    },
    {
      "kanji": "泌",
      "uri": ""
    },
    {
      "kanji": "於",
      "uri": ""
    },
    {
      "kanji": "赳",
      "uri": ""
    },
    {
      "kanji": "漸",
      "uri": ""
    },
    {
      "kanji": "蚊",
      "uri": "/kanji/495-mosquito-%E8%9A%8A"
    },
    {
      "kanji": "葵",
      "uri": ""
    },
    {
      "kanji": "厄",
      "uri": "/kanji/1474-misfortune-%E5%8E%84"
    },
    {
      "kanji": "藻",
      "uri": ""
    },
    {
      "kanji": "禄",
      "uri": ""
    },
    {
      "kanji": "孟",
      "uri": ""
    },
    {
      "kanji": "嫡",
      "uri": ""
    },
    {
      "kanji": "尭",
      "uri": ""
    },
    {
      "kanji": "嚇",
      "uri": ""
    },
    {
      "kanji": "巳",
      "uri": ""
    },
    {
      "kanji": "凸",
      "uri": ""
    },
    {
      "kanji": "暢",
      "uri": ""
    },
    {
      "kanji": "韻",
      "uri": ""
    },
    {
      "kanji": "霜",
      "uri": "/kanji/1387-frost-%E9%9C%9C"
    },
    {
      "kanji": "硝",
      "uri": ""
    },
    {
      "kanji": "勅",
      "uri": ""
    },
    {
      "kanji": "芹",
      "uri": ""
    },
    {
      "kanji": "杏",
      "uri": ""
    },
    {
      "kanji": "棺",
      "uri": "/kanji/1615-coffin-%E6%A3%BA"
    },
    {
      "kanji": "儒",
      "uri": ""
    },
    {
      "kanji": "鳳",
      "uri": ""
    },
    {
      "kanji": "馨",
      "uri": ""
    },
    {
      "kanji": "慧",
      "uri": ""
    },
    {
      "kanji": "愁",
      "uri": "/kanji/379-sorrow-%E6%84%81"
    },
    {
      "kanji": "楼",
      "uri": ""
    },
    {
      "kanji": "彬",
      "uri": ""
    },
    {
      "kanji": "匡",
      "uri": ""
    },
    {
      "kanji": "眉",
      "uri": ""
    },
    {
      "kanji": "欽",
      "uri": ""
    },
    {
      "kanji": "薪",
      "uri": ""
    },
    {
      "kanji": "褐",
      "uri": ""
    },
    {
      "kanji": "賜",
      "uri": ""
    },
    {
      "kanji": "嵯",
      "uri": ""
    },
    {
      "kanji": "綜",
      "uri": ""
    },
    {
      "kanji": "繕",
      "uri": "/kanji/1633-mend-%E7%B9%95"
    },
    {
      "kanji": "栓",
      "uri": ""
    },
    {
      "kanji": "翠",
      "uri": ""
    },
    {
      "kanji": "鮎",
      "uri": ""
    },
    {
      "kanji": "榛",
      "uri": ""
    },
    {
      "kanji": "凹",
      "uri": ""
    },
    {
      "kanji": "艶",
      "uri": ""
    },
    {
      "kanji": "惣",
      "uri": ""
    },
    {
      "kanji": "蔦",
      "uri": ""
    },
    {
      "kanji": "錬",
      "uri": ""
    },
    {
      "kanji": "隼",
      "uri": ""
    },
    {
      "kanji": "渚",
      "uri": ""
    },
    {
      "kanji": "衷",
      "uri": ""
    },
    {
      "kanji": "逐",
      "uri": ""
    },
    {
      "kanji": "斥",
      "uri": ""
    },
    {
      "kanji": "稀",
      "uri": ""
    },
    {
      "kanji": "芙",
      "uri": ""
    },
    {
      "kanji": "詔",
      "uri": ""
    },
    {
      "kanji": "皐",
      "uri": ""
    },
    {
      "kanji": "雛",
      "uri": ""
    },
    {
      "kanji": "惟",
      "uri": ""
    },
    {
      "kanji": "佑",
      "uri": ""
    },
    {
      "kanji": "耀",
      "uri": ""
    },
    {
      "kanji": "黛",
      "uri": ""
    },
    {
      "kanji": "渥",
      "uri": ""
    },
    {
      "kanji": "憧",
      "uri": "/kanji/240-yearn-for-%E6%86%A7"
    },
    {
      "kanji": "宵",
      "uri": ""
    },
    {
      "kanji": "妄",
      "uri": "/kanji/108-without-reason-or-permission-%E5%A6%84"
    },
    {
      "kanji": "惇",
      "uri": ""
    },
    {
      "kanji": "脩",
      "uri": ""
    },
    {
      "kanji": "甫",
      "uri": "/kanji/1561-unicycle-%E7%94%AB"
    },
    {
      "kanji": "酌",
      "uri": ""
    },
    {
      "kanji": "蚕",
      "uri": ""
    },
    {
      "kanji": "嬉",
      "uri": "/kanji/839-stoked-%E5%AC%89"
    },
    {
      "kanji": "蒼",
      "uri": ""
    },
    {
      "kanji": "暉",
      "uri": ""
    },
    {
      "kanji": "頒",
      "uri": ""
    },
    {
      "kanji": "只",
      "uri": ""
    },
    {
      "kanji": "肢",
      "uri": ""
    },
    {
      "kanji": "檀",
      "uri": ""
    },
    {
      "kanji": "凱",
      "uri": ""
    },
    {
      "kanji": "彗",
      "uri": ""
    },
    {
      "kanji": "謄",
      "uri": ""
    },
    {
      "kanji": "梓",
      "uri": ""
    },
    {
      "kanji": "丑",
      "uri": ""
    },
    {
      "kanji": "嗣",
      "uri": ""
    },
    {
      "kanji": "叶",
      "uri": "/kanji/17-dream-come-true-%E5%8F%B6"
    },
    {
      "kanji": "汐",
      "uri": ""
    },
    {
      "kanji": "絢",
      "uri": ""
    },
    {
      "kanji": "朔",
      "uri": ""
    },
    {
      "kanji": "伽",
      "uri": ""
    },
    {
      "kanji": "畝",
      "uri": ""
    },
    {
      "kanji": "抄",
      "uri": ""
    },
    {
      "kanji": "爽",
      "uri": ""
    },
    {
      "kanji": "黎",
      "uri": ""
    },
    {
      "kanji": "惰",
      "uri": ""
    },
    {
      "kanji": "蛮",
      "uri": ""
    },
    {
      "kanji": "冴",
      "uri": ""
    },
    {
      "kanji": "旺",
      "uri": ""
    },
    {
      "kanji": "萌",
      "uri": ""
    },
    {
      "kanji": "偲",
      "uri": ""
    },
    {
      "kanji": "壱",
      "uri": ""
    },
    {
      "kanji": "瑠",
      "uri": ""
    },
    {
      "kanji": "允",
      "uri": ""
    },
    {
      "kanji": "侯",
      "uri": ""
    },
    {
      "kanji": "蒔",
      "uri": ""
    },
    {
      "kanji": "鯉",
      "uri": ""
    },
    {
      "kanji": "弧",
      "uri": "/kanji/1739-arc-%E5%BC%A7"
    },
    {
      "kanji": "遥",
      "uri": ""
    },
    {
      "kanji": "舜",
      "uri": ""
    },
    {
      "kanji": "瑛",
      "uri": ""
    },
    {
      "kanji": "附",
      "uri": "/kanji/988-attachment-%E9%99%84"
    },
    {
      "kanji": "彪",
      "uri": ""
    },
    {
      "kanji": "卯",
      "uri": ""
    },
    {
      "kanji": "但",
      "uri": ""
    },
    {
      "kanji": "綺",
      "uri": ""
    },
    {
      "kanji": "芋",
      "uri": "/kanji/226-potato-%E8%8A%8B"
    },
    {
      "kanji": "茜",
      "uri": ""
    },
    {
      "kanji": "凌",
      "uri": ""
    },
    {
      "kanji": "皓",
      "uri": ""
    },
    {
      "kanji": "洸",
      "uri": ""
    },
    {
      "kanji": "毬",
      "uri": ""
    },
    {
      "kanji": "婆",
      "uri": ""
    },
    {
      "kanji": "緋",
      "uri": ""
    },
    {
      "kanji": "鯛",
      "uri": ""
    },
    {
      "kanji": "怜",
      "uri": ""
    },
    {
      "kanji": "邑",
      "uri": ""
    },
    {
      "kanji": "倣",
      "uri": ""
    },
    {
      "kanji": "碧",
      "uri": ""
    },
    {
      "kanji": "啄",
      "uri": ""
    },
    {
      "kanji": "穣",
      "uri": ""
    },
    {
      "kanji": "酉",
      "uri": ""
    },
    {
      "kanji": "悌",
      "uri": ""
    },
    {
      "kanji": "倹",
      "uri": "/kanji/417-thrifty-%E5%80%B9"
    },
    {
      "kanji": "柚",
      "uri": ""
    },
    {
      "kanji": "繭",
      "uri": ""
    },
    {
      "kanji": "亦",
      "uri": ""
    },
    {
      "kanji": "詢",
      "uri": ""
    },
    {
      "kanji": "采",
      "uri": ""
    },
    {
      "kanji": "紗",
      "uri": ""
    },
    {
      "kanji": "賦",
      "uri": ""
    },
    {
      "kanji": "眸",
      "uri": ""
    },
    {
      "kanji": "玖",
      "uri": ""
    },
    {
      "kanji": "弐",
      "uri": ""
    },
    {
      "kanji": "錘",
      "uri": ""
    },
    {
      "kanji": "諄",
      "uri": ""
    },
    {
      "kanji": "倖",
      "uri": ""
    },
    {
      "kanji": "痘",
      "uri": ""
    },
    {
      "kanji": "笙",
      "uri": ""
    },
    {
      "kanji": "侃",
      "uri": ""
    },
    {
      "kanji": "裟",
      "uri": ""
    },
    {
      "kanji": "洵",
      "uri": ""
    },
    {
      "kanji": "爾",
      "uri": ""
    },
    {
      "kanji": "耗",
      "uri": ""
    },
    {
      "kanji": "昴",
      "uri": ""
    },
    {
      "kanji": "銑",
      "uri": ""
    },
    {
      "kanji": "莞",
      "uri": ""
    },
    {
      "kanji": "伶",
      "uri": ""
    },
    {
      "kanji": "碩",
      "uri": ""
    },
    {
      "kanji": "宥",
      "uri": ""
    },
    {
      "kanji": "滉",
      "uri": ""
    },
    {
      "kanji": "晏",
      "uri": ""
    },
    {
      "kanji": "伎",
      "uri": ""
    },
    {
      "kanji": "朕",
      "uri": ""
    },
    {
      "kanji": "迪",
      "uri": ""
    },
    {
      "kanji": "綸",
      "uri": ""
    },
    {
      "kanji": "且",
      "uri": ""
    },
    {
      "kanji": "竣",
      "uri": ""
    },
    {
      "kanji": "晨",
      "uri": ""
    },
    {
      "kanji": "吏",
      "uri": ""
    },
    {
      "kanji": "燦",
      "uri": ""
    },
    {
      "kanji": "麿",
      "uri": ""
    },
    {
      "kanji": "頌",
      "uri": ""
    },
    {
      "kanji": "箇",
      "uri": ""
    },
    {
      "kanji": "楓",
      "uri": ""
    },
    {
      "kanji": "琳",
      "uri": ""
    },
    {
      "kanji": "梧",
      "uri": ""
    },
    {
      "kanji": "哉",
      "uri": ""
    },
    {
      "kanji": "澪",
      "uri": ""
    },
    {
      "kanji": "匁",
      "uri": ""
    },
    {
      "kanji": "晟",
      "uri": ""
    },
    {
      "kanji": "衿",
      "uri": ""
    },
    {
      "kanji": "凪",
      "uri": ""
    },
    {
      "kanji": "梢",
      "uri": ""
    },
    {
      "kanji": "丙",
      "uri": "/kanji/1344-t-bone-steak-%E4%B8%99"
    },
    {
      "kanji": "颯",
      "uri": ""
    },
    {
      "kanji": "茄",
      "uri": ""
    },
    {
      "kanji": "勺",
      "uri": ""
    },
    {
      "kanji": "恕",
      "uri": ""
    },
    {
      "kanji": "蕗",
      "uri": ""
    },
    {
      "kanji": "瑚",
      "uri": ""
    },
    {
      "kanji": "遵",
      "uri": ""
    },
    {
      "kanji": "瞭",
      "uri": ""
    },
    {
      "kanji": "燎",
      "uri": ""
    },
    {
      "kanji": "虞",
      "uri": ""
    },
    {
      "kanji": "柊",
      "uri": ""
    },
    {
      "kanji": "侑",
      "uri": ""
    },
    {
      "kanji": "謁",
      "uri": ""
    },
    {
      "kanji": "斤",
      "uri": "/kanji/315-axe-%E6%96%A4"
    },
    {
      "kanji": "嵩",
      "uri": ""
    },
    {
      "kanji": "捺",
      "uri": ""
    },
    {
      "kanji": "蓉",
      "uri": ""
    },
    {
      "kanji": "茉",
      "uri": ""
    },
    {
      "kanji": "袈",
      "uri": ""
    },
    {
      "kanji": "燿",
      "uri": ""
    },
    {
      "kanji": "誼",
      "uri": ""
    },
    {
      "kanji": "冶",
      "uri": ""
    },
    {
      "kanji": "栞",
      "uri": ""
    },
    {
      "kanji": "墾",
      "uri": ""
    },
    {
      "kanji": "勁",
      "uri": ""
    },
    {
      "kanji": "菖",
      "uri": ""
    },
    {
      "kanji": "旦",
      "uri": "/kanji/30-danna-husband-%E6%97%A6"
    },
    {
      "kanji": "椋",
      "uri": ""
    },
    {
      "kanji": "叡",
      "uri": ""
    },
    {
      "kanji": "紬",
      "uri": ""
    },
    {
      "kanji": "胤",
      "uri": ""
    },
    {
      "kanji": "凜",
      "uri": ""
    },
    {
      "kanji": "亥",
      "uri": ""
    },
    {
      "kanji": "爵",
      "uri": ""
    },
    {
      "kanji": "脹",
      "uri": ""
    },
    {
      "kanji": "麟",
      "uri": ""
    },
    {
      "kanji": "莉",
      "uri": ""
    },
    {
      "kanji": "汰",
      "uri": ""
    },
    {
      "kanji": "瑶",
      "uri": ""
    },
    {
      "kanji": "瑳",
      "uri": ""
    },
    {
      "kanji": "耶",
      "uri": ""
    },
    {
      "kanji": "椰",
      "uri": ""
    },
    {
      "kanji": "絃",
      "uri": ""
    },
    {
      "kanji": "丞",
      "uri": ""
    },
    {
      "kanji": "璃",
      "uri": ""
    },
    {
      "kanji": "奎",
      "uri": ""
    },
    {
      "kanji": "塑",
      "uri": ""
    },
    {
      "kanji": "昂",
      "uri": ""
    },
    {
      "kanji": "柾",
      "uri": ""
    },
    {
      "kanji": "熙",
      "uri": ""
    },
    {
      "kanji": "菫",
      "uri": ""
    },
    {
      "kanji": "諒",
      "uri": ""
    },
    {
      "kanji": "鞠",
      "uri": ""
    },
    {
      "kanji": "崚",
      "uri": ""
    },
    {
      "kanji": "濫",
      "uri": ""
    },
    {
      "kanji": "捷",
      "uri": ""
    }
  ];
















