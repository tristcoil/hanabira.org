
// GrammarPoint.tsx

import { Metadata } from 'next';
import MarkdownContent from "@/components-markdown/MarkdownContent";
import PlayAudioButton from "@/components/PlayAudioButton";
import FeaturesBanner from "@/components/FeaturesBanner";
import GrammarBreadcrumb from "@/components/GrammarBreadcrumb";

type GrammarPointProps = {
  params: { slug: string };
};

// Generate dynamic metadata
export async function generateMetadata({ params }: GrammarPointProps): Promise<Metadata> {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

  return {
    title: `Japanese JLPT Grammar Point: ${decodedTitle}`,
    description: `Learn about the Japanese JLPT grammar point "${decodedTitle}". This page provides a detailed explanation, examples, and usage.`,
  };
}

export default async function GrammarPoint({ params }: GrammarPointProps) {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";

  let apiUrl;
  // If REACT_APP_HOST_IP is defined, use it; otherwise, default to localhost:8000
  if (process.env.REACT_APP_HOST_IP) {
    apiUrl = `http://${process.env.REACT_APP_HOST_IP}/api/v1/grammar-details`;
  } else {
    apiUrl = `http://localhost:8000/api/v1/grammar-details`;
  }

  const payload = { title: decodedTitle };

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  const grammarDetails = data.grammar;

  return (
    <>
      <div className="container mx-auto p-1">
        <FeaturesBanner />
        <GrammarBreadcrumb decodedTitle={decodedTitle} />

        <div className="bg-gray-100 shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">
            Japanese JLPT Grammar Point
            <br />
            {decodedTitle}
          </h1>

          {grammarDetails && (
            <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
              <h2 className="text-3xl font-semibold mb-10 text-gray-800">
                {grammarDetails.title}
              </h2>
              <div className="space-y-8">
                <div>
                  <p className="text-xl font-semibold text-gray-800">Short explanation:</p>
                  <div className="text-lg text-gray-700 mt-2">
                    {grammarDetails.short_explanation}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-800">Formation:</p>
                  <div className="text-lg text-gray-700 mt-2">
                    {grammarDetails.formation}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-800 mb-2">Examples:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {grammarDetails.examples.map((example: any, index: number) => (
                      <div
                        key={index}
                        className="bg-white shadow-md rounded-lg p-6 transform transition-transform hover:scale-105"
                      >
                        <div className="flex items-start space-x-4">
                          <PlayAudioButton
                            audioSrc={example.grammar_audio}
                            ariaLabel={`Play audio for example ${index + 1}`}
                          />
                          <div className="flex flex-col">
                            <div className="text-xl text-gray-800 mb-2">
                              {example.jp}
                            </div>
                            <div className="text-xs italic text-gray-600 mb-2">
                              {example.romaji}
                            </div>
                            <div className="text-sm text-gray-700">
                              {example.en}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xl font-semibold text-gray-800">Long explanation:</p>
                  <div className="text-lg text-gray-700 mt-2">
                    {grammarDetails.long_explanation}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Include the MarkdownContent component */}
        <div className="mt-5 mb-5">
          <p className="text-xl font-semibold text-gray-800">
            Detailed Grammar notes:
          </p>
          <MarkdownContent lang="jap" slug={params.slug} />
        </div>
      </div>
    </>
  );
}


















// ----------------------------------------------------------------------------------------------

// // PRODUCTION SSR CODE

// import MarkdownContent from "@/components-markdown/MarkdownContent";

// import PlayAudioButton from "@/components/PlayAudioButton";
// import FeaturesBanner from "@/components/FeaturesBanner";
// import GrammarBreadcrumb from "@/components/GrammarBreadcrumb";


// export default async function GrammarPoint({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";


//   let apiUrl;
//   // If REACT_APP_HOST_IP is defined, use it. Otherwise default to localhost:7000 for VM
//   if (process.env.REACT_APP_HOST_IP) {
//     apiUrl = `http://${process.env.REACT_APP_HOST_IP}/api/v1/grammar-details`;
//   } else {
//     apiUrl = `http://localhost:8000/api/v1/grammar-details`;
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

//   // Log the entire data object by stringifying it
//   console.log("Response Data:", JSON.stringify(data, null, 2));
//   const grammarDetails = data.grammar;


//   return (
//     <>
//       <div className="container mx-auto p-1">

//         <FeaturesBanner />
//         <GrammarBreadcrumb decodedTitle={decodedTitle} />


//         <div className="bg-gray-100 shadow-lg rounded-lg p-8">
//           <h1 className="text-4xl font-bold mb-8 text-gray-900">
//             Japanese JLPT Grammar Point
//             <br />
//             {decodedTitle}
//           </h1>

//           {grammarDetails && (
//             <div className="bg-gray-200 border border-gray-300 rounded-lg p-8">
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
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {grammarDetails.examples.map((example: any, index: number) => (
//                       <div
//                         key={index}
//                         className="bg-white shadow-md rounded-lg p-6 transform transition-transform hover:scale-105"
//                       >
//                         <div className="flex items-start space-x-4">
//                           <PlayAudioButton audioSrc={example.grammar_audio} />
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
//           <MarkdownContent lang='jap' slug={params.slug} />
//         </div>

//       </div>
//     </>
//   );

// }










