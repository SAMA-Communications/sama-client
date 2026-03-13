import { InteractiveDateProps } from "./InteractiveDate.types";

const defaultOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  day: "numeric",
  month: "short",
};

export const InteractiveDate = ({ date, locale = "en-US", options = defaultOptions }: InteractiveDateProps) => {
  const value = typeof date === "number" ? date * 1000 : date;
  const formatted = new Date(value).toLocaleDateString(locale, options);

  return (
    <div className="ui:flex ui:justify-center ui:py-2">
      <span className="ui:mb-1.25 ui:p-2 ui:font-light ui:text-text-dark/40">{formatted}</span>
    </div>
  );
};
