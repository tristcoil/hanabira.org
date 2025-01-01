//'use client';

import Link from "next/link";
import React from "react";

import { ClockCircleOutlined } from "@ant-design/icons";
import { Timeline } from "antd";

export default function About() {
  return (
    <div className="grid lg:grid-cols-body p-5">
      <br></br>
      <br></br>
      <div className="lg:col-span-10">

        <h1 className="text-blue-900 text-3xl font-bold">About Hanabira</h1>

        <div className="grid grid-cols-3 gap-8 text-center m-8">
          <div className="text-xl font-semibold text-slate-500">
            <p>花びらが</p>
            <p>風に舞うよ</p>
            <p>春の歌</p>
          </div>
          <div className="text-lg text-gray-400">
            <p>Hanabira ga</p>
            <p>Kaze ni mau yo</p>
            <p>Haru no uta</p>
          </div>
          <div className="text-base text-gray-400">
            <p>Petals dancing</p>
            <p>In the wind gracefully</p>
            <p>Song of the spring.</p>
          </div>
        </div>

        <div className="mt-2 text-gray-500">
          Hanabira is Free Open Source Japanese language learning website that
          aims to prepare students for JLPT N5-N1. Enjoy studying Japanese
          without ads and popups. Currently we are offering Grammar explanation
          for all JLPT levels. Additionally we have several JLPT vocabulary
          related sections. All lessons contain audio voiceovers for vocabulary,
          grammar and example sentences. Other features will be implemented in
          the future. Please see roadmap below.
        </div>

        <br></br>

        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Contribute to Hanabira.org</p>
          <p>
            Hanabira.org lead dev has set aside several hundred dollars
            (monthly) for meaningful contributions to the project. We welcome
            developers, designers, and content creators to join us in
            enhancing our platform. Your innovative ideas and contributions
            can make a significant impact to the project.
          </p>
        </div>

        <br></br>

        <h2 className="font-serif text-2xl antialiased text-gray-600">
          Project timeline:
        </h2>
        <br />
        <div className="mt-2 text-gray-500">
          Public Alpha version. This site is currently undergoing active
          development. We are working diligently to improve the platform and add
          new features. As a result, you may encounter occasional bugs,
          inconsistencies, or limited functionality. You can support the
          development by buying us a coffee.
        </div>
        <br />

        <div className="max-w-5xl bg-gray-50">
          <Timeline
            mode="alternate"
            items={[
              {
                children: "Create Japanese JLPT N5-N2 Grammar sections.",
              },
              {
                children: "Create Japanese JLPT N5-N2 Vocabulary sections.",
                color: "green",
              },
              {
                dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                children: `Add Kanji with only one reading sections for JLPT N5-N2`,
              },
              {
                color: "red",
                children:
                  "Reading section for Japanese JLPT N3 stories (including audio)",
              },
              {
                children: "Grammar explanation of texts from reading section.",
              },
              {
                children: "Google based login for free users.",
              },
              {
                children:
                  "Spaced Repetition System (SRS) for learning Vocabulary, Grammar and Kanji.",
              },
              {
                dot: <ClockCircleOutlined style={{ fontSize: "16px" }} />,
                children: "Adding Grammar and Vocabulary for Korean language.",
              },
            ]}
          />
        </div>

        <div className="p-4 md:p-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Contact Us
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            If you have any questions or need more information, feel free to
            reach out to us. We welcome your feedback, bug reports and feature
            requests. Currently the site is in Public Alpha, so there are lots
            of bugs that we are already aware of.
          </p>
          <div className="mt-4">
            <a
              href="https://www.reddit.com/r/hanabira/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Hanabira Project Subreddit
            </a>
            <br />
            <a
              href="https://www.reddit.com/user/tcoil_443"
              className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
            >
              Lead Developer on Reddit
            </a>
            <br />
            <a
              href="https://discord.gg/afefVyfAkH"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Hanabira Discord server
            </a>
            <br />
            <a
              href="https://github.com/tristcoil/hanabira.org"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Hanabira GitHub repo
            </a>
          </div>

        </div>

        <div className="p-4 md:p-6 bg-white dark:bg-gray-800">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            Pricing - Free
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Currently all content is free. And all content will be free for a long
            time. Vast majority of content will be free forever.
            Project is open sourced, so anyone can spin up their own Hanabira server.
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            It is possible that in the future certain features will be paid on main production hanabira.org platform to
            keep servers running and to recuperate development costs. But even in such case lots of features will
            remain freely available forever. Functionality that might become
            premium covers user specific features, such as progress tracking,
            word banks, SRS flashcards, ...
            Anyways, you can always slightly tweak the source code and you have full functionality for free.
          </p>
        </div>

        <div>
          <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <h2 className="font-semibold text-2xl mb-5 border-b pb-2 border-gray-300">
              Sources & Literature:
            </h2>

            <h3 className="font-semibold text-xl mb-5 border-b pb-2 border-gray-300">
              Japanese
            </h3>

            <ul className="pl-5 space-y-3">
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Nihongo So Matome
                JLPT N2 series
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Nihongo So Matome
                JLPT N3 series
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Nihongo So Matome
                JLPT N4 series
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Nihongo So Matome
                JLPT N5 series
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> 600 Basic Japanese
                Verbs, Tuttle Publishing
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> New Kanzen Master
                JLPT N3 Tango Word Book (Shin Kanzen Master: JLPT N3 1800
                Important Vocabulary Words)
              </li>
            </ul>

            <h3 className="font-semibold text-xl mb-5 border-b pb-2 border-gray-300">
              Vietnamese
            </h3>
            <ul>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Let&apos;s speak
                Vietnamese (Binh Nhu Ngo)
              </li>
              <li className="py-1 transition-colors duration-300 hover:bg-gray-50 rounded-md pl-3">
                <span className="text-blue-500 pr-2">•</span> Vietnamese as a
                second language (Hue Van Nguyen)
              </li>
            </ul>
          </div>
        </div>

        <div>
          <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <h2 className="font-semibold text-2xl mb-5 border-b pb-2 border-gray-300">
              Web Sources:
            </h2>

            <h3 className="font-semibold text-xl mb-5 border-b pb-2 border-gray-300">
              Japanese:
            </h3>

            <p>
              <strong>JLPT level vocabulary and kanji lists</strong> taken from 
              <a
                href="https://www.tanos.co.uk/jlpt/"
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tanos.co.uk
              </a>
            </p>

            <p className="mt-2">
              license: Creative
              Commons BY -
              <a
                href="https://www.tanos.co.uk/jlpt/sharing/"
                className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                License Details
              </a>
            </p>
          </div>

          {/* <Example /> */}





{/* # Kanjidic 
we are using kanji dictionary from
https://www.edrdg.org/wiki/index.php/KANJIDIC_Project

we took this file:
the KANJIDIC2 file, which is in XML format and Unicode/UTF-8 coding, and contains information about all 13,108 kanji. (download)
http://www.edrdg.org/kanjidic/kanjidic2.xml.gz

then we extract it to xml file

then we use our own python script to convert it to json file so it is easier to process
json will have 50 MB */}


<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Kanjidic Project</h1>
      <p className="text-gray-700 mb-2">
        We are using the kanji dictionary from the 
        <a 
          href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          KANJIDIC Project
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        We took the KANJIDIC2 file, which is in XML format, encoded in Unicode/UTF-8, and contains information about all 13,108 kanji. You can download the file 
        <a 
          href="http://www.edrdg.org/kanjidic/kanjidic2.xml.gz" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        After downloading, we extract the file to XML format. Then, we use our custom Python script to convert it to a JSON file for easier processing. The resulting JSON file is approximately 50 MB in size.
      </p>
    </div>






{/* # Radicals radkfile 
https://www.edrdg.org/krad/kradinf.html


Copyright
The RADKFILE and KRADFILE files are copright and available under the EDRDG Licence. 
The copyright of the RADKFILE2 and KRADFILE2 files is held by Jim Rose.
Jim Breen

well, I need to read more about the licence, it might not allow commercial use
https://www.edrdg.org/edrdg/licence.html


The dictionary files are made available under a Creative Commons Attribution-ShareAlike Licence (V4.0). 


RADKFILE/KRADFILE - files relating to the decomposition of the 6,355 kanji in JIS X 0208 into their visible components.
radkfile2/kradkfile2 is copyright by Jim Breen - but we are not using these specific files */}


<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Radicals - RADKFILE</h1>
      <p className="text-gray-700 mb-2">
        For more information on RADKFILE, visit 
        <a 
          href="https://www.edrdg.org/krad/kradinf.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          this page
        </a>.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Copyright</h2>
      <p className="text-gray-700 mb-2">
        The RADKFILE and KRADFILE files are copyrighted and available under the EDRDG Licence. The copyright for RADKFILE2 and KRADFILE2 is held by Jim Rose and Jim Breen.
      </p>
      <p className="text-gray-700 mb-2">
        Please note that the licence might not allow commercial use. You can read more about the licence 
        <a 
          href="https://www.edrdg.org/edrdg/licence.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">License Information</h2>
      <p className="text-gray-700 mb-2">
        The dictionary files are made available under a Creative Commons Attribution-ShareAlike Licence (V4.0).
      </p>
      <p className="text-gray-700 mb-2">
        The RADKFILE/KRADFILE files relate to the decomposition of the 6,355 kanji in JIS X 0208 into their visible components. However, please note that the RADKFILE2/KRADFILE2 files, which are copyrighted by Jim Breen, are not being used in our project.
      </p>
    </div>








{/* # Mecab
mecab apt package

mecab-async - https://www.npmjs.com/package/mecab-async - MIT Licence */}


<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mecab</h1>
      <p className="text-gray-700 mb-2">
        We are using the Mecab package available through the apt package manager.
      </p>
      <p className="text-gray-700 mb-2">
        Additionally, we are utilizing 
        <a 
          href="https://www.npmjs.com/package/mecab-async" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          mecab-async
        </a>, 
        an NPM package licensed under the MIT License.
      </p>
    </div>





{/* # KUROSHIRO Parser 

https://kuroshiro.org/
https://github.com/hexenq/kuroshiro

MIT licence
it is node package */}

<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">KUROSHIRO Parser</h1>
      <p className="text-gray-700 mb-2">
        The KUROSHIRO Parser is a powerful tool for converting Japanese text into various forms. For more details, visit the official website at 
        <a 
          href="https://kuroshiro.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          kuroshiro.org
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        The source code is available on GitHub at 
        <a 
          href="https://github.com/hexenq/kuroshiro" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          github.com/hexenq/kuroshiro
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        KUROSHIRO is a Node.js package and is licensed under the MIT License.
      </p>
    </div>






{/* # JMDIC 

https://www.edrdg.org/jmdict/j_jmdict.html
https://www.edrdg.org/edrdg/licence.html

Licence:
The dictionary files are made available under a Creative Commons Attribution-ShareAlike Licence (V4.0). The Licence Deed can be viewed here, and the full Licence Code is here.
For the EDICT, JMdict and KANJIDIC files, the following URLs may be used or quoted:
https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project
https://www.edrdg.org/wiki/index.php/KANJIDIC_Project

unable to download files from theese old sites, full of errors

but found this repo under MIT licence (just the code) (jmdic for yomitan), frequently updated
https://github.com/themoeway/jmdict-yomitan?tab=readme-ov-file
so downloaded jmdict file from there (without example tatoeba sentences)
next time we can download the bigger file as well

Licence (jmdict for yomitan):
The code in this repository is licensed under the MIT license. 
The released dictionaries are licensed under the Creative Commons Attribution-ShareAlike Licence (V4.0) that JMdict is. */}

<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">JMDICT</h1>
      <p className="text-gray-700 mb-2">
        The JMDict files are available under a Creative Commons Attribution-ShareAlike Licence (V4.0). You can view the Licence Deed 
        <a 
          href="https://www.edrdg.org/edrdg/licence.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>, and the full Licence Code 
        <a 
          href="https://www.edrdg.org/edrdg/licence.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        For the EDICT, JMdict, and KANJIDIC files, you may use or quote the following URLs:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            <a 
              href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              JMdict-EDICT Dictionary Project
            </a>
          </li>
          <li>
            <a 
              href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline"
            >
              KANJIDIC Project
            </a>
          </li>
        </ul>

      <p className="text-gray-700 mb-2">
        Unfortunately, we encountered issues downloading files from these older sites due to errors. However, we found a repository under the MIT License for JMDict (used for Yomitan) that is frequently updated. You can check it out 
        <a 
          href="https://github.com/themoeway/jmdict-yomitan?tab=readme-ov-file" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        We downloaded the JMDict file from that repository, which does not include example sentences from Tatoeba. In the future, we may download the larger file as well.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Licence (JMDict for Yomitan)</h2>
      <p className="text-gray-700 mb-2">
        The code in the JMDict for Yomitan repository is licensed under the MIT License. The released dictionaries are licensed under the Creative Commons Attribution-ShareAlike Licence (V4.0), the same as JMdict.
      </p>
    </div>


{/* # Radicals + KRADFILE

radical meanings taken from wikipedia:

# source:
# https://en.wikipedia.org/wiki/List_of_kanji_radicals_by_stroke_count

KRADFILE 
https://www.edrdg.org/krad/kradinf.html
The RADKFILE and KRADFILE files are copright and available under the EDRDG Licence. The copyright of the RADKFILE2 and KRADFILE2 files is held by Jim Rose.

the EDRDG licence:
https://www.edrdg.org/edrdg/licence.html

here are sample attribution texts:
https://www.edrdg.org/edrdg/sample.html

we are using just KRADFILE (NOT KRADFILE2, so we are good with licence) */}

<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Radicals + KRADFILE</h1>
      <p className="text-gray-700 mb-2">
        The meanings of the radicals used in our project are sourced from Wikipedia. You can view the full list of kanji radicals by stroke count 
        <a 
          href="https://en.wikipedia.org/wiki/List_of_kanji_radicals_by_stroke_count" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-2">KRADFILE</h2>
      <p className="text-gray-700 mb-2">
        We are using the KRADFILE for our project. More information about KRADFILE can be found 
        <a 
          href="https://www.edrdg.org/krad/kradinf.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        The RADKFILE and KRADFILE files are copyrighted and available under the EDRDG Licence. The copyright for RADKFILE2 and KRADFILE2 is held by Jim Rose. However, we are only using KRADFILE (not KRADFILE2), so we are in compliance with the licence.
      </p>
      <p className="text-gray-700 mb-2">
        For more information on the EDRDG licence, you can visit 
        <a 
          href="https://www.edrdg.org/edrdg/licence.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          this link
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        Sample attribution texts for using these files under the licence can be found 
        <a 
          href="https://www.edrdg.org/edrdg/sample.html" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
    </div>


{/* # JAMDICT 

MIT licence 

https://pypi.org/project/jamdict/
https://github.com/tristcoil/jamdict?tab=readme-ov-file */}


<div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">JAMDICT</h1>
      <p className="text-gray-700 mb-2">
        JAMDICT is a Python package for working with Japanese dictionary files. It is licensed under the MIT License.
      </p>
      <p className="text-gray-700 mb-2">
        For more information, you can visit the package page on PyPI 
        <a 
          href="https://pypi.org/project/jamdict/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
      <p className="text-gray-700 mb-2">
        The source code and additional details can be found on GitHub 
        <a 
          href="https://github.com/tristcoil/jamdict?tab=readme-ov-file" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          here
        </a>.
      </p>
    </div>



    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Kanji Radicals</h1>
      <p className="text-gray-700 mb-2">
        List of Kanji Radicals sourced from 
        <a 
          href="https://en.wikipedia.org/wiki/List_of_kanji_radicals_by_stroke_count" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline ml-1"
        >
          Wikipedia
        </a>.
      </p>
    </div>
        </div>
      </div>
    </div>
  );
}





const stats = [
  { label: 'Founded', value: '2021' },
  { label: 'Employees', value: '37' },
  { label: 'Countries', value: '12' },
  { label: 'Raised', value: '$25M' },
]

function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-4">
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 pb-9 pt-64 shadow-2xl sm:px-12 lg:max-w-lg lg:px-8 lg:pb-8 xl:px-10 xl:pb-10">
              <img
                className="absolute inset-0 h-full w-full object-cover brightness-125 saturate-0"
                src="https://images.unsplash.com/photo-1630569267625-157f8f9d1a7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2669&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
              <div
                className="absolute left-1/2 top-1/2 -ml-16 -translate-x-1/2 -translate-y-1/2 transform-gpu blur-3xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-40"
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                />
              </div>
              <figure className="relative isolate">
                <svg
                  viewBox="0 0 162 128"
                  fill="none"
                  aria-hidden="true"
                  className="absolute -left-2 -top-4 -z-10 h-32 stroke-white/20"
                >
                  <path
                    id="0ef284b8-28c2-426e-9442-8655d393522e"
                    d="M65.5697 118.507L65.8918 118.89C68.9503 116.314 71.367 113.253 73.1386 109.71C74.9162 106.155 75.8027 102.28 75.8027 98.0919C75.8027 94.237 75.16 90.6155 73.8708 87.2314C72.5851 83.8565 70.8137 80.9533 68.553 78.5292C66.4529 76.1079 63.9476 74.2482 61.0407 72.9536C58.2795 71.4949 55.276 70.767 52.0386 70.767C48.9935 70.767 46.4686 71.1668 44.4872 71.9924L44.4799 71.9955L44.4726 71.9988C42.7101 72.7999 41.1035 73.6831 39.6544 74.6492C38.2407 75.5916 36.8279 76.455 35.4159 77.2394L35.4047 77.2457L35.3938 77.2525C34.2318 77.9787 32.6713 78.3634 30.6736 78.3634C29.0405 78.3634 27.5131 77.2868 26.1274 74.8257C24.7483 72.2185 24.0519 69.2166 24.0519 65.8071C24.0519 60.0311 25.3782 54.4081 28.0373 48.9335C30.703 43.4454 34.3114 38.345 38.8667 33.6325C43.5812 28.761 49.0045 24.5159 55.1389 20.8979C60.1667 18.0071 65.4966 15.6179 71.1291 13.7305C73.8626 12.8145 75.8027 10.2968 75.8027 7.38572C75.8027 3.6497 72.6341 0.62247 68.8814 1.1527C61.1635 2.2432 53.7398 4.41426 46.6119 7.66522C37.5369 11.6459 29.5729 17.0612 22.7236 23.9105C16.0322 30.6019 10.618 38.4859 6.47981 47.558L6.47976 47.558L6.47682 47.5647C2.4901 56.6544 0.5 66.6148 0.5 77.4391C0.5 84.2996 1.61702 90.7679 3.85425 96.8404L3.8558 96.8445C6.08991 102.749 9.12394 108.02 12.959 112.654L12.959 112.654L12.9646 112.661C16.8027 117.138 21.2829 120.739 26.4034 123.459L26.4033 123.459L26.4144 123.465C31.5505 126.033 37.0873 127.316 43.0178 127.316C47.5035 127.316 51.6783 126.595 55.5376 125.148L55.5376 125.148L55.5477 125.144C59.5516 123.542 63.0052 121.456 65.9019 118.881L65.5697 118.507Z"
                  />
                  <use href="#0ef284b8-28c2-426e-9442-8655d393522e" x={86} />
                </svg>
                <img src="https://tailwindui.com/img/logos/workcation-logo-white.svg" alt="" className="h-12 w-auto" />
                <blockquote className="mt-6 text-xl font-semibold leading-8 text-white">
                  <p>
                    “Amet amet eget scelerisque tellus sit neque faucibus non eleifend. Integer eu praesent at a. Ornare
                    arcu gravida natoque erat et cursus tortor.”
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-sm leading-6 text-gray-300">
                  <strong className="font-semibold text-white">Judith Rogers,</strong> CEO at Workcation
                </figcaption>
              </figure>
            </div>
          </div>
          <div>
            <div className="text-base leading-7 text-gray-700 lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-indigo-600">Company values</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                On a mission to empower remote teams
              </h1>
              <div className="max-w-xl">
                <p className="mt-6">
                  Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
                  vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
                  erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
                  semper sed amet vitae sed turpis id.
                </p>
                <p className="mt-8">
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie
                  auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices
                  hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
                <p className="mt-8">
                  Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie
                  auctor fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices
                  hac adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
                </p>
              </div>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4">
              {stats.map((stat, statIdx) => (
                <div key={statIdx}>
                  <dt className="text-sm font-semibold leading-6 text-gray-600">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-bold leading-10 tracking-tight text-gray-900">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex">
              <a href="#" className="text-base font-semibold leading-7 text-indigo-600">
                Learn more about our company <span aria-hidden="true">&rarr;</span>
              </a>
            </div>

            Japanology related resources:

            Doporučená literatura
            Literatura doporučená pro přípravu ke studiu:

            https://www.muni.cz/bakalarske-a-magisterske-obory/24559-japanistika

            Bařinka, J. (ed.): Kulturní tradice Dálného východu. Praha, Odeon, 1980.
            Boháčková L., Winkelhöferová: Vějíř a meč. Praha, Albatros, 1984.
            Collcutt, M. a kol.: Svět Japonska. Přel. Duroňová, R. Praha, Knižní klub, 1997.
            Earhart, H. B.: Náboženství Japonska – Mnoho tradic na jedné svaté cestě. Přel. Heřman, R. Praha, Prostor, 1998.
            Henshall, K. G.: A Guide to Learning Hiragana & Katakana. Tuttle Publishing, 1990.
            Janoš, J.: 99 zajímavostí z Japonska. Praha, Albatros, 1984.
            Kodžiki – Kronika dávného Japonska. Přel. Fiala, K. Praha, ExOriente, 2012.
            Kraemerová, A.: Jak komunikovat s Japonci aneb Nebuďme xenofobní. Praha, Scriptorium, 2013.
            Labus, D.: Japonsko. Stručná historie států. Praha, Libri, 2009.
            Líman, A.: Kouzlo šerosvitu. Praha, DharmaGaia, 2008.
            Líman, A.: Krajiny japonské duše. Praha, Mladá fronta, 2000.
            Líman, A.: Mezi nebem a zemí. Praha, Academia, 2001.
            Mason, R., Caiger, J.: Dějiny Japonska. Přel. Müllerová, P. Praha, Fighters Publications, 2007.
            Nymburská, D., Vostrá, D., Sawatari, M.: Japonština. Praha, Leda, 2007.
            Reischauer, E., Craig, A.: Dějiny Japonska. Přel. Labus, D., Sýkora, J. Praha, Lidové noviny, 2000.
            Sýkora, J.: Ekonomické myšlení v Japonsku. Praha, FF UK, 2010.
            Švarcová, Z.: Japonská literatura 712–1868. Praha, Karolinum, 2005.
            Vasiljevová, Z.: Dějiny Japonska. Praha, Nakladatelství Svoboda, 1986.
            Winkelhöferová, V.: Slovník japonské literatury. Praha, Libri, 2008.


          </div>
        </div>
      </div>
    </div>
  )
}
