"use client";
import React, { useEffect, useState } from "react";

interface SpinnerMessage {
  delay: number; // in ms
  text: string;
}

interface SpinnerProps {
  text?: string; // initial message
  messages?: SpinnerMessage[]; // additional timed messages
}

export const Loading: React.FC<SpinnerProps> = ({
  text = "",
  messages = [
    {
      delay: 15000,
      text: "This may take up to a minute. Thanks for your patience!",
    },
    {
      delay: 45000,
      text: "Still working...",
    },
  ],
}) => {
  const [message, setMessage] = useState(text);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    messages.forEach(({ delay, text }) => {
      const timeout = setTimeout(() => setMessage(text), delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [messages]);

  return (
    <>
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/50 pointer-events-none">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <span className="ml-4 text-sm text-gray-700">{message}</span>
      </div>
      <style>
        {`
        @keyframes progress {
          0% { left: -100%; width: 100%; }
          50% { left: 100%; width: 10%; }
          100% { left: 100%; width: 10%; }
        }
      `}
      </style>
    </>
  );
};

export default Loading;
