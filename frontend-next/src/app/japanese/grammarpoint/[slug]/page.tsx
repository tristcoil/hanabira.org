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
    title: `Japanese JLPT Grammar Point: ${decodedTitle}`,
    description: `Learn about the Japanese JLPT grammar point "${decodedTitle}". This page provides a detailed explanation, examples, and usage.`,
  };
}

export default async function GrammarPoint({ params }: GrammarPointProps) {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

  const apiUrl = process.env.REACT_APP_HOST_IP
    ? `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/grammar-details`
    : `http://localhost:8000/e-api/v1/grammar-details`;

  const payload = { title: decodedTitle };

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
                <MarkdownContent lang="jap" slug={params.slug} />
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
  jp: string;
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
        Japanese JLPT Grammar Point
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
                  <p className="text-base text-gray-800">{example.jp}</p>
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

// ----------------------------------------------------------------------------------------------

// // GrammarPoint.tsx

// import { Metadata } from 'next';
// import MarkdownContent from "@/components-markdown/MarkdownContent";
// import PlayAudioButton from "@/components/PlayAudioButton";
// import FeaturesBanner from "@/components/FeaturesBanner";
// import GrammarBreadcrumb from "@/components/GrammarBreadcrumb";

// type GrammarPointProps = {
//   params: { slug: string };
// };

// // Generate dynamic metadata
// export async function generateMetadata({ params }: GrammarPointProps): Promise<Metadata> {
//   const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

//   return {
//     title: `Japanese JLPT Grammar Point: ${decodedTitle}`,
//     description: `Learn about the Japanese JLPT grammar point "${decodedTitle}". This page provides a detailed explanation, examples, and usage.`,
//   };
// }

// export default async function GrammarPoint({ params }: GrammarPointProps) {
//   const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

//   let apiUrl;
//   // If REACT_APP_HOST_IP is defined, use it; otherwise, default to localhost:8000
//   if (process.env.REACT_APP_HOST_IP) {
//     apiUrl = `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/grammar-details`;
//   } else {
//     apiUrl = `http://localhost:8000/e-api/v1/grammar-details`;
//   }

//   const payload = { title: decodedTitle };

//   const res = await fetch(apiUrl, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(payload),
//   });

//   const data = await res.json();
//   const grammarDetails = data.grammar;

//   return (
//     <>
//       <div className="container mx-auto p-1">
//         <FeaturesBanner />
//         <GrammarBreadcrumb decodedTitle={decodedTitle} />

//         <div className="bg-gray-100 shadow-lg rounded-lg p-2">
//           <h1 className="text-4xl font-bold mb-8 text-gray-900">
//             Japanese JLPT Grammar Point
//             <br />
//             {decodedTitle}
//           </h1>

//           {grammarDetails && (
//             <div className="bg-gray-200 border border-gray-300 rounded-lg p-2">
//               <h2 className="text-3xl font-semibold mb-10 text-gray-800">
//                 {grammarDetails.title}
//               </h2>
//               <div className="space-y-8">
//                 <div>
//                   <p className="text-xl font-semibold text-gray-800">Short explanation:</p>
//                   <div className="text-lg text-gray-700 mt-2">
//                     {grammarDetails.short_explanation}
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold text-gray-800">Formation:</p>
//                   <div className="text-lg text-gray-700 mt-2">
//                     {grammarDetails.formation}
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold text-gray-800 mb-2">Examples:</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
//                     {grammarDetails.examples.map((example: any, index: number) => (
//                       <div
//                         key={index}
//                         className="bg-white shadow-md rounded-lg p-2 transform transition-transform hover:scale-105"
//                       >
//                         <div className="flex items-start space-x-4">
//                           <PlayAudioButton
//                             audioSrc={example.grammar_audio}
//                             ariaLabel={`Play audio for example ${index + 1}`}
//                           />
//                           <div className="flex flex-col">
//                             <div className="text-xl text-gray-800 mb-2">
//                               {example.jp}
//                             </div>
//                             <div className="text-xs italic text-gray-600 mb-2">
//                               {example.romaji}
//                             </div>
//                             <div className="text-sm text-gray-700">
//                               {example.en}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xl font-semibold text-gray-800">Long explanation:</p>
//                   <div className="text-lg text-gray-700 mt-2">
//                     {grammarDetails.long_explanation}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Include the MarkdownContent component */}
//         <div className="mt-5 mb-5">
//           <p className="text-xl font-semibold text-gray-800">
//             Detailed Grammar notes:
//           </p>
//           <MarkdownContent lang="jap" slug={params.slug} />
//         </div>
//       </div>
//     </>
//   );
// }
