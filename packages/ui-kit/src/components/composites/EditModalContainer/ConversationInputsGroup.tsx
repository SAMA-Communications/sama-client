import { getAdapters } from "../../../adapters";

import { InfoBox } from "../../../components/elements/InfoBox";
import { ConversationInfoAvatar } from "../../../components/elements/ConversationInfoAvatar";

interface ConversationInputsGroupProps {
  onChageValue: (name: string, value: string) => void;
}

export const ConversationInputsGroup = ({ onChageValue }: ConversationInputsGroupProps) => {
  const { useConversations } = getAdapters();
  const { getSelectedConversation } = useConversations();

  const selectedConversation = getSelectedConversation();

  return (
    <div className="flex flex-row gap-[12px]">
      <ConversationInfoAvatar conversation={selectedConversation} isEditDisabled={false} />
      <div className="flex grow flex-col">
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
    </div>
  );
};
