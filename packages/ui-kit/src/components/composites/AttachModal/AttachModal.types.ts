import type { MediaAttachmentData } from "../../elements/MediaAttachment";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface AttachModalProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onInput" | "onKeyDown"> {
  /** List of files to show (shape for MediaAttachments) */
  files: MediaAttachmentData[];
  /** Remove file at index */
  onRemoveFile: (index: number) => void;
  /** Send message / confirm */
  onSend: (e?: React.MouseEvent) => void;
  /** Cancel / close */
  onCancel: () => void;
  /** Add more files (e.g. open file picker) */
  onAddMore: () => void;
  /** Ref for the message textarea */
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  /** Textarea input handler */
  onInput?: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  /** Textarea key down handler */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Textarea placeholder */
  placeholder?: string;
  /** Disable send and show loading state */
  isSending?: boolean;
  /** Show loader when adding files (no files yet) */
  isPending?: boolean;
  /** Modal title */
  title?: string;
  /** Max height for the attachments list (CSS value) */
  attachmentsMaxHeight?: string;
  /** Additional class for the modal content box */
  contentClassName?: string;
}
