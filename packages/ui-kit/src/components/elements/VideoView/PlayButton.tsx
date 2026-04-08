interface PlayButtonProps {
  onClick?: () => void;
}

export const PlayButton = ({ onClick }: PlayButtonProps) => {
  return (
    <span
      data-testid="play-button"
      className="ui:absolute ui:top-1/2 ui:left-1/2 ui:flex ui:h-11.25 ui:w-11.25 ui:-translate-x-1/2 ui:-translate-y-1/2 ui:transform ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-full ui:bg-bg-light/50 ui:text-gray-700"
      onClick={onClick}
    >
      ▶
    </span>
  );
};
