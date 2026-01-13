import { useCallback, useState } from "react";

import { EditModalContainerProps } from "./EditModalContainer.types";
import { getAdapters } from "../../../adapters";

import { UserInputsGroup } from "./UserInputsGroup";
import { ConversationInputsGroup } from "./ConversationInputsGroup";

export const EditModalContainer = ({ type }: EditModalContainerProps) => {
  const { useParticipants, useConversations, useHistory } = getAdapters();
  const { updateCurrentUserFields } = useParticipants();
  const { updateNameAndDescription } = useConversations();
  const { undoLastSection } = useHistory();

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

  const addFieldToEdit = (field: string, value: string) =>
    setContent((prev) => ({ ...prev, [field]: value?.trim() }));

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

    if (isSuccess) undoLastSection();
  }, [
    undoLastSection,
    content,
    type,
    updateNameAndDescription,
    updateCurrentUserFields,
  ]);

  //   useKeyDown(KEY_CODES.ENTER, sendRequest);
  //   useKeyDown(KEY_CODES.ESCAPE, onClose);

  return (
    <div
      className="absolute top-0 z-10 flex h-dvh w-dvw items-center justify-center bg-(--color-black-50)"
      //   initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      //   animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      //   exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      //   transition={{ duration: 0.2 }}
    >
      <div
        style={{ width: "min(540px,94%)" }}
        className={`flex flex-col rounded-[32px] bg-(--color-bg-light) p-[30px] max-md:w-[94svw] max-md:p-[20px]`}
        // initial={{ scale: 0.8, opacity: 0 }}
        // animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
        // exit={{ scale: 0.8, opacity: 0 }}
        // transition={{ duration: 0.2 }}
      >
        <p className="text-h4 text-center !font-normal text-black">{title}</p>
        <div className="my-[10px] flex flex-col">{component}</div>
        <div className="mt-auto flex items-center justify-between gap-[30px]">
          <p
            className="text-h6 !forn-light cursor-pointer text-(--color-accent-dark)"
            onClick={undoLastSection}
          >
            Cancel
          </p>
          <p
            className="text-h6 !forn-light cursor-pointer text-(--color-accent-dark)"
            onClick={sendRequest}
          >
            Save Changes
          </p>
        </div>
      </div>
    </div>
  );
};
