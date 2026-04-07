/** Payload for the floating summary chip. */
export interface SummaryContent {
  isLoading?: boolean;
  text?: string;
  filter?: string;
}

/** Floating “missed summary” panel; returns null when `summaryContent` is missing. */
export interface SummaryContainerProps {
  summaryContent: SummaryContent | null | undefined;
  onClose: () => void;
  /** Optional label for filter type (e.g. "Last 7 days") */
  getFilterLabel?: (filter: string | undefined) => string;
}
