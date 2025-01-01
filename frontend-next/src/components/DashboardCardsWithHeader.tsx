import Link from "next/link";
import Image, { StaticImageData } from "next/image";

// we need this for small logo in the card
import jlpt_universal_01 from "@public/img/jlpt_universal_01.jpg";

interface DashboardCardsProps {
  id: string;
  name: string;
  link: string;
  file: StaticImageData;
  description: string;
}

interface HeadlineProps {
  title: string;
  subtitle: string;
}

interface DashboardCardsWithHeaderProps {
  cards: DashboardCardsProps[];
  headline: HeadlineProps;
}

const DashboardCardsWithHeader = ({
  cards,
  headline,
}: DashboardCardsWithHeaderProps) => {
  return (
    <div className="bg-gray-50 p-5">
      <div>
        <div className="flex items-end justify-between mb-12 header p-6">
          <div className="title">
            <p className="mb-4 text-4xl font-bold text-gray-800">
              {headline.title || ""}
            </p>
            <p className="text-2xl font-light text-gray-400">
              {headline.subtitle || ""}
            </p>
          </div>
          <div className="text-end"></div>
        </div>
      </div>

      <div className="bg-white grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 overflow-auto">
        {cards.map((card) => (
        
        




        

 <div
key={card.id}
className="min-w-300 bg-slate-100 shadow rounded-md flex p-6 hover:scale-100 ease-in duration-100 hover:bg-gray-200"
>
<div className="w-2/3 p-4">
  <Link href={card.link}>
    <h3 className="text-lg font-medium text-gray-800">
      {card.name}
    </h3>
  </Link>
  <p className="mt-2 text-sm text-gray-500">{card.description}</p>
  <div className="mt-4 flex justify-between">
    <div className="flex items-center">
      <Image
        alt="profile"
        className="h-8 w-8 object-cover rounded-full"
        src={jlpt_universal_01}
      />
      <p className="ml-2 text-sm font-medium text-gray-700">
        Hanabira
      </p>
    </div>
    <Link href={card.link}>
      <button className="bg-primary py-2 px-4 text-white rounded-md">
        Learn More
      </button>
    </Link>
  </div>
</div>
<div className="w-1/3">
  <Image
    alt="card image"
    className="object-cover w-full h-full"
    src={card.file}
  />
</div>
</div> 
          




        ))}
      </div>
    </div>
  );
};

export default DashboardCardsWithHeader;
