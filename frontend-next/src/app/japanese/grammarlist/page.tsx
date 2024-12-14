import GrammarTitles from "@/components/GrammarTitles";

export default async function Page() {

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* <p>{data.titles}</p> */}

      <h1 className="text-3xl font-bold mb-4 text-gray-500 px-5">
        Japanese grammar JLPT N5-N1:
      </h1>

      <GrammarTitles lang="Japanese" pTag="JLPT_N5" slug="/japanese/grammarpoint"/>
      <GrammarTitles lang="Japanese" pTag="JLPT_N4" slug="/japanese/grammarpoint"/>
      <GrammarTitles lang="Japanese" pTag="JLPT_N3" slug="/japanese/grammarpoint"/>
      <GrammarTitles lang="Japanese" pTag="JLPT_N2" slug="/japanese/grammarpoint"/>
      <GrammarTitles lang="Japanese" pTag="JLPT_N1" slug="/japanese/grammarpoint"/>
    </div>
  );
}

const encodeTitle = (title: string) => {
  return encodeURIComponent(title);
};

