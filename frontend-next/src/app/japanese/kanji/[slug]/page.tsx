"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm"; // plugin to render markdown tables

import BlogCards from "@/components/BlogCards";

// https://github.com/sindresorhus/github-markdown-css
// https://github.com/hyrious/github-markdown-css
// import 'github-markdown-css/github-markdown.css';
import "github-markdown-css/github-markdown-light.css";

const BlogPost = ({ params }: { params: { slug: string } }) => {
  console.log("----------------------------------");
  console.log(params);

  return (
    <div>
      <MarkdownRenderer name={params.slug} />
      <BlogCards cards={blogCardsProps} header={headerProps} />
    </div>
  );
};
export default BlogPost;


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
  header: HeaderProps
}







// Assuming blogs is defined somewhere
const blogs = [
  { name: "gambari", file: "/markdown_kanji/gpt_gambari.md" },
  { name: "kanji", file: "/markdown_kanji/N3_kanji_week1.md" },
  {
    id: "1",
    name: "n3kanji1",
    file: "/markdown_kanji/n3kanji1.md",
  },
  {
    id: "2",
    name: "n3kanji2",
    file: "/markdown_kanji/n3kanji2.md",
  },
  {
    id: "3",
    name: "n3kanji3",
    file: "/markdown_kanji/n3kanji3.md",
  },
  {
    id: "4",
    name: "n3kanji4",
    file: "/markdown_kanji/n3kanji4.md",
  },
  {
    id: "5",
    name: "n3kanji5",
    file: "/markdown_kanji/n3kanji5.md",
  },
  {
    id: "6",
    name: "n3kanji6",
    file: "/markdown_kanji/n3kanji6.md",
  },
  {
    id: "7",
    name: "n4kanji1",
    file: "/markdown_kanji/n4kanji1.md",
  },
  {
    id: "8",
    name: "n4kanji2",
    file: "/markdown_kanji/n4kanji2.md",
  },
  {
    id: "9",
    name: "n4kanji3",
    file: "/markdown_kanji/n4kanji3.md",
  },
  {
    id: "10",
    name: "n5kanji1",
    file: "/markdown_kanji/n5kanji1.md",
  },


];

interface BlogProps {
  name: string;
  file: string;
}

const MarkdownRenderer = ({ name }: { name: string }) => {
  const [postContent, setPostContent] = useState("");

  const fetchMarkdown = (name: string) => {
    const blog = blogs.find((b: BlogProps) => b.name === name);
    if (blog) {
      fetch(`${blog.file}`)
        .then((response) => response.text())
        .then((text) => setPostContent(text))
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    fetchMarkdown(name);
  }, [name]);

  return (
    <div className="markdown-body p-10">
      <ReactMarkdown remarkPlugins={[gfm]}>{postContent}</ReactMarkdown>
    </div>
  );
};

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
    file: "/img/jlpt_universal_08.jpg",
    description: "JLPT N4 Kanji list with only one reading.",
  },
];
