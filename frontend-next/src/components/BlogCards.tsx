import Link from "next/link";

interface BlogCardProps {
  id: string;
  name: string;
  link: string;
  file: string;
  description: string;
}

interface HeaderProps {
  title: string;
  subtitle: string;
}


interface BlogCardsProps {
  cards: BlogCardProps[];
  header: HeaderProps
}


const BlogCards = ({ cards, header }: BlogCardsProps) => {
  
  return (
    <div className="flex flex-col">
      <div className="p-7">
        <div className="w-full p-12 bg-white">
          <div className="flex items-end justify-between mb-12 header">
            <div className="title">
              <p className="mb-4 text-4xl font-bold text-gray-800">
                {header.title}
              </p>
              <p className="text-2xl font-light text-gray-400">
                {header.subtitle}
              </p>
            </div>
            <div className="text-end"></div>
          </div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="m-auto overflow-hidden rounded-lg shadow-lg cursor-pointer h-90 w-60 md:w-80"
              >
                <Link href={card.link} className="block w-full h-full">
                  <img
                    alt="blog photo"
                    src={card.file}
                    className="object-cover w-full max-h-40"
                  />
                </Link>
                <div className="w-full p-4 bg-white dark:bg-gray-800">
                  <p className="font-medium text-indigo-500 text-md"></p>
                  <p className="mb-2 text-xl font-medium text-gray-800 dark:text-white">
                  <Link href={card.link}>{card.name}</Link>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {card.description}
                  </p>
                  <div className="flex items-center mt-4">
                    <Link href={card.link} className="relative block">
                      <img
                        alt="profile"
                        src="/img/cover.jpg"
                        className="mx-auto object-cover rounded-full h-10 w-10 "
                      />
                    </Link>
                    {/* <Link href={card.link}>Read more</Link> */}
                    <div className="flex flex-col justify-between ml-4 text-sm">
                      <p className="text-gray-800 dark:text-white">hanabira</p>
                      {/* <p className="text-gray-400 dark:text-gray-300">
                        20 mars 2029 - 6 min read
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCards;