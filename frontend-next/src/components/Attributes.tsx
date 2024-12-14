import Link from "next/link";
type Props = { img: any; title: string; detail: string; link: string };

export default function Attributes() {
  return (
    <div className="mt-20 pb-5 w-full flex items-center justify-center text-center">
      <div className="w-10/12 lg:w-9/12 flex items-center flex-col">
        <div className="flex items-center flex-col lg:w-7/12">
          <h1 className="text-sm uppercase text-primary font-bold">
            providing the best learning
          </h1>
          <h1 className="capitalize text-3xl lg:text-5xl mt-5 font-bold leading-tight">
            features of the product
          </h1>
          <p className="mt-5 lg:mt-7 w-full lg:w-9/12 text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt iure
            nemo quo excepturi ex dicta asperiores exercitationem quam.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5 mt-10">
          <Card
            img="/img/specific.png"
            title="Specific Vocabulary"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
               deserunt praesentium facere."
            link="/"
          />
          <Card
            img="/img/grammer.png"
            title="Grammar"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
               deserunt praesentium facere."
            link="/"
          />
          <Card
            img="/img/sentences.png"
            title="Example Sentences"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
               deserunt praesentium facere."
            link="/"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ img, title, detail, link }: Props) {
  return (
    <div className="border p-5 flex items-center justify-center flex-col">
      <img src={img} className="h-28" alt="" />
      <h1 className="text-xl font-bold mt-5">{title}</h1>
      <p className="text-gray-500 mt-3 lg:mt-5">{detail}</p>
      <Link href={link}>Learn More</Link>
    </div>
  );
}
