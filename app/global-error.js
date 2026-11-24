"use client";

import React from "react";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h2 className="font-sans text-2xl font-bold">Something went wrong</h2>
        <p className="mt-2 text-sm text-neutral-500 font-sans">
          An unexpected error occurred while loading this page.
        </p>
        <button
          onClick={() => reset()}
          className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
