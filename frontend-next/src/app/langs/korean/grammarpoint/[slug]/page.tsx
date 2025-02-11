// pages/GrammarPoint.tsx

import { Metadata } from "next";
import MarkdownContent from "@/components-markdown/MarkdownContent";
import FeaturesBanner from "@/components/FeaturesBanner";
import GrammarBreadcrumb from "@/components/GrammarBreadcrumb";
//import GrammarExplanations from "@/components/GrammarExplanations";

type GrammarPointProps = {
  params: { slug: string };
};

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: GrammarPointProps): Promise<Metadata> {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

  return {
    title: `Korean Grammar Point: ${decodedTitle}`,
    description: `Learn about Korean grammar point "${decodedTitle}". This page provides a detailed explanation, examples, and usage.`,
  };
}

export default async function GrammarPoint({ params }: GrammarPointProps) {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

  console.log(`tshoot log:`)
  console.log(decodedTitle)


  const apiUrl = process.env.REACT_APP_HOST_IP
    ? `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/korean/grammar-details`
    : `http://localhost:8000/e-api/v1/korean/grammar-details`;

  //const payload = { title: decodedTitle };
  const payload = { title: decodedTitle.replace(/-/g, "/") };    
  // korean has lots of slashes but these are in uri converted to dash
  // so we need to revert in call to DB, so we can find the titles with slashes
  //const payload = { title: '이/가 [i/ga] (Subject markers)' };

  

  console.log(`tshoot log payload:`)
  console.log(payload)


  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // Handle error appropriately
    throw new Error("Failed to fetch grammar details");
  }

  const data = await res.json();
  const grammarDetails = data.grammar;

  return (
    <div className="min-h-screen bg-gray-50">
      <FeaturesBanner />
      <div className="container mx-auto px-1 py-4">
        <GrammarBreadcrumb decodedTitle={decodedTitle} />

        <div className="bg-gradient-to-br from-blue-50 to-gray-100 shadow-lg rounded-xl p-2 md:p-2 mt-4">
          {/* <h1 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4">
            Japanese JLPT Grammar Point
            <br />
            <span className="text-blue-600">{decodedTitle}</span>
          </h1> */}

          {grammarDetails ? (
            <>
              <GrammarExplanations grammarDetails={grammarDetails} />

              {/* Detailed Grammar Notes */}
              <div className="bg-white shadow-md rounded-lg p-2 md:p-2 mt-6">
                <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3">
                  Detailed Grammar Notes
                </h2>
                <MarkdownContent lang="kor" slug={params.slug} />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">
              Grammar details not found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------
// components/GrammarExplanations.tsx

import PlayAudioButton from "@/components/PlayAudioButton";

type Example = {
  kr: string;
  romaji: string;
  en: string;
  grammar_audio: string;
};

type GrammarDetails = {
  title: string;
  short_explanation: string;
  formation: string;
  examples: Example[];
  long_explanation: string;
};

type GrammarExplanationsProps = {
  grammarDetails: GrammarDetails;
};

const GrammarExplanations: React.FC<GrammarExplanationsProps> = ({
  grammarDetails,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-2 mb-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-600 mb-4">
        Korean Grammar Point
        <br />
        <span className="text-blue-600">{grammarDetails.title}</span>
      </h1>

      {/* <h2 className="text-xl md:text-2xl font-semibold text-blue-600 mb-3">
        {grammarDetails.title}
      </h2> */}

      <div className="space-y-4">
        {/* Short Explanation */}
        <section>
          <p className="italic text-gray-700">
            {grammarDetails.short_explanation}
          </p>
        </section>

        {/* Formation */}
        <section>
          <p className="text-sm md:text-base font-semibold text-gray-800">
            Formation
          </p>
          <p className="text-gray-700 mt-1">{grammarDetails.formation}</p>
        </section>

        {/* Examples */}
        <section>
          <p className="text-sm md:text-base font-semibold text-gray-800 mb-2">
            Examples
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grammarDetails.examples.map((example, index) => (
              <div
                key={index}
                className="bg-blue-50 p-3 rounded-md shadow-sm flex items-start space-x-3 hover:bg-blue-100 transition-colors"
              >
                <PlayAudioButton
                  audioSrc={example.grammar_audio}
                  ariaLabel={`Play audio for example ${index + 1}`}
                />
                <div>
                  <p className="text-base text-gray-800">{example.kr}</p>
                  <p className="text-xs italic text-gray-600">
                    {example.romaji}
                  </p>
                  <p className="text-sm text-gray-700 mt-0.5">{example.en}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Long Explanation */}
        <section>
          <p className="text-sm md:text-base font-semibold text-gray-800">
            Long Explanation
          </p>
          <p className="text-gray-700 mt-1">
            {grammarDetails.long_explanation}
          </p>
        </section>
      </div>
    </div>
  );
};

//export default GrammarExplanations;