import { getAdapters } from "@adapters";

import { ConversationInfoAvatar } from "@elements/ConversationInfoAvatar";
import { InfoBox } from "@elements/InfoBox";

interface ConversationInputsGroupProps {
  onChageValue: (name: string, value: string) => void;
}

export const ConversationInputsGroup = ({ onChageValue }: ConversationInputsGroupProps) => {
  const { useConversations } = getAdapters();
  const { getSelectedConversation } = useConversations();

  const selectedConversation = getSelectedConversation();

  return (
    <>
      <ConversationInfoAvatar conversation={selectedConversation} isEditDisabled={false} />
      <div className="ui:flex ui:grow ui:flex-col ui:gap-1.75">
        <InfoBox
          title={"Group name"}
          value={selectedConversation.name}
          systemTitle={"name"}
          isIconEnable={false}
          onChangeValue={onChageValue}
        />
        <InfoBox
          title={"Description"}
          value={selectedConversation.description}
          systemTitle={"description"}
          isIconEnable={false}
          onChangeValue={onChageValue}
        />
      </div>
    </>
  );
};
