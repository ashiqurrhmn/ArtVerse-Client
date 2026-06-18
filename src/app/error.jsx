"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Runtime Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertOctagon className="size-12" />
      </div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
        Something went wrong.
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        An unexpected error has occurred. Please try reloading the page.
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <RotateCcw className="size-4" />
        Reload
      </button>
    </div>
  );
}
