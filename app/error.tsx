// app/error.tsx
"use client"; // required for error.tsx

import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-red-50">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Something went wrong!
      </h2>
      <p className="text-slate-700 mb-6">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() =>
          startTransition(() => {
            router.refresh();
            reset();
          })
        }
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
