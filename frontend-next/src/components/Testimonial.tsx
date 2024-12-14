import { StarIcon } from "@heroicons/react/24/solid";

type cardProps = {
  img: any;
  title: string;
  detail: string;
  name: any;
};

export default function Testimonial() {
  return (
    <div className="mt-20 pb-5 w-full flex items-center justify-center text-center">
      <div className="w-10/12 lg:w-9/12 flex items-center flex-col">
        <div className="flex items-center flex-col">
          <h1 className="text-sm uppercase text-primary font-bold">
            providing the best learning
          </h1>
          <h1 className="capitalize text-3xl lg:text-5xl mt-5 font-bold leading-tight">
            what does people say about us
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-5 lg:gap-7 mt-16">
          <Card
            title="Superb!"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
            deserunt praesentium facere."
            img="/img/user.png"
            name="John Doye"
          />
          <Card
            title="Superb!"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
            deserunt praesentium facere."
            img="/img/user.png"
            name="John Doye"
          />
          <Card
            title="Superb!"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
            deserunt praesentium facere."
            img="/img/user.png"
            name="John Doye"
          />
          <Card
            title="Superb!"
            detail="Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
            deserunt praesentium facere."
            img="/img/user.png"
            name="John Doye"
          />
        </div>
      </div>
    </div>
  );
}

function Card({ img, title, detail, name }: cardProps) {
  return (
    <div className="border p-7 flex items-center justify-center flex-col lg:items-start lg:text-left   ">
      <h1 className="text-3xl text-primary font-bold">{title}</h1>
      <p className="text-gray-500 mt-3 lg:mt-5">{detail}</p>
      <div className="mt-5 flex flex-col lg:flex-row items-center">
        <img src={img} className="h-12" alt="" />
        <div className="mt-3 lg:mt-0 lg:ml-3">
          <h1 className="font-semibold">{name}</h1>
          <div className="flex items-center mt-1">
            <StarIcon className="h-5 text-green" />
            <StarIcon className="h-5 text-green" />
            <StarIcon className="h-5 text-green" />
            <StarIcon className="h-5 text-green" />
            <StarIcon className="h-5 text-green" />
          </div>
        </div>
      </div>
    </div>
  );
}
