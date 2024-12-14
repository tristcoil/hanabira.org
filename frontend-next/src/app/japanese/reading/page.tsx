import ReadingCards from "@/components/ReadingCards";

export default function Reading() {
  return (
    <>
      <div className="dark:bg-gray-900 dark:text-white">
        <div className="p-4">
          <h1 className="text-3xl text-black dark:text-white font-bold mb-2">
            Japanese Reading Section
          </h1>
          <p className="text-sm text-black dark:text-white mb-4">
            Explore our collection of Japanese short stories, each featuring
            audio, romaji, and English translations. Delve into detailed
            sentence-by-sentence explanations along with grammar insights and
            related vocabulary to enhance your learning experience.
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen relative">
          <ReadingCards />
        </div>
      </div>
    </>
  );
}
