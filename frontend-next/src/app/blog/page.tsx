//'use client';

import Link from "next/link";

import BlogCards from "@/components/BlogCards";

import React from "react";

export default function Blog() {

  const blogCardsProps = [
    {
      id: "1",
      name: "Gambari",
      link: "/blog/gambari",
      file: "/img/cover.jpg",
      description:
        "Gambari: The Japanese Concept of Perseverance, Resilience, and Endurance in the Face of Adversity and its Cultural Significance.",
    }
  ];



  return (
    <div>
      <BlogCards cards={blogCardsProps} header={headerProps}/>
    </div>
  );
}

interface BlogCardProps {
  id: string;
  name: string;
  link: string;
  file: string;
  description: string;
}

interface BlogCardsProps {
  cards: BlogCardProps[];
}


const headerProps = {
  "title": "Hanabira Blog",
  "subtitle": "Blog about topics from our favourite books regarding Japanese culture, history and society."
 }
 
 
 interface HeaderProps {
   title: string;
   subtitle: string;
 }
 
 
 interface BlogCardsProps {
   cards: BlogCardProps[];
   header: HeaderProps
 }