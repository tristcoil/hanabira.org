// components/MarkdownContent.tsx

import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';


//tailwind markdown pkg documentation
//https://www.npmjs.com/package/@tailwindcss/typography

interface MarkdownContentProps {
  lang: string;
  slug: string;
}

function MarkdownContent({ lang, slug }: MarkdownContentProps) {
  const decodedSlug = decodeURIComponent(slug);

  // Sanitize and process the slug
  //const sanitizedSlug = decodedSlug.replace(/\s+/g, '_');
  // Sanitize and process the slug   Korean grammar has hundreds of slashes so we replace / by -, because that is our file structure naming
  const sanitizedSlug = decodedSlug.replace(/\s+/g, '_').replace(/\//g, '-');


  // Validate the slug to prevent path traversal attacks
  // if (!/^[a-zA-Z0-9-_]+$/.test(sanitizedSlug)) {
  //   return <div>Invalid slug.</div>;
  // }

  const fileName = `${sanitizedSlug}.md`;

  console.log(decodedSlug)
  console.log(sanitizedSlug)
  console.log(fileName)



  // Construct the file path
  //const contentDirectory = path.join(process.cwd(), 'content');
  
  // Determine the content directory based on the language
  let contentDirectory;
  if (lang === 'jap') {
    contentDirectory = path.join(process.cwd(), 'content', 'markdown_grammar_japanese');
  } else if (lang === 'kor') {
    contentDirectory = path.join(process.cwd(), 'content', 'markdown_grammar_korean');
  } else if (lang === 'mandarin') {
    contentDirectory = path.join(process.cwd(), 'content', 'markdown_grammar_mandarin');
  } else {
    contentDirectory = path.join(process.cwd(), 'content'); // default path if needed
  }  
  
  const markdownFilePath = path.join(contentDirectory, fileName);

  // Resolve the file path and ensure it is within the content directory
  const resolvedPath = path.resolve(markdownFilePath);
  if (!resolvedPath.startsWith(contentDirectory)) {
    return <div>Invalid slug.</div>;
  }



  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    return <div>Markdown file not found.</div>;
  }

  // Read the file content
  const fileContents = fs.readFileSync(resolvedPath, 'utf8');

  // Convert Markdown to HTML
  const rawContent = marked(fileContents);

  // Set up DOMPurify with jsdom
  const window = new JSDOM('').window as unknown as Window;
  const DOMPurifyInstance = DOMPurify(window);

  // Sanitize the HTML
  const content = DOMPurifyInstance.sanitize(rawContent);

  return (
    <article className="prose prose-slate mx-auto p-4 max-w-full">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}

export default MarkdownContent;

// ---------------------------------------------------------------------------




// import fs from 'fs';
// import path from 'path';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// interface MarkdownContentProps {
//   slug: string;
// }

// function MarkdownContent({ slug }: MarkdownContentProps) {
//   const decodedSlug = decodeURIComponent(slug);

//   // Sanitize and process the slug
//   const sanitizedSlug = decodedSlug.replace(/\s+/g, '_');

//   const fileName = `${sanitizedSlug}.md`;

//   // Construct the file path
//   const contentDirectory = path.join(process.cwd(), 'content');
//   const markdownFilePath = path.join(contentDirectory, fileName);

//   // Resolve the file path and ensure it is within the content directory
//   const resolvedPath = path.resolve(markdownFilePath);
//   if (!resolvedPath.startsWith(contentDirectory)) {
//     return <div>Invalid slug.</div>;
//   }

//   // Check if the file exists
//   if (!fs.existsSync(resolvedPath)) {
//     return <div>Markdown file not found.</div>;
//   }

//   // Read the file content
//   const fileContents = fs.readFileSync(resolvedPath, 'utf8');

//   return (
//     <div className="prose prose-lg prose-slate mx-auto p-4 max-w-full">
//       <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContents}</ReactMarkdown>
//     </div>
//   );
// }

// export default MarkdownContent;

