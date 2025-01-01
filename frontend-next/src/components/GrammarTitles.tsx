import Link from "next/link";
import React from "react";

interface GrammarTitlesProps {
  lang: string;
  pTag: string;
  slug: string;
}

const GrammarTitles: React.FC<GrammarTitlesProps> = async ({ lang, pTag, slug}) => {
  console.log(lang);
  console.log(pTag);

  console.log('##################################  ENV VARS  #######################################');
  console.log(process.env.REACT_APP_HOST_IP);

  // we have SLASH workaround for Korean language, since it has lots of slashes, 
  // but google does not want to index these

  let apiUrl;
  // If REACT_APP_HOST_IP is defined, use it. Otherwise default to localhost:7000 for VM
  // use https when going via reverse proxy since it uses redirection from https in our configs, it is safer
  // curl -L -k https://localhost/e-api/v1/grammar-titles?p_tag=JLPT_N3
  // curl -L -k https://10.0.2.15/e-api/v1/grammar-titles?p_tag=JLPT_N3
  if (process.env.REACT_APP_HOST_IP) {
    apiUrl = `http://${process.env.REACT_APP_HOST_IP}:8000/e-api/v1/grammar-titles?p_tag=${pTag}`;
  } else {
    apiUrl = `http://localhost:8000/e-api/v1/grammar-titles?p_tag=${pTag}`;
  }


  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);

    const titles = data.titles;

    const encodeTitle = (title: string) => {
      //return encodeURIComponent(title);
      // WORKAROUND Replace slashes with dashes before encoding
      return encodeURIComponent(title.replace(/\//g, "-"));
    };

    return (
      <div className="mx-auto max-w-screen-xl px-5">
        <h2 className="text-2xl font-bold mb-4 py-8">
          {lang} grammar list for {pTag}:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {titles.map((title: any, index: any) => (
            <Link
              key={index}
              href={`${slug}/${encodeTitle(title)}`}
              className="p-4 border rounded-md shadow-md bg-gray-100 hover:bg-blue-100 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // or display an error message
  }
};

export default GrammarTitles;
