import { PlayIcon } from "@heroicons/react/24/solid";
import React from "react";
import Link from "next/link";

export default function Banner() {
  return (
    <div className="bg-banner bg-cover bg-center lg:bg-bottom pt-20 pb-5 w-full flex items-center justify-center text-center">
      <div className="w-10/12 lg:w-7/12 flex items-center flex-col">
        <h1 className="text-sm lg:text-base uppercase text-primary font-bold lg:mt-16">
          # language learning platform
        </h1>
        <h1 className="capitalize text-3xl lg:text-6xl mt-5 font-bold leading-tight">
          The japanese language <br />
          <span className="underline text-primary">learning software</span>.
        </h1>
        <p className="mt-5 lg:mt-7 w-full lg:w-9/12 text-gray-500">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt iure
          nemo quo excepturi ex dicta asperiores exercitationem quam
          accusantium, quos atque, tempora impedit eum voluptatem! Est earum
          dolores quibusdam eius!
        </p>
        <div className="mt-5 lg:mt-10 flex lg:flex-row flex-col items-center">
          <Link
            href="/categories"
            className="py-3 px-6 border text-white bg-primary font-medium border-primary rounded-md"
          >
            Get Started
          </Link>
          <Link
            href="/"
            className="py-3 px-6 mx-2 mt-3 lg:mt-0 border font-medium border-none rounded-md"
          >
            How it works
          </Link>
          <div className="bg-gray-100 cursor-pointer hover:bg-gray-200 mt-3 lg:mt-0 h-12 w-12 rounded-full flex items-center justify-center">
            <PlayIcon className="h-5 text-gray-500" />
          </div>
        </div>
        <img src="img/dashboard.png" alt="" className="mt-8 lg:mt-12 w-full" />
      </div>
    </div>
  );
}
