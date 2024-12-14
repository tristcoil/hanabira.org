import Link from "next/link";
import React from "react";

import Banner from "@/components/Banner";
import Attributes from "@/components/Attributes";
import HowItWorks from "@/components/HowItWorks";
import Testimonial from "@/components/Testimonial";
import Pricing from "@/components/Pricing";

export default function Features() {
  return (
    <div className="p-5">
      <Banner />
      <Attributes />
      <HowItWorks />
      <Testimonial />
      <Pricing />
    </div>
  );
}
