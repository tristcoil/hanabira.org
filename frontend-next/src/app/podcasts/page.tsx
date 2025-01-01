// TODO:
// I think custom videos should be saved in f-api since these are user specific,
// eventually retrieval should be protected by decorator
// putting it under text parser was just temp workaround for speed of dev
// it is technical debt

// pages/index.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { getUserFromCookies } from "@/utils/helperFunctions";

import { useUser } from "@/context/UserContext";

// Dummy data for other video categories (replace with your actual data)
// const podcasts = []; // Replace with your actual data
// const commonSituations = [];
// const techReviews = [];
// const travelVlogs = [];

const Home = () => {
  const [podcastVideos, setPodcastVideos] = useState([]);
  const [situationVideos, setSituationVideos] = useState([]);
  const [techReviewVideos, setTechReviewVideos] = useState([]);
  const [travelVlogVideos, setTravelVlogVideos] = useState([]);
  const [customVideos, setCustomVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    url: "",
    customTitle: "",
    customDescription: "",
    userId: "", // empty userId initially
    p_tag: "youtube", // New field
    s_tag: "video", // New field
    lang: "jp", // New field with default value
  });

  const { userId, loggedIn } = useUser();

  // Add the following useEffect after your imports and before your existing useEffect:
  useEffect(() => {
    //const { userId, jwt } = getUserFromCookies();
    setNewVideo((prev) => ({ ...prev, userId }));
    //axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
  }, []);

  // In fetchCustomVideos, handleSubmit, and handleDelete functions, no further changes are needed
  // since axios.defaults.headers.common['Authorization'] is now set.

  useEffect(() => {
    setPodcastVideos(podcasts.map(getVideoData));
    setSituationVideos(commonSituations.map(getVideoData));
    setTechReviewVideos(techReviews.map(getVideoData));
    setTravelVlogVideos(travelVlogs.map(getVideoData));

    // Fetch custom videos from backend
    fetchCustomVideos();
  }, []);

  const fetchCustomVideos = async () => {
    try {
      const response = await axios.get("/f-api/v1/custom-videos");
      setCustomVideos(response.data.map(getVideoData));
    } catch (error) {
      console.error("Error fetching custom videos:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/f-api/v1/custom-videos", newVideo);
      setCustomVideos([...customVideos, getVideoData(response.data)]);

      // Reset specific fields
      setNewVideo((prevState) => ({
        ...prevState, // retain previous values
        url: "", // reset URL
        customTitle: "", // reset title
        customDescription: "", // reset description
        // userId, p_tag, s_tag, and lang can be retained or reset based on your needs
      }));
    } catch (error) {
      console.error("Error posting new video:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/f-api/v1/custom-videos/${id}`);
      setCustomVideos(customVideos.filter((video) => video.id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Form to add new custom video */}
      <h1 className="text-2xl font-bold mb-8">Add Your Custom YouTube Video</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        {/* YouTube Video URL */}
        <div className="mb-4">
          <label className="block text-gray-700">YouTube Video URL:</label>
          <input
            type="text"
            name="url"
            value={newVideo.url}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        {/* Custom Title */}
        <div className="mb-4">
          <label className="block text-gray-700">Custom Title:</label>
          <input
            type="text"
            name="customTitle"
            value={newVideo.customTitle}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {/* Custom Description */}
        <div className="mb-4">
          <label className="block text-gray-700">Custom Description:</label>
          <textarea
            name="customDescription"
            value={newVideo.customDescription}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Add Video
        </button>
      </form>

      {/* Custom Videos Section */}
      <h1 className="text-2xl font-bold mb-8">Custom YouTube Videos</h1>
      <VideoSection
        title="Custom Videos"
        videos={customVideos}
        onDelete={handleDelete}
      />

      {/* YouTube Channels */}
      <CollapsibleSection title="YouTube Channels">
        {/* Podcasts */}
        <h2 className="font-bold mt-4 mb-2">Podcasts</h2>
        <p>
          Bite Size Japanese:{" "}
          <a
            href="https://www.youtube.com/@the_bitesize_japanese_podcast"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@the_bitesize_japanese_podcast
          </a>
        </p>
        <p>
          Yoshie 【Wasabi】Listening daily Japanese:{" "}
          <a
            href="https://www.youtube.com/@Wasabito.Listening.Japanese"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Wasabito.Listening.Japanese
          </a>
        </p>
        <p>
          YUYUの日本語Podcast:{" "}
          <a
            href="https://www.youtube.com/@yuyunihongopodcast"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@yuyunihongopodcast
          </a>
        </p>

        {/* Daily situations */}
        <h2 className="font-bold mt-4 mb-2">Daily situations</h2>
        <p>
          Akane Nihongo:{" "}
          <a
            href="https://www.youtube.com/@Akane-JapaneseClass/videos"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Akane-JapaneseClass/videos
          </a>
        </p>

        {/* Long form */}
        <h2 className="font-bold mt-4 mb-2">Long form reading</h2>
        <p>
          Japanese Listening Shower:{" "}
          <a
            href="https://www.youtube.com/@Japanese-Listening-Shower/videos"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Japanese-Listening-Shower/videos
          </a>
        </p>

        {/* Grammar */}
        <h2 className="font-bold mt-4 mb-2">Grammar</h2>
        <p>
          Nihongo No Mori 日本語の森:{" "}
          <a
            href="https://www.youtube.com/@nihongonomori2013"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@nihongonomori2013
          </a>
        </p>
        <p>
          Game Gengo ゲーム言語:{" "}
          <a
            href="https://www.youtube.com/@GameGengo"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@GameGengo
          </a>
        </p>

        {/* Tech */}
        <h2 className="font-bold mt-4 mb-2">Tech channels</h2>

        {/* Korean */}
        <h2 className="font-bold mt-4 mb-2">Korean</h2>

        <p>
          TTMK Talk To Me In Korean:{" "}
          <a
            href="https://www.youtube.com/@talktomeinkorean"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@talktomeinkorean
          </a>
        </p>

        <p>
        Hailey _Your Korean Friend:{" "}
          <a
            href="https://www.youtube.com/@koreanfriendhailey"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@koreanfriendhailey
          </a>
        </p>

        <p>
        Dong Grammy Korean:{" "}
          <a
            href="https://www.youtube.com/@DongGrammyKorean"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@DongGrammyKorean
          </a>
        </p>







        {/* <p>
          Japanese Listening Shower:{' '}
          <a
            href="https://www.youtube.com/@Japanese-Listening-Shower/videos"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Japanese-Listening-Shower/videos
          </a>
        </p>
        <p>
          Akane Nihongo:{' '}
          <a
            href="https://www.youtube.com/@Akane-JapaneseClass/videos"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Akane-JapaneseClass/videos
          </a>
        </p>
        <p>
          Akane Nihongo:{' '}
          <a
            href="https://www.youtube.com/@Akane-JapaneseClass/videos"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.youtube.com/@Akane-JapaneseClass/videos
          </a>
        </p> */}

        {/* Add more channels here if needed */}
      </CollapsibleSection>

      {/* Video Sections */}
      <h1 className="text-2xl font-bold mt-5 mb-5">YouTube Videos</h1>
      <VideoSection title="Podcasts" videos={podcastVideos} />
      <VideoSection title="Common Situations" videos={situationVideos} />
      {/* TODO: add tech reviews, travel vlogs and so on */}
      {/* <VideoSection title="Tech Reviews" videos={techReviewVideos} /> */}
      {/* <VideoSection title="Travel Vlogs" videos={travelVlogVideos} /> */}
    </div>
  );
};

export default Home;

// Helper functions
const getVideoId = (url) => {
  const urlObj = new URL(url);
  return urlObj.searchParams.get("v");
};

const getVideoData = (video) => {
  const videoId = getVideoId(video.url);
  return {
    id: video._id || videoId, // Ensure the ID is coming from MongoDB (_id)
    title: video.customTitle || "Untitled Video",
    description: video.customDescription || "",
    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    internalLink: `/text-parser?type=youtube&url=https://www.youtube.com/watch?v=${videoId}`,
  };
};

// VideoSection Component
const VideoSection = ({
  title,
  videos,
  onDelete = null,
  initialOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="mb-8">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-xl font-bold mb-4 p-4 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={video.internalLink}>
                <div>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{video.title}</h3>
                    <p className="text-gray-600">{video.description}</p>
                  </div>
                </div>
              </Link>
              {onDelete && (
                <div className="p-4">
                  <button
                    onClick={() => onDelete(video.id)}
                    className="mt-2 bg-red-500 text-white p-2 rounded-md w-full"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// CollapsibleSection Component
const CollapsibleSection = ({ title, children, initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-2xl font-bold mt-5 mb-5 p-4 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none"
      >
        <span>{title}</span>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isOpen && <div>{children}</div>}
    </div>
  );
};

// --- //

const podcasts = [
  {
    url: "https://www.youtube.com/watch?v=-cbuS40rNSw",
    customTitle: "BSJ Podcast) 仕事",
    customDescription: "Description for podcast 1",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=-cbuS40rNSw",
  },
  {
    url: "https://www.youtube.com/watch?v=UQ05S65tKPc",
    customTitle: "BSJ Podcast) 外国人",
    customDescription: "Description for podcast 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=UQ05S65tKPc",
  },
  // Add more podcast data here
];

const commonSituations = [
  {
    url: "https://www.youtube.com/watch?v=ihRjDwIyxk0",
    customTitle: "【日本語の会話】飲食店で注文したり会計したりするときの日本語",
    customDescription: "Description for situation 1",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=ihRjDwIyxk0",
  },
  {
    url: "https://www.youtube.com/watch?v=X9auVKiZgsM",
    customTitle: "ホテルに泊まる時使う日本語ーチェックイン・部屋にあるものー",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=X9auVKiZgsM",
  },
  {
    url: "https://www.youtube.com/watch?v=eShOGfMx9FI",
    customTitle:
      "【日本語の単語】日本の市場(マーケット)で買い物するときの日本語／野菜の名前も紹介します",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=eShOGfMx9FI",
  },
  {
    url: "https://www.youtube.com/watch?v=Loo_gHCBJoE",
    customTitle: "【日本語の会話】飛行機に乗るとき使う日本語",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=Loo_gHCBJoE",
  },
  {
    url: "https://www.youtube.com/watch?v=faKYinAtlIo",
    customTitle: "Helpful Japanese When Ordering at a Restaurant",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=faKYinAtlIo",
  },
  {
    url: "https://www.youtube.com/watch?v=r20IdWOSBFE",
    customTitle:
      "【Japanese Conversation】 Cafe Conversation｜Entering, Ordering, and Accounting",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=r20IdWOSBFE",
  },
  {
    url: "https://www.youtube.com/watch?v=01xtlnL137o",
    customTitle:
      "Transportation Vocabulary in Japanese｜From Haneda Airport to Hamamatsucho",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=01xtlnL137o",
  },
  {
    url: "https://www.youtube.com/watch?v=JcxtN746mwM",
    customTitle: "【千葉Vlog】旅行で使う日本語",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=JcxtN746mwM",
  },
  {
    url: "https://www.youtube.com/watch?v=1IfmD0xsye0",
    customTitle: "【日本語の会話】カフェで店員さんと話す／千葉Vlog",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=1IfmD0xsye0",
  },
  {
    url: "https://www.youtube.com/watch?v=Wq4bP5CPd0c",
    customTitle: "【日本語の単語】旅行するとき持って行くもの",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=Wq4bP5CPd0c",
  },
  {
    url: "https://www.youtube.com/watch?v=W1BiwaKK5_I",
    customTitle: "KFCで注文するときの日本語",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=W1BiwaKK5_I",
  },
  {
    url: "https://www.youtube.com/watch?v=YMPE08J4lTw",
    customTitle: "【千葉Vlog】カフェで注文するときの日本語",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=YMPE08J4lTw",
  },
  {
    url: "https://www.youtube.com/watch?v=EiYp4IG528A",
    customTitle:
      "【日本語Vlog】羽田エアポートガーデンで食べる！買い物する！泊まる！Tokyo International Airport",
    customDescription: "Description for situation 2",
    internalLink:
      "/text-parser?type=youtube&url=https://www.youtube.com/watch?v=EiYp4IG528A",
  },
  // Add more common situation data here
];

const techReviews = [
  {
    url: "https://www.youtube.com/watch?v=example5",
    customTitle: "Tech Review Title 1",
    customDescription: "Description for tech review 1",
    internalLink: "/tech-review/1",
  },
  {
    url: "https://www.youtube.com/watch?v=example6",
    customTitle: "Tech Review Title 2",
    customDescription: "Description for tech review 2",
    internalLink: "/tech-review/2",
  },
  // Add more tech review data here
];

const travelVlogs = [
  {
    url: "https://www.youtube.com/watch?v=example3",
    customTitle: "Situation Title 1",
    customDescription: "Description for situation 1",
    internalLink: "/situation/1",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },
  {
    url: "https://www.youtube.com/watch?v=example4",
    customTitle: "Situation Title 2",
    customDescription: "Description for situation 2",
    internalLink: "/situation/2",
  },

  // Add more common situation data here
];
