"use client";

import React, { useState, useEffect, useRef } from 'react';

interface DictionaryEntryWrapperProps {
  searchString: string;
}

const DictionaryEntryWrapper: React.FC<DictionaryEntryWrapperProps> = ({ searchString }) => {
  const [entry, setEntry] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchString) {
        console.log("No search term provided.");
        setError(new Error("Please provide a search term."));
        setEntry([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const encodedWord = encodeURIComponent(searchString);
        const response = await fetch(`http://localhost:5200/vocabulary/${encodedWord}`);
        console.log("Response received:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Data parsed successfully:", data);
        setEntry([data]); // Assuming data is an array of entries
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch data"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchString]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {entry.map((entryItem, index) => (
        <DictionaryEntry key={index} entry={entryItem} />
      ))}
    </div>
  );
};

export default DictionaryEntryWrapper;




// -------------------------------- sub component -------------------------------



interface DictionaryEntryProps {
  entry: any; // This can be more specific if you know the structure of `entry`
}

const DictionaryEntry: React.FC<DictionaryEntryProps> = ({ entry }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Access properties in a way that assumes they exist and are of the expected type
  const word: string = entry["0"];
  const reading: string = entry["1"];
  const details: any[] = entry["5"]; // We use any[] here, but this could be more specific if the data structure is known
  ////////const audioUrl = `/audio/jitendex_audio/v_${encodeURIComponent(word)}.mp3`;
  const audioUrl: string = `/audio/jitendex_audio/v_自衛権.mp3`; // hardcoded placeholder

  const togglePlay = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-slate-600 p-4">
      <h1 className="text-2xl mb-2 flex items-center">
        {word} [{reading}]
        <button
          onClick={togglePlay}
          className="ml-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg px-2 py-1"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      </h1>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      {details.map((detail, index) => (
        <section key={index}>{renderContent(detail.content)}</section>
      ))}
    </div>
  );
};




// -------------------------- Functions -------------------------------------------


// Define an interface that allows any kind of properties
interface ContentProps {
  [key: string]: any; // This allows any kind of properties
}

type Content = string | ContentProps | ContentProps[];

// Adjust the return type to always be JSX.Element[] for consistency
function renderContent(content: Content): JSX.Element[] {
  if (Array.isArray(content)) {
    // Flatten the array if needed and ensure it always returns JSX.Element[]
    return content.flatMap((item) => renderContent(item));
  } else if (typeof content === "object" && content !== null) {
    const { tag, ...props } = content;

    let element: JSX.Element;
    switch (tag) {
      case "a":
        element = <a {...props}>{renderContent(props.content)}</a>;
        break;
      case "div":
        element = <div {...props}>{renderContent(props.content)}</div>;
        break;
      case "span":
        element = <span {...props}>{renderContent(props.content)}</span>;
        break;
      case "ul":
        element = <ul {...props}>{renderContent(props.content)}</ul>;
        break;
      case "li":
        element = <li {...props}>{renderContent(props.content)}</li>;
        break;
      case "ruby":
        element = <ruby {...props}>{renderContent(props.content)}</ruby>;
        break;
      case "rt":
        element = <rt {...props}>{renderContent(props.content)}</rt>;
        break;
      default:
        // Fallback to a simple fragment if no specific tag is matched
        element = <>{props.content || content}</>;
    }
    return [element];
  } else {
    // Handle plain strings and non-object, non-null cases
    return [<>{content}</>];
  }
}








