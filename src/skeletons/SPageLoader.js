import React from "react";
import { Oval } from "react-loader-spinner";

export default function SPageLoader() {
  return (
    <div className="page-loader fcc">
      <Oval
        height={100}
        width={100}
        color="var(--color-accent-dark)"
        wrapperStyle={{}}
        wrapperClass={{}}
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="var(--color-accent-dark)"
        strokeWidth={2}
        strokeWidthSecondary={3}
      />
    </div>
  );
}
