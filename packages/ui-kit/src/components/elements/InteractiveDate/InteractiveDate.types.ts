/** Unix timestamp in seconds or Date-compatible value */
export type DateInput = number | string | Date;

export interface InteractiveDateProps {
  date: DateInput;
  /** Locale for formatting (default "en-US") */
  locale?: string;
  /** Options for toLocaleDateString */
  options?: Intl.DateTimeFormatOptions;
}
