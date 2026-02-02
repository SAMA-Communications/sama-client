export interface MessageInputProps {
  inputTextRef: React.RefObject<any>;
  isBlockedConv: boolean;
  isEditAction: boolean;
  isMobile: boolean;
  isSending: boolean;
  onSubmitFunc: React.MouseEventHandler<SVGSVGElement>;
}
