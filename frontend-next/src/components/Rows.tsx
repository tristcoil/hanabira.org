//'use client';    // SSR is quadrupling data in docker-compose for some reason

import MySpeakerWaveIcon from "./MySpeakerWaveIcon";
import { Fragment } from "react";

interface Props {
  p_dashboardId: string;
  s_dashboardId: string;
}

const Rows: React.FC<Props> = async ({ p_dashboardId, s_dashboardId }) => {
  // --- fetch data from backend API ---
  const pTag = p_dashboardId;
  const sTag = s_dashboardId;

  let apiUrl;
  if (process.env.REACT_APP_HOST_IP) {
    apiUrl = `http://${process.env.REACT_APP_HOST_IP}/api/v1/words?p_tag=${pTag}&s_tag=${sTag}`;
  } else {
    apiUrl = `/api/v1/words?p_tag=${pTag}&s_tag=${sTag}`;
  }

  // mystery solved:
  //when container is not PrintRounded, db seeds n+1 instance so thats why we get 4, 5, 6 duplications
  //lol

  // checked the API call
  //curl "http://localhost:8888/api/v1/words?p_tag=JLPT_N3&s_tag=i-adjective"
  //and it returns each sentence 6 times lol
  //so there is issue with the backend FcAnswers, maybe with backend FaSeedling, so need to investigate that
  // yes, something is wrong with backend seeding

  // something is wrong with database in container, this is behaving crazy on localhost
  //curl http://localhost:7000/api/v1/words?p_tag=JLPT_N3&s_tag=na-adjective
  //gives super long output
  // something is wrong with the seeding
  // looks more like some strange fragmented calls, backend is returning even only words
  // without sentences, but with curl it returns also sentences
  // i think something is wrong with SSR in vocab
  // in dev it works fine
  // try to make the call from parent page and just pass PropaneSharp, it might work
  // putting 2 minute sleep on frontend after db comes up doesnt work
  // so it is something else, db looks to be seeded fine as well

  console.log(apiUrl);
  //const response = await fetch(apiUrl, {next: {revalidate: 60}});             // force caching is bugged, shows many duplicates, revalidation also bugged
  const response = await fetch(apiUrl, { cache: "no-store" }); // force caching is bugged, shows many duplicates
  const data_payload = await response.json();
  const data = await data_payload.words;

  // IDEAL FOR PROD,
  // shows max 2 sentences on small screens,
  // shows all sentences on large ones
  return (
    <div className="w-full">
      {data.map((word: any) => {
        return (
          <Fragment key={word.vocabulary_japanese}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 p-4 rounded-md flex flex-col md:flex-row items-start md:items-top relative">
                <div className="flex items-start mr-4">
                  <div className="h-8 w-8 p-1 rounded-full flex items-center justify-center bg-white border">
                    <MySpeakerWaveIcon audio_path={word.vocabulary_audio} />
                  </div>
                  <div className="ml-2">
                    <h1 className="text-2xl font-medium leading-tight">
                      {word.vocabulary_japanese}
                    </h1>
                    <p className="text-sm text-gray-500 mb-1">
                      {word.vocabulary_simplified}
                    </p>
                    <p className="text-sm text-gray-500">
                      {word.vocabulary_english}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 md:relative md:top-auto md:right-auto md:flex-grow">
                  <p className="text-sm text-gray-500 text-right">
                    {word.word_type}
                  </p>
                </div>
              </div>
              <div className="grid gap-4">
                {word.sentences.map((sentence: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`bg-gray-200 p-4 rounded-md ${
                        index >= 2 &&
                        "hidden md:block" /* Hide extra sentences on small screens */
                      }`}
                    >
                      <div className="flex items-start mb-0">
                        <div className="h-8 w-8 p-1 rounded-full flex items-center justify-center bg-white border">
                          <MySpeakerWaveIcon
                            audio_path={sentence.sentence_audio}
                          />
                        </div>
                        <div className="ml-2">
                          <h1 className="text-lg font-medium leading-tight">
                            {sentence.sentence_japanese}
                          </h1>
                          <p className="text-sm text-gray-500 mb-1">
                            {sentence.sentence_simplified}
                          </p>
                          <p className="text-sm text-gray-500 mb-1">
                            {sentence.sentence_romaji}
                          </p>
                          <p className="text-sm text-gray-500">
                            {sentence.sentence_english}
                          </p>
                        </div>
                      </div>
                      {/* <img src={sentence.sentence_picture} className="w-full border-2 rounded-lg max-w-full" alt="" /> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Rows;
