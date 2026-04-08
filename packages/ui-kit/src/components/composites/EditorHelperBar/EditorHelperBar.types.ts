import type { WrapperRootProps } from "@elements/WrapperRoot";

/** Single action in the editor help tooltip. */
export interface EditorHelperAction {
  label: string;
  onClick: () => void;
}

export interface EditorHelperBarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  docsHref: string;
  docsLabel?: string;
  tooltipId: string;
  actions: EditorHelperAction[];
  /** Optional custom class for action buttons in tooltip */
  actionButtonClassName?: string;
}
