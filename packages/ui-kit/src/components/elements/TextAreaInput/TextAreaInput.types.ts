/** Unstyled textarea with explicit ref and event props (no WrapperRoot). */
export interface TextAreaInputProps {
  id?: string;
  className?: string;
  /** Ref for the textarea element. */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  /** Input change handler. */
  onInput?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  /** Key down handler. */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Blur handler. */
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
}
