//'use client';

import Link from "next/link";

import BlogCards from "@/components/BlogCards";

import React from "react";

export default function Blog() {
  const blogCardsProps = [
    {
      id: "1",
      name: "JLPT N3 Kanji Part 1/6",
      link: "/japanese/kanji/n3kanji1",
      file: "/img/jlpt_universal_01.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "2",
      name: "JLPT N3 Kanji Part 2/6",
      link: "/japanese/kanji/n3kanji2",
      file: "/img/jlpt_universal_02.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "3",
      name: "JLPT N3 Kanji Part 3/6",
      link: "/japanese/kanji/n3kanji3",
      file: "/img/jlpt_universal_03.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "4",
      name: "JLPT N3 Kanji Part 4/6",
      link: "/japanese/kanji/n3kanji4",
      file: "/img/jlpt_universal_04.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "5",
      name: "JLPT N3 Kanji Part 5/6",
      link: "/japanese/kanji/n3kanji5",
      file: "/img/jlpt_universal_05.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "6",
      name: "JLPT N3 Kanji Part 6/6",
      link: "/japanese/kanji/n3kanji6",
      file: "/img/jlpt_universal_06.jpg",
      description: "JLPT N3 Kanji list with only one reading.",
    },
    {
      id: "7",
      name: "JLPT N4 Kanji Part 1/3",
      link: "/japanese/kanji/n4kanji1",
      file: "/img/jlpt_universal_07.jpg",
      description: "JLPT N4 Kanji list with only one reading.",
    },
    {
      id: "8",
      name: "JLPT N4 Kanji Part 2/3",
      link: "/japanese/kanji/n4kanji2",
      file: "/img/jlpt_universal_08.jpg",
      description: "JLPT N4 Kanji list with only one reading.",
    },
    {
      id: "9",
      name: "JLPT N4 Kanji Part 3/3",
      link: "/japanese/kanji/n4kanji3",
      file: "/img/jlpt_universal_09.jpg",
      description: "JLPT N4 Kanji list with only one reading.",
    },
    {
      id: "10",
      name: "JLPT N5 Kanji Part 1/1",
      link: "/japanese/kanji/n5kanji1",
      file: "/img/jlpt_universal_10.jpg",
      description: "JLPT N5 Kanji list with only one reading.",
    },
  ];

  return (
    <div>
      <BlogCards cards={blogCardsProps} header={headerProps} />
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
  title: "Hanabira JLPT Kanji list",
  subtitle:
    "List of JLPT Kanji with only one reading. This is subset of JLPT N5-1 kanji picked to be learned first for each level. Since these kanji have only one reading required for each level and hence are easier to learn. This does not mean these kanji have only one reading in general (the other readings are just not required for given JLPT level).",
};

interface HeaderProps {
  title: string;
  subtitle: string;
}

interface BlogCardsProps {
  cards: BlogCardProps[];
  header: HeaderProps;
}
