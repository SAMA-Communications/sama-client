import React from "react";

import "@styles/helpers/ErrorPage.css";

import { ReactComponent as PageNotFound } from "@icons/PageNotFound.svg";

export default function ErrorPage() {
  return (
    <div className="text-error">
      <p>Page not found.</p>
      <PageNotFound />
    </div>
  );
}
