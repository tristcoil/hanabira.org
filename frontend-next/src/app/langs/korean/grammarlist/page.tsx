import GrammarTitles from "@/components/GrammarTitles";

export default async function Page() {

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* <p>{data.titles}</p> */}

      <h1 className="text-3xl font-bold mb-4 text-gray-500 px-5">
        Korean grammar TOPIK 1-6:
      </h1>

      <GrammarTitles lang="Korean" pTag="TOPIK_1" slug="/langs/korean/grammarpoint" />
      <GrammarTitles lang="Korean" pTag="TOPIK_2" slug="/langs/korean/grammarpoint" />
      <GrammarTitles lang="Korean" pTag="TOPIK_3" slug="/langs/korean/grammarpoint" />
      <GrammarTitles lang="Korean" pTag="TOPIK_4" slug="/langs/korean/grammarpoint" />
      <GrammarTitles lang="Korean" pTag="TOPIK_5" slug="/langs/korean/grammarpoint" />
      <GrammarTitles lang="Korean" pTag="TOPIK_6" slug="/langs/korean/grammarpoint" />
    </div>
  );
}

const encodeTitle = (title: string) => {
  return encodeURIComponent(title);
};

