import { EditorHelperBar } from "@sama-communications.ui-kit";

import { useEditorHelperActions } from "@hooks/components/useEditorHelperActions";

const DOCS_HREF = "https://oleksandr-ch.notion.site/Programmable-Chat-feature-1ffe3b41e4ae804da619f63b706e7263";

export default function ChatEditorHelper() {
  const { actions } = useEditorHelperActions();

  return (
    <EditorHelperBar
      docsHref={DOCS_HREF}
      tooltipId="editor-options-tooltip"
      actions={actions}
      actionButtonClassName="!no-underline text-p !text-(--color-text-dark)"
    />
  );
}
