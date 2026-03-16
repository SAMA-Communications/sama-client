import { useCallback, useState } from "react";

import { getAdapters } from "@adapters";

import { ConversationInputsGroup } from "@composites/EditModalContainer/ConversationInputsGroup";
import type { EditModalContainerProps } from "@composites/EditModalContainer/EditModalContainer.types";
import { UserInputsGroup } from "@composites/EditModalContainer/UserInputsGroup";

import { Modal } from "@elements/Modal";

import { useKeyDown } from "@src/hooks/useKeyDown";

import { KEY_CODES } from "@utils/constants";

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
    <Modal className={className} {...rest}>
      <p className="ui:text-center ui:text-xl">{title}</p>
      <div className="ui:mt-3.5 ui:flex ui:flex-col ui:gap-2.75">{component}</div>
      <hr className="ui:my-1.75 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:-mt-1.75 ui:flex ui:items-center ui:justify-between ui:gap-2.75">
        <p className="ui:cursor-pointer ui:rounded-xl ui:px-3 ui:text-text-dark" onClick={onClose}>
          Cancel
        </p>
        <p
          className="ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:rounded-xl ui:bg-accent-500 ui:px-6 ui:py-2 ui:text-white ui:duration-150 ui:hover:bg-black"
          onClick={sendRequest}
        >
          Save
        </p>
      </div>
    </Modal>
  );
};
