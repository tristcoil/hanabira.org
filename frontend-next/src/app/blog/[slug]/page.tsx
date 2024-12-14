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
      <BlogCards cards={blogCardsProps} header={headerProps}/>
    </div>
  );
};
export default BlogPost;



const headerProps = {
  "title": "Zen-Lingo Blog",
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





// Assuming blogs is defined somewhere
const blogs = [
  { name: "gambari", file: "/markdown/gpt_gambari.md" },
  { name: "kanji", file: "/markdown/N3_kanji_week1.md" },
  // ... other blog entries
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
    name: "Gambari",
    link: "/blog/gambari",
    file: "/img/cover.jpg",
    description:
      "Gambari: The Japanese Concept of Perseverance, Resilience, and Endurance in the Face of Adversity and its Cultural Significance.",
  }
];


