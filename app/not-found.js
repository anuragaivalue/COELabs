import React from "react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6">
      <h2 className="font-sans text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 text-sm text-neutral-500 font-sans">
        The requested resource could not be found.
      </p>
      <a
        href="/"
        className="mt-4 inline-flex items-center rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
      >
        Return to Homepage
      </a>
    </div>
  );
}
