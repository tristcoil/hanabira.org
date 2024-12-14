import { Link } from "react-router-dom";

type Props = {
  title: string;
  des: string;
  num: string;
};

export default function HowItWorks() {
  return (
    <div className="mt-20 pb-5 w-full flex items-center justify-center text-center">
      <div className="w-10/12 lg:w-9/12 grid lg:grid-cols-2">
        <div className="flex lg:items-start items-center flex-col lg:text-left lg:pr-16">
          <h1 className="text-sm uppercase text-primary font-bold">
            providing the best learning
          </h1>
          <h1 className="capitalize text-3xl lg:text-5xl mt-5 font-bold leading-tight">
            How does LTL work?
          </h1>
          <p className="mt-5 lg:mt-7 w-full text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt iure
            nemo quo excepturi ex dicta asperiores exercitationem quam.
          </p>
          <br />
          <ListItem
            num="1"
            title="Spaced Repition System"
            des="Giving you the reviews that you need, when your brain needs them. With a
                focus on long term memory retention."
          />
          <ListItem
            num="2"
            title="Learn anything"
            des="Giving you the reviews that you need, when your brain needs them. With a
                focus on long term memory retention."
          />
          <ListItem
            num="3"
            title="completly customizable"
            des="Giving you the reviews that you need, when your brain needs them. With a
                focus on long term memory retention."
          />
          <Link
            to="/"
            className="py-3 px-6 mt-10 border text-white bg-primary font-medium border-primary rounded-md"
          >
            Get Started
          </Link>
        </div>

        <div>
          <img src="img/languages-rafik.png" className="w-full" alt="" />
        </div>
      </div>
    </div>
  );
}

function ListItem({ num, des, title }: Props) {
  return (
    <div className="grid grid-cols-listItem mt-5">
      <div
        style={{ backgroundImage: "url(img/number-list-bg.png)" }}
        className="bg-cover bg-center h-[30px] w-[31px] text-sm text-white font-medium flex items-center justify-center"
      >
        {num}
      </div>
      <div className="ml-3 text-left">
        <h1 className="text-xl font-bold capitalize">{title}</h1>
        <p className="mt-1 text-gray-500 text-sm">{des}</p>
      </div>
    </div>
  );
}
