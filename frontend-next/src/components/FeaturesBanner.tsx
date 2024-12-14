// 'use client';

import SocialShare from "./SocialShare";

const FeaturesBanner: React.FC = () => {
  
  const pageUrl = 'https://hanabira.org'; // Hanabira.org URL
  const pageTitle = 'Hanabira.org - Free Open-Source Self-Hostable No-Ads Japanese Learning Platform';
  
  return (
    <div className="text-xs w-full">
      {/* Existing Feature Banner */}
      <div
        className="bg-blue-100 border border-blue-300 text-blue-800 px-4 py-3 rounded relative mt-2 mb-2"
        role="alert"
      >
        <p>
          <strong className="font-bold">New Feature!</strong>{" "}
          <span className="block sm:inline">
            Japanese text parser works for custom texts and YouTube, acting as a reading assistant and translator.
          </span>{" "}
          <a
            href="/text-parser"
            className="underline font-semibold hover:text-blue-600 transition-colors"
          >
            Check it out!
          </a>
        </p>
        <p>
          <span className="block sm:inline">List of all Hanabira features</span>{" "}
          <a
            href="/"
            className="underline font-semibold hover:text-blue-600 transition-colors"
          >
            Check here.
          </a>
        </p>
      </div>

      {/* New Alert Section for Hanabira.org */}
      <div
        className="bg-orange-100 border border-orange-300 text-orange-800 px-4 py-3 rounded relative mt-2 mb-2"
        role="alert"
      >
        <p>
          <strong className="font-bold">Tell your friends!</strong>{" "}
          <span className="block sm:inline">
            Hanabira.org is a free, open-source, self-hostable portal with no ads. We rely on the community to help spread the word. Sharing the link helps the project immensely!
          </span>
        </p>
        <p className="mt-1 mb-3">
          <span className="block sm:inline">Support the project by sharing the link to</span>{" "}
          <a
            href="https://hanabira.org"
            className="underline font-semibold hover:text-orange-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            hanabira.org
          </a>{" "}on social media via links below!
        </p>

        <SocialShare url={pageUrl} title={pageTitle} />

      </div>
    </div>
  );
};

export default FeaturesBanner;
