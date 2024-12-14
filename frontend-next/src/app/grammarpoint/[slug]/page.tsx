// buttons must be imported as client components to server side rendered page
import PlayAudioButton from "@/components/PlayAudioButton";
// https://stackoverflow.com/questions/76309154/next-js-typeerror-failed-to-parse-url-from-when-targeting-api-route-relati
// https://stackoverflow.com/questions/44342226/next-js-error-only-absolute-urls-are-supported

//issue is communicating between containers
//https://blog.devgenius.io/api-calls-between-docker-instances-24124f5bf010
//https://stackoverflow.com/questions/44275794/how-can-one-docker-container-call-another-docker-container
//https://stackoverflow.com/questions/76244803/how-can-i-reach-my-localhost-from-nginx-docker-container

export default async function GrammarPoint({
  params,
}: {
  params: { slug: string };
}) {
  const decodedTitle = params.slug ? decodeURIComponent(params.slug) : "";
  //const url = "http://localhost:7000/api/v1/grammar-details";
  //const url = "/api/v1/grammar-details"

  //fetch will likely need full path to backend API
  // this can be a problem when running in container, how do we get to other container??

  //const url = 'http://192.168.1.15:7000/api/v1/grammar-details';
  //const url = 'http://192.168.1.15:7000/api/v1/grammar-details';

  //this looks amazing, we can inject host ip from docker compose declaration
  //so the code will be universal and can run on any server
  //we can even call to https where nginx listens and then ports are managed by proxy

  console.log('##################################  ENV VARS  #######################################');
  console.log(process.env.REACT_APP_HOST_IP);

  let apiUrl;
  // If REACT_APP_HOST_IP is defined, use it. Otherwise default to localhost:7000 for VM
  if (process.env.REACT_APP_HOST_IP) {
    apiUrl = `http://${process.env.REACT_APP_HOST_IP}/api/v1/grammar-details`;
  } else {
    apiUrl = `http://localhost:7000/api/v1/grammar-details`;
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

  // Log the entire data object by stringifying it
  console.log("Response Data:", JSON.stringify(data, null, 2));

  const grammarDetails = data.grammar;

  return (
    <>
      {/* <div className="px-5">Slug: {params.slug}</div> */}
      <div className="px-5">Decoded Slug: {decodedTitle}</div>

      <div className="flex flex-col items-left w-99 max-w-1400px h-auto overflow-hidden m-5 my-1 px-1 py-1">
        <h1 className="text-2xl font-bold mb-4 font-roboto">
          Japanese JLPT Grammar Point <br /> {decodedTitle}
        </h1>

        {grammarDetails && (
          <div className="flex flex-col items-center w-99 max-w-1400px h-auto border border-gray-300 rounded-lg shadow-md bg-slate-200 overflow-hidden m-3 my-4 px-6 py-8">
            <h2 className="text-xl font-bold mb-10">{grammarDetails.title}</h2>
            <div className="grid grid-cols-1 gap-4 w-full">
              <p className="text-lg font-bold">Short explanation:</p>
              <div className="text-lg mb-2">
                {grammarDetails.short_explanation}
              </div>

              <p className="text-lg font-bold mt-2">Formation:</p>
              <div className="text-lg mb-2">{grammarDetails.formation}</div>

              <div className="w-full">
                <p className="text-lg font-bold mb-2">Examples:</p>
                <div className="flex flex-col gap-4">
                  {grammarDetails.examples.map(
                    (example: any, index: number) => (
                      <div key={index} className="flex items-center mb-4">
                        <div className="flex items-start">
                          <PlayAudioButton audioSrc={example.grammar_audio} />
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <div className="text-lg font-normal mb-2">
                                {example.jp}
                              </div>
                            </div>
                            <div className="text-lg italic mb-2">
                              {example.romaji}
                            </div>
                            <div className="text-lg">{example.en}</div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="text-lg mb-2">
                <p className="font-bold">Long explanation:</p>
                <div>{grammarDetails.long_explanation}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
