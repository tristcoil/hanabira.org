import GrammarTitles from "@/components/GrammarTitles";

export default async function Page() {

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* <p>{data.titles}</p> */}

      <h1 className="text-3xl font-bold mb-4 text-gray-500 px-5">
        Thai grammar CU-TFL 1-5:
      </h1>

      <GrammarTitles lang="Thai" pTag="CU-TFL_1" slug="/langs/thai/grammarpoint" />
      <GrammarTitles lang="Thai" pTag="CU-TFL_2" slug="/langs/thai/grammarpoint" />
      <GrammarTitles lang="Thai" pTag="CU-TFL_3" slug="/langs/thai/grammarpoint" />
      <GrammarTitles lang="Thai" pTag="CU-TFL_4" slug="/langs/thai/grammarpoint" />
      <GrammarTitles lang="Thai" pTag="CU-TFL_5" slug="/langs/thai/grammarpoint" />
    </div>
  );
}

const encodeTitle = (title: string) => {
  return encodeURIComponent(title);
};

