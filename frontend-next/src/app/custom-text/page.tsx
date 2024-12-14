"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getUserFromCookies } from "@/utils/helperFunctions";

//import TextModal from './TextModal'; // Adjust path as needed

const JapaneseTexts = () => {
  const [userId, setUserId] = useState(null);
  const [texts, setTexts] = useState([]);
  const [newText, setNewText] = useState({
    topic: "",
    sourceLink: "",
    actualText: "",
    p_tag: "text",
    s_tag: "text",
    userId: "", // empty user initially
    lang: "jp",
  });
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    const fetchuserId = async () => {
      const { userId, userName, jwt } = getUserFromCookies();
      setUserId(userId);
      setNewText((prev) => ({ ...prev, userId })); // Update newText with userId
    };

    fetchuserId();
  }, []);

  useEffect(() => {
    fetchTexts();
  }, []);

  const fetchTexts = async () => {
    try {
      const response = await axios.get("/f-api/v1/japanese-texts");
      setTexts(response.data);
    } catch (error) {
      console.error("Error fetching texts:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewText({ ...newText, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/f-api/v1/japanese-texts", newText);
      setTexts([...texts, response.data]);
      setNewText({
        topic: "",
        sourceLink: "",
        actualText: "",
        p_tag: "text",
        s_tag: "text",
        userId: userId,
        lang: "jp",
      });
    } catch (error) {
      console.error("Error posting new text:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/f-api/v1/japanese-texts/${id}`);
      setTexts(texts.filter((text) => text._id !== id));
      if (selectedText && selectedText._id === id) {
        setSelectedText(null); // Close the modal if the deleted text is currently selected
      }
    } catch (error) {
      console.error("Error deleting text:", error);
    }
  };

  const handleCardClick = (text) => {
    setSelectedText(text);
  };

  const handleCloseModal = () => {
    setSelectedText(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Custom Japanese Text
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-md shadow-md mb-12 max-w-4xl"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <input
              type="text"
              name="topic"
              value={newText.topic}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Source Link
            </label>
            <input
              type="url"
              name="sourceLink"
              value={newText.sourceLink}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Actual Text
            </label>
            <textarea
              name="actualText"
              value={newText.actualText}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              rows={5}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Parent Tag
            </label>
            <input
              type="text"
              name="p_tag"
              value={newText.p_tag}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sub Tag
            </label>
            <input
              type="text"
              name="s_tag"
              value={newText.s_tag}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="text"
              name="userId"
              value={newText.userId}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <input
              type="text"
              name="lang"
              value={newText.lang}
              onChange={handleInputChange}
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Add Text
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Stored Japanese Texts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {texts.map((text) => (
          <div
            key={text._id}
            className="p-4 bg-gray-50 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 flex flex-col justify-between"
            onClick={() => handleCardClick(text)}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {text.topic}
              </h3>
              <p className="text-sm text-gray-500">ID: {text._id}</p>
              <p className="text-gray-700 mt-2 max-h-16 overflow-hidden text-ellipsis">
                {text.actualText}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Source:{" "}
                <a href={text.sourceLink} className="text-blue-500 underline">
                  {text.sourceLink}
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Parent Tag: {text.p_tag} | Sub Tag: {text.s_tag}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                User ID: {text.userId} | Language: {text.lang}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent the card click from triggering when delete is clicked
                handleDelete(text._id);
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {selectedText && (
        <TextModal
          textData={selectedText}
          onClose={handleCloseModal}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default JapaneseTexts;

// ----------------- components -------------------- //

//import React from 'react';

const TextModal = ({ textData, onClose, onDelete }) => {
  if (!textData) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">{textData.topic}</h2>
        <div className="mb-4 max-h-[50vh] overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-line">
            {textData.actualText}
          </p>
        </div>
        <p className="text-sm text-gray-500">ID: {textData._id}</p>
        <p className="text-sm text-gray-500">
          Source:{" "}
          <a href={textData.sourceLink} className="text-blue-500 underline">
            {textData.sourceLink}
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Parent Tag: {textData.p_tag} | Sub Tag: {textData.s_tag}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          User ID: {textData.userId} | Language: {textData.lang}
        </p>
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => onDelete(textData._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

//  export default TextModal;
