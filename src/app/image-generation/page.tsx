"use client";

import {
  faFaceGrinStars,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OpenAI from "openai";
import { useEffect, useState } from "react";

export default function ImageGeneration() {
  const [chats, setChats] = useState(
    [] as {
      message: string;
      isUser: boolean;
      revisied_prompt?: string;
      url?: string;
    }[]
  );
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (message.length > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [message]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        setMessage((prevMessage) => `${prevMessage}\n`);
      } else {
        handleClick();
      }
      event.preventDefault();
    }
  };

  const handleClick = async () => {
    setChats([
      ...chats,
      { message, isUser: true, revisied_prompt: "", url: "" },
    ]);

    setIsProcessing(true);
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: message,
        n: 1,
        size: "1024x1024",
      });

      setChats((prevChats) => [
        ...prevChats,
        {
          message: "",
          isUser: false,
          revisied_prompt: response.data[0].revised_prompt,
          url: response.data[0].url,
        },
      ]);

      setIsProcessing(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setMessage("");
    }
  };

  const renderChat = () => {
    if (chats.length > 0) {
      return chats.map((chat, index) => {
        return (
          <div
            key={index}
            className={`flex gap-4 ${
              chat.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-[50vw] ${
                chat.isUser ? "bg-slate-900 text-white" : "bg-slate-700"
              }`}
            >
              {chat.isUser ? (
                chat.message
              ) : (
                <>
                  <div className="text-xs mb-2 text-slate-300">
                    {chat.revisied_prompt}
                  </div>
                  <img
                    src={chat.url}
                    alt="Generated Image"
                    className="rounded-lg"
                  />
                </>
              )}
            </div>
          </div>
        );
      });
    }

    return (
      <div className="flex flex-col gap-2 justify-center items-center h-full">
        <FontAwesomeIcon
          icon={faFaceGrinStars}
          className="h-8 w-8 text-slate-300"
        />
        <div className="text-slate-300">Start by typing a prompt below</div>
      </div>
    );
  };

  return (
    <div className="relative max-w-7xl p-4 bg-slate-800">
      <div className="h-screen overflow-auto flex flex-col gap-2">
        {renderChat()}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex items-center gap-4">
        <textarea
          className="textarea resize-none w-full border-0 bg-slate-900"
          placeholder="Input Prompt..."
          style={{ height: "1rem" }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={message}
          disabled={isProcessing}
        ></textarea>
        <button
          className="btn btn-rounded bg-slate-900"
          disabled={isButtonDisabled || isProcessing}
          onClick={handleClick}
        >
          <FontAwesomeIcon
            icon={isProcessing ? faSpinner : faPaperPlane}
            spinPulse={isProcessing}
            className="h-5 w-5"
          />
        </button>
      </div>
    </div>
  );
}
