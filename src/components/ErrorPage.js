import React from "react";
import { VscFileCode } from "react-icons/vsc";

import "../styles/ErrorPage.css";

export default function ErrorPage(params) {
  return (
    <div className="text-error">
      <p>Page not found</p> <VscFileCode />
    </div>
  );
}
