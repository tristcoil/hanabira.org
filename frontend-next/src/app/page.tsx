// 'use client';

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import Head from "next/head";

import { ChevronRightIcon, StarIcon } from "@heroicons/react/20/solid";
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/20/solid";

import Image, { StaticImageData } from "next/image";

import hanabira_text_parser_tokenization from "@public/img/screenshots/hanabira_text_parser_tokenization.png";
import hanabira_youtube_parser from "@public/img/screenshots/hanabira_youtube_parser.png";
import hanabira_jlpt_vocab from "@public/img/screenshots/hanabira_jlpt_vocab.png";
import hanabira_quick_kanji from "@public/img/screenshots/hanabira_quick_kanji.png";
import hanabira_grammar from "@public/img/screenshots/hanabira_grammar.png";
import hanabira_kanji_flashcards from "@public/img/screenshots/hanabira_kanji_flashcards.png";
import hanabira_vocab_flashcards from "@public/img/screenshots/hanabira_vocab_flashcards.png";
import hanabira_vocabulary_sentences from "@public/img/screenshots/hanabira_vocabulary_sentences.png";
import hanabira_github from "@public/img/screenshots/hanabira_github.png";
import hanabira_grammar_graph from "@public/img/screenshots/hanabira_grammar_graph.png";
//import hanabira_word_relations from "@public/img/screenshots/hanabira_word_relations.png";
import hanabira_word_relations from "@public/img/screenshots/hanabira_word_relations_dark.png";

// client component w form, so we can have parent SSR
import EmailForm from "@/components/EmailForm";

const stats = [
  { label: "Founded", value: "2021" },
  { label: "Employees", value: "5" },
  { label: "Beta Users", value: "521" },
  { label: "Raised", value: "$25M" },
];
const logos = [
  {
    name: "Transistor",
    url: "https://tailwindui.com/img/logos/transistor-logo-gray-400.svg",
  },
  {
    name: "Mirage",
    url: "https://tailwindui.com/img/logos/mirage-logo-gray-400.svg",
  },
  {
    name: "Tuple",
    url: "https://tailwindui.com/img/logos/tuple-logo-gray-400.svg",
  },
  {
    name: "Laravel",
    url: "https://tailwindui.com/img/logos/laravel-logo-gray-400.svg",
  },
  {
    name: "StaticKit",
    url: "https://tailwindui.com/img/logos/statickit-logo-gray-400.svg",
  },
  {
    name: "Workcation",
    url: "https://tailwindui.com/img/logos/workcation-logo-gray-400.svg",
  },
];
const footerNavigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "X",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Dribbble",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

import {
  ArrowUturnLeftIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleLeftRightIcon,
  DocumentChartBarIcon,
  HeartIcon,
  InboxIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  TrashIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const solutions = [
  {
    name: "Inbox",
    description:
      "Get a better understanding of where your traffic is coming from.",
    href: "#",
    icon: InboxIcon,
  },
  {
    name: "Messaging",
    description: "Speak directly to your customers in a more meaningful way.",
    href: "#",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: "Live Chat",
    description: "Your customers' data will be safe and secure.",
    href: "#",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Knowledge Base",
    description: "Connect with third-party tools that you're already using.",
    href: "#",
    icon: QuestionMarkCircleIcon,
  },
];
const features = [
  {
    name: "Is the website really free?",
    description:
      "Yes, it is not only free, but also (mostly) open source. Source code is on GitHub.",
    icon: InboxIcon,
  },
  {
    name: "Do you want to run ads?",
    description:
      "No, we will never run ads on Hanabira.org. We strongly believe that language learning apps should be distraction free.",
    icon: UsersIcon,
  },
  {
    name: "Is the development sustainable long term?",
    description:
      "Hanabira lead dev is financing the development from savings. Freelancer support and content proofreading tends to be rather costly. At the moment there are no budget issues though.",
    icon: TrashIcon,
  },
  {
    name: "Why shouldn't I use Anki instead your stupid SRS cards?",
    description: "Yes, use Anki, it is great, we use it too. Our cards are made for rapid reviews and are much simpler than Anki.",
    icon: PencilSquareIcon,
  },
  {
    name: "Is this one stop shop for learning Japanese?",
    description:
      "No, not at all. But it is great place to start and to come back to.",
    icon: DocumentChartBarIcon,
  },
  {
    name: "Free Grammar Lessons?",
    description:
      "Yes, you can even download full grammar lessons with related audio and use even for commercial purposes. Under permissive Creative Commons Sharealike Licence.",
    icon: ArrowUturnLeftIcon,
  },
  {
    name: "What languages will you add next?",
    description:
      "Text parser support will be expended with Korean language. We have already received several requests for this. Also lead dev is starting to learn Korean as well :)",
    icon: ChatBubbleLeftEllipsisIcon,
  },
  {
    name: "Do you plan paid tier?",
    description:
      "Yes, eventually there will be some kind of paid tier for Hanabira services. Lots of content will remain free forever though. Then there is the self-hosting option of course.",
    icon: HeartIcon,
  },
  {
    name: "Fully Open Source?",
    description:
      "hanabira.org is mostly Open Source - MIT License. We are considering going fully Open Source, but have not decided yet. We might leave some functionality as a Pro feature. We welcome your feedback on this structure.",
    icon: HeartIcon,
  },
  {
    name: "Self-Hosting",
    description:
      "You can run hanabira.org locally, as it is open sourced, you just need to spin up few Docker containers with one command: docker-compose up.",
    icon: InboxIcon,
  },
];
const metrics = [
  {
    id: 1,
    stat: "8K+",
    emphasis: "Companies",
    rest: "use laoreet amet lacus nibh integer quis.",
  },
  {
    id: 2,
    stat: "25K+",
    emphasis: "Countries around the globe",
    rest: "lacus nibh integer quis.",
  },
  {
    id: 3,
    stat: "98%",
    emphasis: "Customer satisfaction",
    rest: "laoreet amet lacus nibh integer quis.",
  },
  {
    id: 4,
    stat: "12M+",
    emphasis: "Issues resolved",
    rest: "lacus nibh integer quis.",
  },
];
// const footerNavigation = {
//   solutions: [
//     { name: 'Marketing', href: '#' },
//     { name: 'Analytics', href: '#' },
//     { name: 'Commerce', href: '#' },
//     { name: 'Insights', href: '#' },
//   ],
//   support: [
//     { name: 'Pricing', href: '#' },
//     { name: 'Documentation', href: '#' },
//     { name: 'Guides', href: '#' },
//     { name: 'API Status', href: '#' },
//   ],
//   company: [
//     { name: 'About', href: '#' },
//     { name: 'Blog', href: '#' },
//     { name: 'Jobs', href: '#' },
//     { name: 'Press', href: '#' },
//     { name: 'Partners', href: '#' },
//   ],
//   legal: [
//     { name: 'Claim', href: '#' },
//     { name: 'Privacy', href: '#' },
//     { name: 'Terms', href: '#' },
//   ],
//   social: [
//     {
//       name: 'Facebook',
//       href: '#',
//       icon: (props: any) => (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//           <path
//             fillRule="evenodd"
//             d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
//             clipRule="evenodd"
//           />
//         </svg>
//       ),
//     },
//     {
//       name: 'Instagram',
//       href: '#',
//       icon: (props: any) => (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//           <path
//             fillRule="evenodd"
//             d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//             clipRule="evenodd"
//           />
//         </svg>
//       ),
//     },
//     {
//       name: 'X',
//       href: '#',
//       icon: (props: any) => (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//           <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
//         </svg>
//       ),
//     },
//     {
//       name: 'GitHub',
//       href: '#',
//       icon: (props: any) => (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//           <path
//             fillRule="evenodd"
//             d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
//             clipRule="evenodd"
//           />
//         </svg>
//       ),
//     },
//     {
//       name: 'Dribbble',
//       href: '#',
//       icon: (props: any) => (
//         <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//           <path
//             fillRule="evenodd"
//             d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
//             clipRule="evenodd"
//           />
//         </svg>
//       ),
//     },
//   ],
// }

export default function Example() {
  return (
    <div className="bg-white">
      <Head>
        <title>
          Hanabira.org - Free Open-Source Japanese Learning Portal with
          Immersion
        </title>
        <meta
          name="description"
          content="Hanabira.org is a Japanese learning portal focused on immersive learning experiences. Join us to enhance your Japanese language skills through effective immersion techniques. Free, Open-Source, allows for Self-Hosting."
        />
      </Head>

      <main>
        {/* Hero section */}
        {/* <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-48"> */}
        <div className="overflow-hidden pt-8 sm:pt-12 lg:relative lg:py-18">
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div>
              {/* <div className="text-4xl font-semibold text-slate-600 text-opacity-60">
                <img
                  className="h-11 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=rose&shade=500"
                  alt="Your Company"
                />
              </div> */}

              {/* <div className="mt-4 flex items-center">
                <a
                  href="https://discord.com/invite/afefVyfAkH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200 mr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#5865F2" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                  </svg>
                </a>
                <a
                  href="https://www.reddit.com/r/hanabira/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200 mr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#FF4500" viewBox="0 0 16 16">
                    <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z" />
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165" />
                  </svg>
                </a>
                <a
                  href="https://github.com/tristcoil/hanabira.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity duration-200 mr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                  </svg>
                </a>
              </div> */}

              {/* <div className="mt-20"> */}
              <div className="mt-1">
                <div>
                  <a href="#" className="inline-flex space-x-4">
                    <span className="rounded bg-rose-50 px-2.5 py-1 text-sm font-semibold text-rose-800">
                      What is new
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm font-medium text-rose-800">
                      <span>Just shipped Public Alpha v0.3.8</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </div>

                <div className="mt-6 sm:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Your path to Japanese & Korean comprehension
                  </h1>

                  <h2 className="hidden md:block text-xl mt-5 font-bold tracking-tight text-gray-500 sm:text-xl">
                    日本語理解への道
                  </h2>
                  <h2 className="hidden md:block text-xl mt-5 font-bold tracking-tight text-gray-500 sm:text-xl">
                    한국어 이해를 위한 길입니다
                  </h2>

                  <p className="mt-6 text-xl text-gray-500">
                    Prepare for JLPT/TOPIK with hanabira.org
                  </p>

                  <p className="mt-6 text-sm text-gray-500">
                    Free Open-Source platform. Available for self-hosting.
                  </p>
                  {/* <a href="https://github.com/tristcoil/hanabira.org" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-700">(GitHub)</a> */}
                </div>

                <div className="mt-6">
                  <div className="inline-flex items-center divide-x divide-gray-300">
                    <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500 sm:py-3">
                      <span className="font-semibold text-gray-900">
                        Features:
                      </span>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>
                          <span className="font-bold text-blue-600">
                            YouTube Immersion
                          </span>{" "}
                          - Enhance learning with engaging video content.
                        </li>
                        <li>
                          <span className="font-bold text-green-600">
                            Text Parser
                          </span>{" "}
                          - Easily split and tokenize custom texts.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-800">
                            Grammar Explanation
                          </span>{" "}
                          - Quick and clear grammar points with examples.
                        </li>
                        <li>
                          <span className="font-semibold text-gray-800">
                            Vocabulary SRS Cards
                          </span>{" "}
                          - Effective spaced repetition flashcards with audio.
                        </li>
                        <li>
                          <span className="font-medium text-gray-700">
                            Vocabulary and Sentence Mining
                          </span>{" "}
                          - Discover new words and sentences seamlessly.
                        </li>
                        {/* <li><span className="font-medium text-gray-700">Kanji Mnemonics</span> <em>(in development)</em> - Simplified kanji learning techniques.</li>
                        <li><span className="font-medium text-gray-700">Kanji Animation and Drawing Canvas</span> <em>(in development)</em> - Interactive kanji practice tools.</li> */}
                        <li className="hidden md:list-item">
                          <span className="font-medium text-gray-700">
                            Kanji Mnemonics
                          </span>
                          <em> (in development)</em> - Simplified kanji learning
                          techniques.
                        </li>
                        <li className="hidden md:list-item">
                          <span className="font-medium text-gray-700">
                            Kanji Animation and Drawing Canvas
                          </span>
                          <em> (in development)</em> - Interactive kanji
                          practice tools.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br /> */}

                <div className="mt-6">
                  {/* <div className="mt-6 sm:max-w-xl">
                    <p className="mt-6 text-xl text-gray-500">
                      Get notified when we launch.
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Currently in early Public Alpha stage.
                    </p>
                  </div> */}

                  <div className="mt-6 sm:flex sm:items-center sm:justify-between sm:max-w-xl">
                    {/* <div>
      <p className="mt-6 text-xl text-gray-500">
        Get notified when we launch.
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Currently in early Public Alpha stage.
      </p>
    </div> */}

                    {/* <div className="mt-4 sm:mt-0 flex items-center justify-end space-x-3">
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-discord" viewBox="0 0 16 16">
  <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
</svg>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-reddit" viewBox="0 0 16 16">
  <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z"/>
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165"/>
</svg>
    </div> */}

                    <div className="flex justify-between space-x-16">
                      <div>
                        <p className="mt-6 text-xl text-gray-500">
                          Get notified when we launch.
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Public Alpha
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 flex items-right justify-right space-x-3">
                        <a
                          href="https://discord.com/invite/afefVyfAkH"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 transition-opacity duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="#5865F2"
                            viewBox="0 0 16 16"
                          >
                            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                          </svg>
                        </a>
                        <a
                          href="https://www.reddit.com/r/hanabira/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 transition-opacity duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="#FF4500"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.167 8a.83.83 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661m1.843 3.647c.315 0 1.403-.038 1.976-.611a.23.23 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83s.83-.381.83-.83a.831.831 0 0 0-1.66 0z" />
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.2.2 0 0 0-.153.028.2.2 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224q-.03.17-.029.353c0 1.795 2.091 3.256 4.669 3.256s4.668-1.451 4.668-3.256c0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165" />
                          </svg>
                        </a>
                        <a
                          href="https://github.com/tristcoil/hanabira.org"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-80 transition-opacity duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="48"
                            height="48"
                            fill="currentColor"
                            className="bi bi-github"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* <form action="#" className="mt-12 sm:flex sm:w-full sm:max-w-lg">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="hero-email"
                        type="email"
                        className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mt-4 sm:ml-3 sm:mt-0">
                      <button
                        type="submit"
                        className="block w-full rounded-md border border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                      >
                        Notify me
                      </button>
                    </div>
                  </form> */}

                  <EmailForm />
                  {/* 
                  <form onSubmit={handleSubmit} className="mt-12 sm:flex sm:w-full sm:max-w-lg">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-email" className="sr-only">
                        Email address
                      </label>
                      <input
                        id="hero-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="mt-4 sm:ml-3 sm:mt-0">
                      <button
                        type="submit"
                        className="block w-full rounded-md border border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                      >
                        Notify me
                      </button>
                    </div>
                  </form> */}

                  {/* <div className="mt-6">
                    <div className="inline-flex items-center divide-x divide-gray-300">
                      <div className="flex flex-shrink-0 pr-5">
                        <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500 sm:py-3">
                        <span className="font-medium text-gray-900">Rated 5 stars</span> by over{' '}
                        <span className="font-medium text-rose-500">500 beta users</span>
                      </div>
                    </div>
                  </div> */}

                  <div className="p-1 max-w-xl">
                    <p className="mt-4 font-bold text-lg text-gray-600">
                      Easily Self-Host with only 3 commands!
                    </p>
                    <div className="mt-4 bg-gray-600 text-white rounded-lg p-4 relative">
                      <pre>
                        <code className="text-xs whitespace-pre-wrap">
                          git clone
                          https://github.com/tristcoil/hanabira.org.git <br />
                          cd hanabira.org <br />
                          docker-compose up # go to http://localhost:8888
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* <form action="#" className="mt-12 sm:flex sm:w-full sm:max-w-lg">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="hero-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="hero-email"
                      type="email"
                      className="block w-full rounded-md border border-gray-300 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:ml-3 sm:mt-0">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-rose-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form>
                <div className="mt-6">
                  <div className="inline-flex items-center divide-x divide-gray-300">
                    <div className="flex flex-shrink-0 pr-5">
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      <StarIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1 py-1 pl-5 text-sm text-gray-500 sm:py-3">
                      <span className="font-medium text-gray-900">Rated 5 stars</span> by over{' '}
                      <span className="font-medium text-rose-500">500 beta users</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* top right image custom */}
          <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
            <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <div className="hidden sm:block">
                <div className="absolute inset-y-0 left-1/2 w-screen rounded-l-3xl bg-gray-50 lg:left-80 lg:right-0 lg:w-full" />
                <svg
                  className="absolute right-1/2 top-8 -mr-3 lg:left-0 lg:m-0"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={404}
                    height={392}
                    fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                  />
                </svg>
              </div>
              <div className="relative -mr-40 pl-6 sm:mx-auto sm:max-w-3xl sm:px-0 lg:h-full lg:max-w-none lg:pl-12">
                {/* <Image
                  alt="hanabira_text_parser_tokenization"
                  className="w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src={hanabira_text_parser_tokenization}
                  loading="lazy"
                /> */}

                <Image
                  alt="hanabira_text_parser_tokenization"
                  className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-md shadow-xl ring-1 ring-black ring-opacity-5 lg:h-full lg:w-auto lg:max-w-none"
                  src={hanabira_text_parser_tokenization}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* --------------- */}

          {/* --------------- */}
        </div>

        {/* Testimonial/stats section */}
        <div className="relative mt-20">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
            <div className="relative sm:py-16 lg:py-0">
              <div
                aria-hidden="true"
                className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
              >
                <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-gray-50 lg:right-72" />
                <svg
                  className="absolute left-1/2 top-8 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
                  width={404}
                  height={392}
                  fill="none"
                  viewBox="0 0 404 392"
                >
                  <defs>
                    <pattern
                      id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x={0}
                        y={0}
                        width={4}
                        height={4}
                        className="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width={404}
                    height={392}
                    fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
                  />
                </svg>
              </div>
              <div className="relative mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-none lg:px-0 lg:py-20">
                {/* Testimonial card*/}
                <div className="relative overflow-hidden rounded-2xl pb-10 pt-64 shadow-xl">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 absolute inset-0 h-full w-full object-cover"
                    src={hanabira_text_parser_tokenization}
                    alt="hanabira japanese text parser"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-slate-100 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-600 via-slate-600 opacity-70" />

                  <div className="relative px-8">
                    <blockquote className="mt-8">
                      <div className="relative text-lg font-medium text-white md:flex-grow">
                        <svg
                          className="absolute left-0 top-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-rose-400"
                          fill="currentColor"
                          viewBox="0 0 32 32"
                          aria-hidden="true"
                        >
                          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                        </svg>
                        <p className="relative">
                          Learn Japanese from a content that has meaning to you
                          personally.
                        </p>
                      </div>

                      <footer className="mt-4">
                        <p className="text-base font-semibold text-rose-200">
                          hanabira.org
                        </p>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mx-auto max-w-md px-6 sm:max-w-3xl lg:px-0">
              {/* Content area */}
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Master Japanese Effortlessly with Our Custom Text Parser!
                </h2>

                <div className="mt-6">
                  <a
                    href="/text-parser"
                    className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                  >
                    Get started
                  </a>
                </div>

                <div className="mt-6 space-y-6 text-gray-500">
                  <p className="text-lg">
                    Unlock the full potential of your Japanese language learning
                    with our innovative Japanese text parser. Simply input your
                    custom text, and our tool will split and tokenize it for
                    easy reading and comprehension. This feature is designed to
                    make understanding Japanese text seamless and enjoyable,
                    breaking down complex sentences into manageable parts for
                    learners of all levels.
                  </p>
                  <p className="text-base leading-7">
                    Click on any word to access detailed dictionary entries
                    complete with audio pronunciation, perfect for reinforcing
                    your learning. This interactive approach not only helps with
                    word recognition but also aids in proper pronunciation and
                    context understanding. Our dictionary entries provide
                    comprehensive insights, ensuring you grasp the nuances of
                    the Japanese language.
                  </p>
                  <p className="text-base leading-7">
                    Utilize text mining to discover new vocabulary and related
                    sentences seamlessly. This powerful feature allows you to
                    uncover patterns and connections in the language, enhancing
                    your learning experience. Plus, you can effortlessly send
                    data to your SRS flashcards to boost your retention. Dive
                    into a smarter, more efficient way to learn Japanese today!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
              aria-hidden="true"
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            >
              <defs>
                <pattern
                  x="50%"
                  y={-1}
                  id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>
          </div>

          {/* <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="lg:max-w-lg">
                  <p className="text-base font-semibold leading-7 text-indigo-600">Subtitle text parser</p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">YouTube immersion</h1>
                  <p className="mt-6 text-xl leading-8 text-gray-700">
                    Aliquet nec orci mattis amet quisque ullamcorper neque, nibh sem. At arcu, sit dui mi, nibh dui, diam
                    eget aliquam. Quisque id at vitae feugiat egestas.
                  </p>
                </div>
              </div>
            </div>
            <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
              <img
                alt=""
                src="https://tailwindui.com/img/component-images/dark-project-app-screenshot.png"
                className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
              />
            </div>
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                  <p>
                    Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris semper sed amet
                    vitae sed turpis id. Id dolor praesent donec est. Odio penatibus risus viverra tellus varius sit neque
                    erat velit. Faucibus commodo massa rhoncus, volutpat. Dignissim sed eget risus enim. Mattis mauris
                    semper sed amet vitae sed turpis id.
                  </p>
                  <ul role="list" className="mt-8 space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                      <CloudArrowUpIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">Push to deploy.</strong> Lorem ipsum, dolor sit amet
                        consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate
                        blanditiis ratione.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <LockClosedIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">SSL certificates.</strong> Anim aute id magna aliqua
                        ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <ServerIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">Database backups.</strong> Ac tincidunt sapien
                        vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-8">
                    Et vitae blandit facilisi magna lacus commodo. Vitae sapien duis odio id et. Id blandit molestie auctor
                    fermentum dignissim. Lacus diam tincidunt ac cursus in vel. Mauris varius vulputate et ultrices hac
                    adipiscing egestas. Iaculis convallis ac tempor et ut. Ac lorem vel integer orci.
                  </p>
                  <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">No server? No problem.</h2>
                  <p className="mt-6">
                    Id orci tellus laoreet id ac. Dolor, aenean leo, ac etiam consequat in. Convallis arcu ipsum urna nibh.
                    Pharetra, euismod vitae interdum mauris enim, consequat vulputate nibh. Maecenas pellentesque id sed
                    tellus mauris, ultrices mauris. Tincidunt enim cursus ridiculus mi. Pellentesque nam sed nullam sed diam
                    turpis ipsum eu a sed convallis diam.
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* --- */}

          <br></br>
          <br></br>
          <br></br>

          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="lg:max-w-lg">
                  <p className="text-base font-semibold leading-7 text-indigo-600">
                    Subtitle text parser
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    YouTube Immersion
                  </h1>

                  <div className="mt-6">
                    <a
                      href="/text-parser?type=youtube"
                      className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                    >
                      Get started
                    </a>
                  </div>

                  <p className="mt-6 text-xl leading-8 text-gray-700">
                    Enhance your Japanese learning journey with our YouTube
                    subtitle parser. This powerful tool allows for easy
                    tokenization and analysis of text from YouTube subtitles,
                    enabling effective word and sentence mining. Our platform
                    provides comprehensive grammar explanations, real-time
                    Japanese to English translations, and insightful sentiment
                    analysis. Additionally, you can explore Kanji and Radical
                    lookups, and benefit from content summarization. Integrated
                    with ChatGPT API and DEEPL translations, our service offers
                    a seamless and enriched learning experience. Best of all, it
                    is free to use, making it an invaluable resource for
                    learners of all levels.
                  </p>
                </div>
              </div>
            </div>
            <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
              <Image
                alt="japanese youtube immersion text parser"
                src={hanabira_youtube_parser}
                className="transform transition duration-300 ease-in-out hover:scale-105 w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                loading="lazy"
              />

{/* Small link below the image */}
<div className="mt-3 text-center text-sm text-gray-700">
  Screenshot from{' '}
  <a
    href="https://www.youtube.com/@the_bitesize_japanese_podcast"
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate-600 hover:text-slate-800"
  >
    Bite Size Japanese YouTube Channel
  </a>
</div>



            </div>
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
              <div className="lg:pr-4">
                <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
                  <p>
                    Our YouTube subtitle parser offers a unique approach to
                    language immersion, allowing users to compare Japanese and
                    English translations in real time. The platform also
                    features sentiment analysis and content summarization tools,
                    providing a deeper understanding of the subtitled content.
                    With integrated Kanji and Radical lookup functionalities,
                    learners can explore the nuances of Japanese characters with
                    ease. The service leverages advanced AI, including ChatGPT
                    and DEEPL, to enhance translation accuracy and provide
                    comprehensive language support.
                  </p>

                  {/*                   
                  //NICE ITEMIZATION LAYOUT - just describe nicely features of our YouTube parser
                  <ul role="list" className="mt-8 space-y-8 text-gray-600">
                    <li className="flex gap-x-3">
                      <CloudArrowUpIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">Easy Integration.</strong> Seamlessly integrate our subtitle parser into your learning routine, providing an enriched and interactive experience with instant access to grammar explanations and translations.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <LockClosedIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">Secure and Private.</strong> Our platform ensures the security and privacy of your data, so you can focus on learning without concerns data safety.
                      </span>
                    </li>
                    <li className="flex gap-x-3">
                      <ServerIcon aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-indigo-600" />
                      <span>
                        <strong className="font-semibold text-gray-900">Robust Backups.</strong> We provide reliable database backups, ensuring that your learning progress and data are always safe and recoverable.
                      </span>
                    </li>
                  </ul>
                  <p className="mt-8">
                    Our platform is designed to cater to learners at all levels, offering a rich array of features that make mastering Japanese more accessible and enjoyable. From comprehensive grammar support to advanced translation and analysis tools, we provide everything you need to deepen your understanding and appreciation of the language.
                  </p>
                  <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">No server? No problem.</h2>
                  <p className="mt-6">
                    Although you can run Hanabira as self hosted solution on your server, we provide fully managed solution directly on hanabira.org page.
                    Experience the convenience of a cloud-based solution that requires no server setup. Our tool is accessible from anywhere, at any time, providing you with the flexibility to learn Japanese at your own pace. Whether you are at home or on the go, you can immerse yourself in the language with ease and convenience.
                  </p>
 */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo cloud section */}
        {/* <div className="mt-32">
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-24">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Backed by world-renowned investors
                </h2>
                <p className="mt-6 max-w-3xl text-lg leading-7 text-gray-500">
                  Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum urna sed consectetur neque
                  tristique pellentesque. Blandit amet, sed aenean erat arcu morbi. Cursus faucibus nunc nisl netus
                  morbi vel porttitor vitae ut. Amet vitae fames senectus vitae.
                </p>
                <div className="mt-6">
                  <a href="#" className="text-base font-medium text-rose-500">
                    Meet our investors and advisors &rarr;
                  </a>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                {logos.map((logo) => (
                  <div key={logo.name} className="col-span-1 flex justify-center bg-gray-50 px-8 py-8">
                    <img className="max-h-12" src={logo.url} alt={logo.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        {/*  */}

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Grammar Graph Analyzer
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Prototype of Grammar Graph Analyzer. Shows useful grammar
                      structure in visual manner. Great for visual learners.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Discover the ultimate language learning experience with
                      our innovative Grammar Graph feature! Designed to elevate
                      your understanding of sentence structures, Grammar Graph
                      utilizes advanced parse tree analysis to visually break
                      down complex sentences. This powerful tool allows learners
                      to see the grammatical relationships between words,
                      enhancing comprehension and retention.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Whether you are learning Japanese, Korean, or any other
                      language, Grammar Graph provides an intuitive way to grasp
                      syntax, improve your grammar skills, and deepen your
                      linguistic knowledge. Perfect for students, educators, and
                      language enthusiasts, this feature makes mastering
                      sentence structure easier than ever before.
                    </p>

                    <div className="mt-6">
                      <a
                        href="/grammar-graph"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Go to Grammar Graph
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        Grammar Graph is AI generated in real time, so there
                        might be some inconsistencies sometimes.
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3"></div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_grammar_graph}
                    alt="hanabira grammar graph"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}

        {/*  */}

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    {/* <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Word relationship hierarchy
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Prototype of Grammar Graph Analyzer. Shows useful grammar
                      structure in visual manner. Great for visual learners.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Discover the ultimate language learning experience with
                      our innovative Grammar Graph feature! Designed to elevate
                      your understanding of sentence structures, Grammar Graph
                      utilizes advanced parse tree analysis to visually break
                      down complex sentences. This powerful tool allows learners
                      to see the grammatical relationships between words,
                      enhancing comprehension and retention.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Whether you are learning Japanese, Korean, or any other
                      language, Grammar Graph provides an intuitive way to grasp
                      syntax, improve your grammar skills, and deepen your
                      linguistic knowledge. Perfect for students, educators, and
                      language enthusiasts, this feature makes mastering
                      sentence structure easier than ever before.
                    </p> */}

                    <section className="py-8">
                      <div className="container mx-auto px-4">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                          Word Relationship Hierarchy
                        </h1>
                        <p className="mt-4 text-lg text-gray-700">
                          Visualize and explore the intricate connections
                          between words through an intuitive hierarchy graph,
                          making complex linguistic concepts easier to
                          understand.
                        </p>

                        <p className="mt-4 text-lg text-gray-700">
                          Designed with language learners in mind, our tool
                          delves deep into:
                        </p>
                        <ul className="mt-4 space-y-2 text-lg text-gray-700 list-disc list-inside">
                          <li>
                            <strong>Verb Conjugation:</strong> Easily understand
                            how verbs transform across tenses and contexts.
                          </li>
                          <li>
                            <strong>Word Similarity:</strong> Discover related
                            words to expand your vocabulary.
                          </li>
                          <li>
                            <strong>Synonyms:</strong> Broaden your
                            understanding of alternative expressions.
                          </li>
                          <li>
                            <strong>Antonyms:</strong> Learn contrasting words
                            to deepen comprehension.
                          </li>
                        </ul>

                        <p className="mt-4 text-lg text-gray-700">
                          By visualizing these relationships in a hierarchy
                          graph, learners can see how words interconnect in a
                          clear, structured way. This feature is perfect for
                          visual learners who benefit from graphical
                          representations of linguistic data.
                        </p>

                        <p className="mt-4 text-lg text-gray-700">
                          With this feature, expanding your vocabulary will be a
                          bit more engaging and efficient.
                        </p>
                      </div>
                    </section>

                    <div className="mt-6">
                      <a
                        href="/word-relations"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Go to Word Relations
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        Word Relations are AI generated in real time, so there
                        might be some inconsistencies sometimes.
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3"></div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_word_relations}
                    alt="hanabira word relations"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  */}

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Review vocabulary easily
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Enhance your Japanese language learning with our efficient
                      vocabulary review feature, designed for quick and easy
                      glancing over vocabulary lists. This tool is faster than
                      traditional SRS flashcards, allowing you to swiftly review
                      and reinforce your knowledge. Each word card is
                      interactive, enabling you to click and play the related
                      audio for accurate pronunciation practice. Ideal for
                      last-minute preparation before JLPT tests, our vocabulary
                      review feature ensures you are well-prepared and
                      confident. Maximize your study sessions and achieve your
                      language goals with this innovative, user-friendly tool.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/japanese/quick_vocab"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started - Quick Vocabulary
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        &ldquo;Quickly review and master Japanese vocabulary with interactive audio-enhanced word cards, perfect for efficient study sessions and JLPT prep.&rdquo;
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {/* <img
                            className="h-6 w-6 rounded-full"
                            src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                            alt=""
                          /> */}
                        </div>
                        {/* <div className="text-base font-medium text-gray-700">
                          placeholder, placeholder
                        </div> */}
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_jlpt_vocab}
                    alt="japanese JLPT vocabulary"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:px-0 lg:py-32">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <SparklesIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Phonetic approach to kanji for each JLPT level
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Discover our Quick Kanji feature, a simplified approach to
                      mastering kanji for each JLPT level. We select a subset of
                      kanji that have one dominant reading, making it easier to
                      anchor your learning and treat these specific kanji more
                      like an alphabet. While these kanji generally have
                      multiple readings, the chosen readings are sufficient for
                      the respective JLPT level, streamlining your study
                      process. This focused method allows you to master
                      essential kanji sets, significantly enhancing your ability
                      to read Japanese texts. Make your Japanese language
                      learning more efficient and effective with our Quick Kanji
                      feature.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/japanese/quick_kanji"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started - Quick Kanji
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
                <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className=" transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_quick_kanji}
                    alt="Japanese quick kanji"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Quick japanese grammar explanations for each JLPT
                      level
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Enhance your Japanese language learning with our
                      streamlined quick grammar lessons tailored for each JLPT level.
                      Inspired by the popular Nihongo so Matome books, these
                      lessons offer quick and concise explanations of essential
                      grammar points. Each lesson includes example sentences and
                      accompanying audio, promoting an intuitive understanding
                      of grammar without unnecessary complexity. Perfect for
                      efficient study sessions, our grammar lessons ensure you
                      grasp key concepts swiftly and effectively. Prepare
                      confidently for your JLPT exams with our streamlined,
                      user-friendly grammar lessons.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/content"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started with Grammar
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        &ldquo;Master essential Japanese grammar effortlessly with concise, level-specific lessons and audio examples, perfect for efficient JLPT preparation.&rdquo;
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {/* <img
                            className="h-6 w-6 rounded-full"
                            src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                            alt=""
                          /> */}
                        </div>
                        {/* <div className="text-base font-medium text-gray-700">
                          placeholder, placeholder
                        </div> */}
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_grammar}
                    alt="hanabira Japanese grammar"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:px-0 lg:py-32">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <SparklesIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Simplified kanji flashcards
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Experience our phonetic-based approach to kanji SRS
                      flashcards, designed to simplify your Japanese language
                      learning. For each JLPT level, we select kanji with only
                      one dominant reading and include respective audio,
                      allowing you to treat these kanji like an alphabet. We
                      streamline the learning process by limiting the
                      information provided, ensuring students are not
                      overwhelmed. Our user-friendly SRS flashcards enable swift
                      review sessions without the mandatory setting of
                      difficulty levels. This method ensures efficient learning
                      and retention, making kanji mastery more accessible.
                      Enhance your study routine with our innovative kanji SRS
                      flashcards and prepare confidently for your JLPT tests.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/japanese/flashcards-kanji"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started with Kanji
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
                <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_kanji_flashcards}
                    alt="Japanese kanji flashcards"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Simple SRS vocabulary flashcards
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Our vocabulary SRS flashcards feature audio and plenty of
                      example sentences, making learning more engaging and
                      effective. Our bite-sized decks are easy to digest,
                      ensuring you wont face hundreds of items in your next
                      review session. You can quickly flip through them,
                      offering a simpler and more streamlined experience
                      compared to Anki. However, for a more advanced approach,
                      we still recommend using Anki and its sophisticated SRS
                      algorithms. Simplify your vocabulary learning with our
                      user-friendly flashcards and enhance your Japanese
                      language skills effortlessly.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/japanese/flashcards-words"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started with SRS flashcards
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        &ldquo;Boost your Japanese vocabulary effortlessly with simple, audio-enhanced SRS flashcards featuring example sentences for effective learning.&rdquo;
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {/* <img
                            className="h-6 w-6 rounded-full"
                            src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                            alt=""
                          /> */}
                        </div>
                        {/* <div className="text-base font-medium text-gray-700">
                          placeholder, placeholder
                        </div> */}
                      </div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_vocab_flashcards}
                    alt="Japanese vocabulary flashcards"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:px-0 lg:py-32">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <SparklesIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Comprehensive vocabulary lists
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      We offer comprehensive vocabulary lists complete with
                      plenty of example sentences and audio, perfect for easy
                      review if you prefer not to use flashcards. These lists
                      allow you to quickly go through vocabulary at your own
                      pace, making your learning experience flexible and
                      efficient. Enhance your Japanese language skills with our
                      detailed vocabulary resources, designed to provide
                      thorough and convenient review options. Whether you choose
                      flashcards or vocabulary lists, our tools are crafted to
                      support your learning journey effectively.
                    </p>
                    <div className="mt-6">
                      <a
                        href="/japanese/vocabulary_selection/essential_verbs"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get started with vocabulary
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
                <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_vocabulary_sentences}
                    alt="Japanese vocabulary sentences"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternating Feature Sections */}
        <div className="relative overflow-hidden pb-32 pt-16">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
          />
          <div className="relative">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:px-0 lg:py-16">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <InboxIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Open Source, Self-Hosting
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      Majority of the hanabira.org project is open sourced on
                      GitHub. Under MIT License. You can run your own
                      Hanabira server locally on laptop, alternatively you can
                      spin up Hanabira instance on your servers. License allows
                      even commercial use. Vocabulary and Grammar content is
                      offered under Creative Commons Sharealike License, meaning
                      that you basically just link hanabira.org as source and
                      then content can be pretty much freely used.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      You can easily run local instance of the whole Hanabira
                      web server. You will just need to spin up few Docker
                      containers and NGINX reverse proxy. Our documentation
                      contains step by step process how to run Hanabira on your
                      Linux server/Virtual Box VM.
                    </p>

                    <div>
                      <p className="mt-4 font-bold text-lg text-gray-500">
                        Easily Self-Host with only 3 commands!
                      </p>
                      <div className="mt-4 bg-gray-700 text-white rounded-lg p-4 relative">
                        <pre>
                          <code className="text-sm whitespace-pre-wrap">
                            git clone
                            https://github.com/tristcoil/hanabira.org.git
                            <br />
                            cd hanabira.org
                            <br />
                            docker-compose up
                          </code>
                        </pre>
                      </div>
                    </div>

                    <div className="mt-6">
                      <a
                        href="https://github.com/tristcoil/hanabira.org"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Get code on GitHub
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <blockquote>
                    <div>
                      <p className="text-base text-gray-500">
                        There are/might be some Pro features that are not open
                        sourced (yet) though.
                      </p>
                    </div>
                    <footer className="mt-3">
                      <div className="flex items-center space-x-3"></div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              <div className="mt-12 sm:mt-16 lg:mt-0">
                <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <Image
                    className="transform transition duration-300 ease-in-out hover:scale-105 w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                    src={hanabira_github}
                    alt="hanabira github"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
              <div className="mx-auto max-w-xl px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:px-0 lg:py-32">
                <div>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                      <SparklesIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                      Free Downloadable content - grammar + vocabulary
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      We are offering full content of hanabira under Creative
                      Commons license. Currently there are grammar sections for
                      Japanese, Korean, Vietnamese and Thai. We also have
                      Japanese vocabulary content with example sentences. Plus
                      streamlined Kanji dataset. Audio is downloadable too.
                      Materials are currently being corrected by native
                      speakers. So at the moment there still will be erors in
                      content, but this issue will be fixed soon.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Audio is downloadable too.
                    </p>

                    <p className="mt-4 text-lg text-gray-500">
                      Materials are currently being corrected by native
                      speakers. So at the moment there still will be erors in
                      content, but this issue will be fixed soon.
                    </p>

                    <div className="mt-6">
                      <a
                        href="/downloads"
                        className="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                      >
                        Go to Downloads
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* image kinda not looking good, so removed it temporarily */}
              {/* <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
                <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                  <img
                    className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                    src="/img/screenshots/hanabira_grammar_graph.png"
                    alt="Customer profile user interface"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Gradient Feature Section */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200">
          <div className="mx-auto max-w-4xl px-6 py-16 sm:pb-24 sm:pt-20 lg:max-w-7xl lg:px-8 lg:pt-24">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              FAQ
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-gray-700">
              Some Frequently Asked Questions we are getting often from early
              adopters/Alpha testers.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name}>
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200">
                      <feature.icon
                        className="h-6 w-6 text-gray-900"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-700">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TESTIMONIALS */}
        <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] xl:ml-0 xl:mr-[calc(50%-12rem)]"
            />
          </div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
                Testimonials
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Kind words from our Alpha Testers
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
              <figure className="rounded-2xl bg-blue-50 shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
                <blockquote className="p-6 text-gray-900 sm:p-12">
                  <p className="text-lg font-semibold leading-7 tracking-tight sm:text-xl sm:leading-8">
                    {featuredTestimonial.header}
                  </p>
                  <p className="mt-2 text-base leading-6 text-gray-700">
                    {featuredTestimonial.body}
                  </p>
                </blockquote>
              </figure>
              {testimonials.map((columnGroup, columnGroupIdx) => (
                <div
                  key={columnGroupIdx}
                  className="space-y-8 xl:contents xl:space-y-0"
                >
                  {columnGroup.map((column, columnIdx) => (
                    <div
                      key={columnIdx}
                      className={classNames(
                        (columnGroupIdx === 0 && columnIdx === 0) ||
                          (columnGroupIdx === testimonials.length - 1 &&
                            columnIdx === columnGroup.length - 1)
                          ? "xl:row-span-2"
                          : "xl:row-start-1",
                        "space-y-8"
                      )}
                    >
                      {column.map((testimonial, idx) => (
                        <figure
                          key={idx}
                          className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                        >
                          <blockquote className="text-gray-900">
                            <p className="font-bold">{testimonial.header}</p>
                            <p className="mt-2">{testimonial.body}</p>
                          </blockquote>
                        </figure>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="relative mt-24 sm:mt-32 sm:py-16">
          <div aria-hidden="true" className="hidden sm:block">
            <div className="absolute inset-y-0 left-0 w-1/2 rounded-r-3xl bg-gray-50" />
            <svg
              className="absolute left-1/2 top-8 -ml-3"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392"
            >
              <defs>
                <pattern
                  id="8228f071-bcee-4ec8-905a-2a059a2cc4fb"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={392}
                fill="url(#8228f071-bcee-4ec8-905a-2a059a2cc4fb)"
              />
            </svg>
          </div>
          <div className="mx-auto max-w-md px-6 sm:max-w-3xl lg:max-w-7xl lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-blue-500 px-6 py-10 shadow-xl sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="absolute inset-0 -mt-72 sm:-mt-32 md:mt-0"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                  viewBox="0 0 1463 360"
                >
                  <path
                    className="text-blue-400 text-opacity-40"
                    fill="currentColor"
                    d="M-82.673 72l1761.849 472.086-134.327 501.315-1761.85-472.086z"
                  />
                  <path
                    className="text-blue-600 text-opacity-40"
                    fill="currentColor"
                    d="M-217.088 544.086L1544.761 72l134.327 501.316-1761.849 472.086z"
                  />
                </svg>
              </div>
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Get notified when we&rsquo;re launching.
                  </h2>
                  <p className="mx-auto mt-6 max-w-2xl text-lg text-rose-100">
                    Plenty of development ahead. Get notified when we launch
                    hanabira.org platform.
                  </p>
                </div>

                <EmailForm />

                {/* <form onSubmit={handleSubmit} className="mt-12 sm:mx-auto sm:flex sm:max-w-lg">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-transparent px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:ml-3 sm:mt-0">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent bg-gray-900 px-5 py-3 text-base font-medium text-white shadow hover:bg-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-rose-500 sm:px-10"
                    >
                      Notify me
                    </button>
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer section */}
      {/* <footer className="mt-24 bg-gray-900 sm:mt-12">
        <div className="mx-auto max-w-md overflow-hidden px-6 py-12 sm:max-w-3xl lg:max-w-7xl lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            {footerNavigation.main.map((item) => (
              <div key={item.name} className="px-5 py-2">
                <a href={item.href} className="text-base text-gray-400 hover:text-gray-300">
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            {footerNavigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2020 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}

// ------------------------------------ testimonial contents ----------------------------------------- //

const featuredTestimonial = {
  header: "“Finally! A Japanese learning site that is perfectly… average.”",
  body: "If you have ever dreamed of spending your evenings staring at screens full of kanji, vocab, and grammar that make you question your life choices, this is the site for you. Perfect if your expectations are low and your patience is high.",
};

const testimonials = [
  [
    [
      {
        header:
          "“Oh, joy. Another Japanese learning website. Just what the internet needed.”",
        body: "Who needs innovative features or engaging content when you can have… this? It’s like if LingQ, WaniKani, and BunPro decided to go on a budget vacation together and left all their best ideas at home.",
      },
      {
        header: "“The gamification of learning is next-level.”",
        body: "Every time I click something, I get a mysterious error code. Collect them all, and maybe you unlock a secret level. It`s like Pokémon, but for software glitches. Gotta catch `em all!",
      },
      {
        header: "“Hanabira project is going places.”",
        body: "Not very far, but ... places.",
      },
      // More testimonials...
    ],
    [
      {
        header:
          "“Wow, just wow. If you’ve tried literally everything else, you might as well try this.”",
        body: "Why settle for top-notch, when you can settle for… whatever this is?",
      },
      {
        header:
          "“Congratulations, you’ve found the Toyota Corolla of Japanese learning websites.”",
        body: "It works, it gets you from point A to B, but don’t expect any thrills.”",
      },
      // More testimonials...
    ],
  ],
  [
    [
      // {
      //   header: '「期待外れで、退屈で、単調で、わかりにくくて、イライラする。」',
      //   body: 'まるで開発者たちが、すべての成功した言語学習プラットフォームを見て、「これ全部やるけど、もっと悪くしようか？」と言ったかのようです。インターフェース？ わかりにくい。レッスン？ 味気ない。',
      // },
      {
        header:
          "“Site that feels like a budget version of all the other better-known Japanese learning platforms?”",
        body: "Feels like the developers thought, “Let’s make sure we aim for the rock bottom” Mission accomplished, folks.",
      },
      {
        header:
          "“Who needs a challenge like kanji when navigating this website is the real test?”",
        body: "",
      },
      // More testimonials...
    ],
    [
      {
        header:
          "“Takes inspiration from the best, and then... throws it all away.”",
        body: "They say imitation is the sincerest form of flattery, but I’m not sure BunPro would feel flattered by this half-assed homage. Seems to me the dev heard of all the cool features but decided, “Nah, let’s just do the bare minimum instead.” Truly a masterclass in how to make learning just good enough to not close the tab.",
      },
      {
        header: "“The web frustrates the hell out of me.”",
        body: "But hey, controlling emotions is a key part of Japanese culture. This site is secretly training me to be more Zen. Sneaky but effective!",
      },
      {
        header:
          "“This platform made me appreciate my old textbooks more than ever.”",
        body: "",
      },
      // {
      //   header: '“It’s like they took all the best ideas and… well, sort of just gave up halfway.”',
      //   body: '',
      // },
      // More testimonials...
    ],
  ],
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
