import React from "react";
import { Oval } from "react-loader-spinner";

export default function PageLoader() {
  return (
    <div className="pageLoader">
      <Oval
        height={100}
        width={100}
        color="#1a8ee1"
        wrapperStyle={{}}
        wrapperClass={{}}
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#8dc7f0"
        strokeWidth={2}
        strokeWidthSecondary={3}
      />
    </div>
  );
}
