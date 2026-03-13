export interface MessageInputProps {
  inputTextRef: React.RefObject<any>;
  isBlockedConv: boolean;
  isEditAction: boolean;
  isMobile: boolean;
  isSending: boolean;
  isEnableMagicButton: boolean;
  onSubmitFunc: React.MouseEventHandler<SVGSVGElement>;
  /** Called when user opens attachment hub (e.g. paperclip or paste/drop). */
  onOpenAttachmentHub?: () => void;
  /** When true, draft text is not restored (e.g. user is on attach screen). */
  isLocationIncludeAttach?: boolean;
}
