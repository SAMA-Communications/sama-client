import React from "react";

import "../styles/ErrorPage.css";

export default function ErrorPage() {
  return (
    <div className="text-error">
      <p>Page not found</p>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M58.6667 32C58.6667 46.72 46.72 58.6667 32 58.6667C17.28 58.6667 8.29337 43.84 8.29337 43.84M8.29337 43.84H20.3467M8.29337 43.84V57.1734M5.33337 32C5.33337 17.28 17.1734 5.33337 32 5.33337C49.7867 5.33337 58.6667 20.16 58.6667 20.16M58.6667 20.16V6.82671M58.6667 20.16H46.8267"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
