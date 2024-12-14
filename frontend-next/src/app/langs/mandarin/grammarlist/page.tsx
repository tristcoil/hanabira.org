import GrammarTitles from "@/components/GrammarTitles";

export default async function Page() {

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* <p>{data.titles}</p> */}

      <h1 className="text-3xl font-bold mb-4 text-gray-500 px-5">
        Mandarin grammar HSK 1-6:
      </h1>

      <GrammarTitles lang="Mandarin" pTag="HSK_1" slug="/langs/mandarin/grammarpoint" />
      <GrammarTitles lang="Mandarin" pTag="HSK_2" slug="/langs/mandarin/grammarpoint" />
      <GrammarTitles lang="Mandarin" pTag="HSK_3" slug="/langs/mandarin/grammarpoint" />
      <GrammarTitles lang="Mandarin" pTag="HSK_4" slug="/langs/mandarin/grammarpoint" />
      <GrammarTitles lang="Mandarin" pTag="HSK_5" slug="/langs/mandarin/grammarpoint" />
      <GrammarTitles lang="Mandarin" pTag="HSK_6" slug="/langs/mandarin/grammarpoint" />
    </div>
  );
}

const encodeTitle = (title: string) => {
  return encodeURIComponent(title);
};

