import GrammarTitles from "@/components/GrammarTitles";

export default async function Page() {

  return (
    <div className="mx-auto max-w-screen-xl">
      {/* <p>{data.titles}</p> */}

      <h1 className="text-3xl font-bold mb-4 text-gray-500 px-5">
        Vietnamese grammar overview:
      </h1>

      <GrammarTitles lang="Vietnamese" pTag="VIET" slug="/langs/vietnamese/grammarpoint" />
    </div>
  );
}

const encodeTitle = (title: string) => {
  return encodeURIComponent(title);
};

