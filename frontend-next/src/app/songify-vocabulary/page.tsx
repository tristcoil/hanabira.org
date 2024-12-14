import React from "react";

export default function LearningText() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Songify your vocabulary
      </h1>

      <h2 className="text-xl font-bold text-center mb-8">
        Experimental Approach: AI-Generated Songs for Vocabulary Learning, early prototype
      </h2>
      
      
      <div className="text-xs max-w-8xl mx-auto bg-white shadow-md rounded-md p-6">
        <p className="mb-4">
          This is a highly experimental approach to learning vocabulary, where
          we use AI to generate songs from example sentences. The idea is to
          combine auditory and contextual cues to make vocabulary retention more
          effective and engaging.
        </p>
        <p className="mb-4 text-red-500 font-semibold">
          However, this approach is very controversial. Generally hated in
          Japanese and Korean learning communities on Reddit :), but that is
          nothing new for Hanabira. We have many unusual learning features that
          are not widely accepted.
        </p>

        <p className="mb-4">
          Our experiments show that when we add romanization alongside Kanji
          text, the lyrics typically have correct pronunciation. We generate
          songs via{" "}
          <a
            href="https://suno.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Suno
          </a>
          . In the future, we plan to add a whole section with songs for
          difficult vocabulary, maybe even giving users some credits so they can
          generate songs for their challenging vocabulary. We take example
          sentences from our vocabulary sections here:{" "}
          <a
            href="https://hanabira.org/content"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Hanabira.org
          </a>
          .
        </p>

        <p className="mb-4">
          Feel free to hop into Hanabira Discord (link in the footer) to share
          your thoughts.
        </p>




        {/* <div className="bg-gray-100 p-4 rounded-md shadow-inner mt-5">
          <h2 className="text-xl font-semibold mb-4">
            Example Vocabulary: `貧しい / 가난한`
          </h2>
          <p className="text-gray-700 mb-4">
            Below is an example of an AI-generated song created using the
            sentences we explored earlier. This song uses sentences about the
            word <strong>貧しい</strong> (mazushii) in Japanese and{" "}
            <strong>가난한</strong> (ganahan) in Korean to craft lyrics:
          </p>


          <div className="text-center">
            <a
              href="https://suno.com/song/7cdd989a-7d71-44ce-a9f3-96643b345063"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Listen to the Song
            </a>
          </div>

        </div> */}



<div className="bg-gray-100 p-6 rounded-md shadow-inner mt-5">
  <h2 className="text-xl font-semibold mb-4">
    Example Vocabulary: `貧しい / 가난한`
  </h2>
  <p className="text-gray-700 mb-4">
    Below is an example of an AI-generated song created using the
    sentences we explored earlier. This song uses sentences about the word <strong>貧しい</strong> (mazushii) in Japanese and{" "}
    <strong>가난한</strong> (ganahan) in Korean to craft lyrics:
  </p>

  <div className="text-center mb-6">
    <a
      href="https://suno.com/song/7cdd989a-7d71-44ce-a9f3-96643b345063"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700"
    >
      Listen to the Song 0
    </a>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <a
      href="https://suno.com/song/b7b16b15-81ca-4fe8-9154-fe7bd7dfa3d8"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 text-center"
    >
      Song 1
    </a>
    <a
      href="https://suno.com/song/78f0bf89-7768-4699-bb5a-e0a8dbc7f34f"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 text-center"
    >
      Song 2
    </a>
    <a
      href="https://suno.com/song/64df0188-14e3-41e1-a851-cf02a81de19e"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-teal-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-700 text-center"
    >
      Song 3
    </a>
    <a
      href="https://suno.com/song/c6830f42-0d55-4566-b46c-fa97fd25e708"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 text-center"
    >
      Song 4
    </a>
    <a
      href="https://suno.com/song/cd5fb375-d9e3-4009-9fa5-efcbd2d1cd6f"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-900 text-center"
    >
      Doom Metal Vibes
    </a>
    <a
      href="https://suno.com/song/6aadeb17-c312-43ee-89ec-9f7d68fa0461"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-pink-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-pink-700 text-center"
    >
      Korean Synth Wave
    </a>
    <a
      href="https://suno.com/song/59729938-9aab-41a6-b1a4-f8151a0bc1a0"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-700 text-center"
    >
      Another Example
    </a>
    <div className="text-center mt-4">
      <a
        href="https://suno.com/@salsakey3784"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600"
      >
        More Examples by Hanabira
      </a>
    </div>
  </div>
</div>










      </div>

      <h3 className="text-3xl font-bold text-center mt-5 mb-5">
        Example sentences for: 貧しい / 가난한
      </h3>





      <div className="p-6">

  {/* Japanese Section */}
  <div className="mb-8">
    <h2 className="text-2xl font-semibold mb-4 text-center">Japanese</h2>
    <p className="text-gray-700 text-center mb-4">
      Learning Word: <strong>貧しい</strong>
    </p>
    <table className="w-full border border-gray-300 text-sm md:text-base">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-4 py-2 text-left">Japanese</th>
          <th className="border px-4 py-2 text-left">Romanization</th>
          <th className="border px-4 py-2 text-left">Translation</th>
        </tr>
      </thead>
      <tbody>
        {data.japanese.map((item, index) => (
          <tr key={index} className="even:bg-gray-100">
            <td className="border px-4 py-2">{item.text}</td>
            <td className="border text-xs px-4 py-2 italic">{item.romanization}</td>
            <td className="border text-sm px-4 py-2">{item.translation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Korean Section */}
  <div>
    <h2 className="text-2xl font-semibold mb-4 text-center">Korean</h2>
    <p className="text-gray-700 text-center mb-4">
      Learning Word: <strong>가난한</strong>
    </p>
    <table className="w-full border border-gray-300 text-sm md:text-base">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-4 py-2 text-left">Korean</th>
          <th className="border px-4 py-2 text-left">Romanization</th>
          <th className="border px-4 py-2 text-left">Translation</th>
        </tr>
      </thead>
      <tbody>
        {data.korean.map((item, index) => (
          <tr key={index} className="even:bg-gray-100">
            <td className="border px-4 py-2">{item.text}</td>
            <td className="border text-xs px-4 py-2 italic">{item.romanization}</td>
            <td className="border text-sm px-4 py-2">{item.translation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>






    </div>
  );
}

// ----------------------------------------------- //

const data = {
  japanese: [
    {
      text: "貧しい家庭で育ったが、彼は一生懸命働いて成功した。",
      romanization:
        "Mazushii katei de sodatta ga, kare wa isshoukenmei hataraite seikou shita.",
      translation:
        "He grew up in a poor family, but he worked hard and succeeded.",
    },
    {
      text: "貧しい国では、教育のアクセスが制限されることが多い。",
      romanization:
        "Mazushii kuni de wa, kyouiku no akusesu ga seigen sareru koto ga ooi.",
      translation: "In poor countries, access to education is often limited.",
    },
    {
      text: "貧しい地域では、飢餓や住宅問題に対処しなければならない。",
      romanization:
        "Mazushii chiiki de wa, kiga ya juutaku mondai ni taisho shinakereba naranai.",
      translation:
        "In poor areas, hunger and housing issues must be addressed.",
    },
    {
      text: "貧しい生活があったおかげで、私は何が大切かを理解している。",
      romanization:
        "Mazushii seikatsu ga atta okage de, watashi wa nani ga taisetsu ka o rikai shite iru.",
      translation:
        "Thanks to experiencing a poor life, I understand what is important.",
    },
    {
      text: "貧しい人々に対して助けを差し伸べるのは、私たちの責任です。",
      romanization:
        "Mazushii hitobito ni taishite tasuke o sashinoberu no wa, watashitachi no sekinin desu.",
      translation: "It is our responsibility to extend help to poor people.",
    },
  ],
  korean: [
    {
      text: "가난한 가정에서 자랐지만, 그는 열심히 일해서 성공했다.",
      romanization:
        "Ganahan gajeongeseo jaratjiman, geuneun yeolsimhi ilhaeseo seonggonghaetda.",
      translation:
        "He grew up in a poor family, but he worked hard and succeeded.",
    },
    {
      text: "가난한 나라에서는 교육 접근이 제한되는 경우가 많다.",
      romanization:
        "Ganahan naraeseoneun gyoyuk jeopgeuni jehandeuneun gyeonguga manhda.",
      translation: "In poor countries, access to education is often limited.",
    },
    {
      text: "가난한 지역에서는 기아나 주거 문제를 해결해야 한다.",
      romanization:
        "Ganahan jiyeogeseoneun giana jugeo munjereul haegyeolhaeya handa.",
      translation:
        "In poor areas, hunger and housing issues must be addressed.",
    },
    {
      text: "가난한 생활을 겪은 덕분에, 나는 무엇이 중요한지 이해하고 있다.",
      romanization:
        "Ganahan saenghwareul gyeogeun deokbune, naneun mueosi jungyohanji ihaehago itda.",
      translation:
        "Thanks to experiencing a poor life, I understand what is important.",
    },
    {
      text: "가난한 사람들에게 도움을 주는 것은 우리의 책임이다.",
      romanization:
        "Ganahan saramdeurege doumeul juneun geoseun urieui chaegimida.",
      translation: "It is our responsibility to extend help to poor people.",
    },
  ],
};
