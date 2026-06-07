"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { FeedbackAPI, ApiError } from "@/lib/api";

// Shape returned by your backend after api() unwraps { success, data }
type CreateFeedbackResponse = {
  id?: string; // mongoose virtual id
  _id?: string; // raw ObjectId (if you ever include it)
  name: string;
  message: string; // e.g. "John, thank you for your feedback!"
};

interface FeedbackContextType {
  // Return the server's personalized success message (or null on failure)
  submitFeedback: (name: string, feedback: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(
  undefined
);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = async (
    name: string,
    feedback: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = (await FeedbackAPI.create({
        name,
        feedback,
      })) as CreateFeedbackResponse;

      // Basic sanity checks
      const id = res?.id ?? res?._id;
      if (!id || !res?.message) {
        throw new ApiError("Invalid server response: missing id/message");
      }

      // Return the personalized message so the page can toast it
      return res.message;
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr?.message || "Something went wrong.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider value={{ submitFeedback, loading, error }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const ctx = useContext(FeedbackContext);
  if (!ctx)
    throw new Error("useFeedback must be used within a FeedbackProvider");
  return ctx;
};
