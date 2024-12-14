import { CheckIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";

type cardProps = {
  c1: any;
  c2: any;
  c3: any;
  c4: any;
  rate: any;
  textColor: any;
  btnBg: any;
  link: any;
  checkTextColor: any;
};

type checkProps = {
  text: any;
};

export default function Pricing() {
  return (
    <div className="mt-20 pb-5 w-full flex items-center justify-center text-center">
      <div className="w-10/12 lg:w-9/12 flex items-center flex-col">
        <div className="flex items-center flex-col lg:w-7/12">
          <h1 className="text-sm uppercase text-primary font-bold">
            providing the best learning
          </h1>
          <h1 className="capitalize text-3xl lg:text-5xl mt-5 font-bold leading-tight">
            The best pricing for everyone learning.
          </h1>
          <p className="mt-5 lg:mt-7 w-full lg:w-9/12 text-gray-500">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt iure
            nemo quo excepturi ex dicta asperiores exercitationem quam.
          </p>
        </div>
        <div className="mt-10 w-full grid lg:grid-cols-2 gap-5 lg:gap-10">
          {/* Monthly Card */}
          <div className="p-7 border">
            <div className="flex text-center lg:text-left lg:flex-row flex-col items-center ">
              <img src="/img/Wallet.png" className="h-24" alt="" />
              <div className="mt-5 lg:mt-0 lg:ml-5">
                <h1 className="text-4xl font-bold">Monthly Plan</h1>
                <p className="mt-2 text-gray-500">
                  Full access to all content and features on LTL while your
                  subscription is active.
                </p>
              </div>
            </div>
            <Card
              c1="Full access to dashboard"
              c2="Full access to dashboard"
              c3="Full access to dashboard"
              c4="Full access to dashboard"
              checkTextColor="gray-500"
              rate="$35/mon"
              btnBg="primary"
              textColor="white"
              link="/"
            />
          </div>

          {/* Yearly Card */}
          <div className="bg-primary text-white p-7">
            <div className="flex text-center lg:text-left lg:flex-row flex-col items-center ">
              <img src="/img/Wallet.png" className="h-24" alt="" />
              <div className="mt-5 lg:mt-0 lg:ml-5">
                <h1 className="text-4xl font-bold">Yearly Plan</h1>
                <p className="mt-2">
                  Full access to all content and features on LTL while your
                  subscription is active.
                </p>
              </div>
            </div>
            <Card
              c1="Full access to dashboard"
              c2="Full access to dashboard"
              c3="Full access to dashboard"
              c4="Full access to dashboard"
              rate="$120/yearly"
              btnBg="white"
              textColor="secondary"
              checkTextColor="white"
              link="/"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  c1,
  c2,
  c3,
  c4,
  rate,
  textColor,
  btnBg,
  link,
  checkTextColor,
}: cardProps) {
  return (
    <div>
      <div className={`mt-7 grid lg:grid-cols-2 gap-5 text-${checkTextColor}`}>
        <Check text={c1} />
        <Check text={c2} />
        <Check text={c3} />
        <Check text={c4} />
      </div>
      <div className="mt-8 flex flex-col lg:flex-row items-center justify-between w-full">
        <h1 className="text-3xl font-bold">{rate}</h1>
        <Link
          to={link}
          className={`mt-4 lg:mt-0 py-3 px-6 border text-${textColor} bg-${btnBg} font-medium rounded-md`}
        >
          Try Now
        </Link>
      </div>
    </div>
  );
}

function Check({ text }: checkProps) {
  return (
    <div className="flex items-center">
      <div className="flex items-center mr-2 p-2 bg-gray-100 rounded-full w-7 h-7  ">
        <CheckIcon className="text-primary h-5" />
      </div>
      {text}
    </div>
  );
}
