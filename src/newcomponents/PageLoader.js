import React from "react";
import { FallingLines } from "react-loader-spinner";

export default function PageLoader() {
  return (
    <div className="page-loader fcc">
      <FallingLines
        color="var(--color-accent-dark)"
        width={100}
        visible={true}
        ariaLabel="falling-circles-loading"
      />
    </div>
  );
}
