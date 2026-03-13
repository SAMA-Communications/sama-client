import { ProgrammableEditorDocsBannerProps } from "./ProgrammableEditorDocsBanner.types";

export const ProgrammableEditorDocsBanner = ({
  href,
  label = "documentation",
}: ProgrammableEditorDocsBannerProps) => {
  return (
    <div className="ui:flex ui:w-full ui:justify-center ui:rounded-lg ui:bg-accent-100 ui:py-2">
      <p className="ui:font-light">
        Please read the documentation before you start:{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ui:cursor-pointer ui:font-normal ui:text-accent-500 ui:underline"
        >
          {label}
        </a>
      </p>
    </div>
  );
};
