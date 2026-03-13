import { useCallback, useState } from "react";
import { clsx } from "clsx";

import { getAdapters } from "../../../adapters";

import { useKeyDown } from "../../../hooks/useKeyDown";
import { KEY_CODES } from "../../../utils/constants";

import { WrapperRoot } from "../../elements/WrapperRoot";
import { UserInputsGroup } from "./UserInputsGroup";
import { ConversationInputsGroup } from "./ConversationInputsGroup";

import { Save } from "lucide-react";

import type { EditModalContainerProps } from "./EditModalContainer.types";

export const EditModalContainer = ({ type, onClose, className, ...rest }: EditModalContainerProps) => {
  const { useParticipants, useConversations } = getAdapters();
  const { updateCurrentUserFields } = useParticipants();
  const { updateNameAndDescription } = useConversations();

  const [content, setContent] = useState<
    Partial<{
      name: string;
      description: string;
      email: string;
      phone: string;
      first_name: string;
      last_name: string;
    }>
  >({});

  const addFieldToEdit = (field: string, value: string) => setContent((prev) => ({ ...prev, [field]: value?.trim() }));

  const types = {
    conversation: {
      component: <ConversationInputsGroup onChageValue={addFieldToEdit} />,
      title: "Chat Information",
    },
    user: {
      component: <UserInputsGroup onChageValue={addFieldToEdit} />,
      title: "Edit Profile",
    },
  };

  const { component, title } = types[type] || {};

  const sendRequest = useCallback(async () => {
    const { name, description } = content;

    const isSuccess =
      type === "conversation"
        ? await updateNameAndDescription({ name, description })
        : await updateCurrentUserFields({
            ...content,
            email: content.email?.toLocaleLowerCase(),
          });

    if (isSuccess) onClose();
  }, [onClose, content, type, updateNameAndDescription, updateCurrentUserFields]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);
  useKeyDown(KEY_CODES.ESCAPE, onClose);

  return (
    <WrapperRoot
      className={clsx(
        "ui:absolute ui:top-0 ui:z-10 ui:flex ui:h-dvh ui:w-dvw ui:items-center ui:justify-center ui:bg-black/50",
        className,
      )}
      {...rest}
    >
      <div className="ui:flex ui:flex-col ui:gap-2.75 ui:rounded-2xl ui:bg-bg-light ui:px-7 ui:py-3.5 ui:max-md:w-[94svw] ui:md:w-100">
        <p className="ui:text-center ui:text-xl">{title}</p>
        <div className="ui:mt-3.5 ui:flex ui:flex-col ui:gap-2.75">{component}</div>
        <div className="ui:mt-3.5 ui:flex ui:items-center ui:justify-between ui:gap-2.75">
          <p className="ui:cursor-pointer ui:rounded-xl ui:p-2 ui:text-text-dark" onClick={onClose}>
            Cancel
          </p>
          <p
            className="ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:rounded-xl ui:border ui:border-accent-500 ui:p-2 ui:text-accent-500"
            onClick={sendRequest}
          >
            Save
            <Save size={18} color="var(--color-accent-500)" />
          </p>
        </div>
      </div>
    </WrapperRoot>
  );
};
