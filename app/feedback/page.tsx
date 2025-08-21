"use client";

import { useState } from "react";
import { useFeedback } from "@/src/context/FeedbackContext";
import toast, { Toaster } from "react-hot-toast";

export default function FeedbackPage() {
  const { submitFeedback, loading, error } = useFeedback();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const msg = await submitFeedback(name, message);
      if (msg) {
        toast.success(msg); // e.g. "John, thank you for your feedback!"
        setName("");
        setMessage("");
      } else if (error) {
        toast.error(error);
      } else {
        toast.error("Failed to submit feedback.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Unexpected error occurred.");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <Toaster position="top-right" />

      {/* Header with theme toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-foreground">
            Share Your Feedback
          </h1>
          <p className="text-muted-foreground mt-2">
            We value your thoughts — let us know how we can improve.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-card p-6 rounded-xl shadow-md"
      >
        <input
          className="w-full border rounded-lg px-4 py-2 bg-input focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          className="w-full border rounded-lg px-4 py-2 bg-input focus:ring-2 focus:ring-primary focus:outline-none"
          placeholder="Your feedback"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg shadow hover-lift disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
