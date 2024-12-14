import Image from "next/image";
import Link from "next/link";


type Props = {
  img: any;
  title: any;
  link: any;
};

export default function CategoriesHeader() {
  return (
    <div className="w-11/12 py-5 px-10 bg-gray-50 rounded-md hidden lg:block">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-xl font-bold">Categories</h1>
        <div className="flex flex-col lg:flex-row mt-5 md:mt-0 items-center">
          <h1 className="text-lg">Show content for speakers of</h1>
          <select
            name=""
            className="p-3 ml-5 mt-3 md:mt-0 rounded bg-transparent border border-black w-44"
            id=""
          >
            <option value="English">English</option>
          </select>
        </div>
      </div>
      <div className="mt-5 w-full grid md:grid-cols-5 gap-5">
        
        {/* <Card img="/img/grammer.png" title="Japanese JLPT N3 Kanji" link="/kanjiselection" /> */}
        <Card img="/img/core.png" title="Japanese JLPT N5 Grammar" link="/japanese/grammar_selection/JLPT_N5" />
        <Card img="/img/core.png" title="Japanese JLPT N4 Grammar" link="/japanese/grammar_selection/JLPT_N4" />
        <Card img="/img/core.png" title="Japanese JLPT N3 Grammar" link="/japanese/grammar_selection/JLPT_N3" />
        <Card img="/img/core.png" title="Japanese JLPT N2 Grammar" link="/japanese/grammar_selection/JLPT_N2" />
        <Card img="/img/core.png" title="Japanese JLPT N1 Grammar" link="/japanese/grammar_selection/JLPT_N1" />
        {/* <Card img="/img/specific.png" title="Japanese JLPT N3 Reading" link="/readingselection" />
        <Card img="/img/sentences.png" title="Japanese JLPT N3 Listening" link="/listeningselection" /> */}
        {/* <Card img="/img/grammer.png" title="Japanese JLPT N3 Vocabulary" link="/vocabularyselection" /> */}
        
      </div>
    </div>
  );
}

// we would need better icons, maybe some kanji instead
function Card({ img, title, link }: Props) {
  return (
    <div className="p-5 flex items-center text-center justify-center flex-col">
      {/* <Image src={img} className="h-12" width={200} height={200} alt="" /> */}
      <h1 className="text-xl font-bold mt-5">
        {link ? (
          <Link href={link} className="text-gray-600 hover:text-blue-800">
            {title}
          </Link>
        ) : (
          title
        )}
      </h1>
    </div>
  );
}
