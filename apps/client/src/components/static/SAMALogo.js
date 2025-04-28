import SAMALogoSvg from "@assets/Logo.svg?react";

export default function SAMALogo({ customClassName = "" }) {
  return (
    <div className={`${customClassName}`}>
      <SAMALogoSvg className={`w-full`} />
    </div>
  );
}
