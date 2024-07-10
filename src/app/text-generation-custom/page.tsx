"use client";

import {
  faFaceGrinStars,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faSpinner,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import OpenAI from "openai";
import { useEffect, useState } from "react";

export default function TextGenerationCustom() {
  const [chats, setChats] = useState([
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
  ] as { role: string; content: string }[]);
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
    setChats((prevChats) => [...prevChats, { role: "user", content: message }]);

    setIsProcessing(true);
    try {
      const response = await openai.completions.create({
        prompt: message,
        model: "ft:davinci-002:personal:harfu-school:9jNYdc2F",
      });

      response.choices.forEach((choice) => {
        setChats((prevChats) => [
          ...prevChats,
          {
            role: "assistant",
            content: choice.text.trim(),
          },
        ]);
      });

      setIsProcessing(false);
      setMessage("");
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setMessage("");
    }
  };

  const handleClear = () => {
    setChats([]);
  };

  const renderChat = () => {
    if (chats.length > 0) {
      return chats.map((chat, index) => {
        if (chat.role === "system") {
          return null;
        }

        return (
          <div
            key={index}
            className={`flex gap-4 ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-4 rounded-lg max-w-[50vw] ${
                chat.role === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-700"
              }`}
            >
              {chat.content}
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
      <div className="fixed top-0 left-0 right-0 flex justify-between bg-slate-900 p-4">
        <div className="flex gap-4">
          <Link href="/">
            <FontAwesomeIcon icon={faArrowLeft} className="text-slate-300" />
          </Link>
          <div className="text-slate-300">Harfu's School</div>
        </div>
        <div>
          <FontAwesomeIcon
            onClick={handleClear}
            icon={faTrash}
            className={`text-red-400 cursor-pointer ${
              chats.length > 0 ? "" : "hidden"
            }`}
          />
        </div>
      </div>
      <div className="h-screen overflow-auto flex flex-col gap-2 py-16">
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
