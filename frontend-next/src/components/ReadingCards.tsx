// Import necessary libraries
import Link from "next/link";

// Define the type for reading card data
interface ReadingCardData {
  key: string;
  title: string;
  titleRomaji: string;
  titleJp: string;
  p_tag: string;
  s_tag: string;
  shortDescription: string;
}

// Sample data (you can fetch this from an API or database in a real app)
const readingCardsData: ReadingCardData[] = [
  {
    key: "jlpt_n3_reading_01",
    title: "The Zen Garden Mystery",
    titleRomaji: "Niwa no zen no nazo",
    titleJp: "庭の禅の謎",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A mystery unfolds in a peaceful Zen garden, where a student of Zen Buddhism uncovers a historical puzzle or message left in the garden’s stones.",
  },
  {
    key: "jlpt_n3_reading_02",
    title: "The Haiku Challenge",
    titleRomaji: "Haiku Charenji",
    titleJp: "俳句チャレンジ",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A character takes on the challenge to write a haiku every day, with each poem reflecting an aspect of their daily life and inner thoughts.",
  },
  {
    key: "jlpt_n3_reading_03",
    title: "A Samurai’s Dilemma in Modern Japan",
    titleRomaji: "Gendai Nihon ni okeru samurai no jirenma",
    titleJp: "現代日本における侍のジレンマ",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A samurai mysteriously wakes up in present-day Japan and must navigate the complexities of modern life while adhering to the bushido code. The contrast between old and new could help students learn various cultural expressions and idiomatic usage.",
  },
  {
    key: "jlpt_n3_reading_04",
    title: "The Ninja's Day Off",
    titleRomaji: "Ninja no Kyūjitsu",
    titleJp: "忍者の休日",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A comedic tale of a ninja who, on his day off, decides to tour modern Japan while trying to remain incognito, encountering various language mishaps along the way.",
  },
  {
    key: "jlpt_n3_reading_05",
    title: "Under the Cherry Blossoms",
    titleRomaji: "Sakura no shita de",
    titleJp: "桜の下で",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A romance that blooms during hanami (cherry blossom viewing) between two individuals from very different backgrounds. Their story is a metaphor for the fleeting beauty of the sakura and life's transient moments.",
  },
  {
    key: "jlpt_n3_reading_06",
    title: "The Samurai's Garden",
    titleRomaji: "Samurai no niwa",
    titleJp: "侍の庭",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A tale of a retired samurai who dedicates his life to creating the perfect garden. Each plant and rock placement contains historical significance and life lessons, which he shares with a young neighbor.",
  },
  {
    key: "jlpt_n3_reading_07",
    title: "The Time-Traveling Kimono",
    titleRomaji: "Toki o koeru kimono",
    titleJp: "時を超える着物",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A story about a vintage kimono that, when worn, transports the wearer to different periods in Japanese history. The protagonist must navigate historical events and return to the present day, using N3 grammar and vocabulary related to time, history, and traditional culture.",
  },
  {
    key: "jlpt_n3_reading_08",
    title: "The Haiku-Speaking Parrot",
    titleRomaji: "Haiku o Hanasu Ōmu",
    titleJp: "俳句を話すオウム",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A tale of a parrot that only speaks in the form of haikus, leading its owner to unravel a mystery guided by the cryptic poems. This would introduce students to the structure of haiku and incorporate seasonal words (kigo) and cutting words (kireji).",
  },
  {
    key: "jlpt_n3_reading_09",
    title: "A Samurai’s Dilemma",
    titleRomaji: "Samurai no Jirenma",
    titleJp: "侍のジレンマ",
    p_tag: "jlpt_n3",
    s_tag: "story",
    shortDescription:
      "A samurai is torn between duty and personal desires, set during the Edo period. The story would offer insight into the societal structure of the time and introduce terms related to samurai life, honor, and moral conflicts, all within the N3 level.",
  },

  // Add more cards here...
];

const ReadingCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {readingCardsData.map((card) => (
        <Link key={card.key} href={`/japanese/reading/${card.key}`} passHref>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg dark:hover:shadow-dark-lg transition-shadow cursor-pointer">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {card.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {card.titleRomaji}
            </p>
            <p className="text-gray-600 dark:text-gray-300">({card.titleJp})</p>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {card.shortDescription}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReadingCards;
