import globalConstants from "@utils/global/constants";

export function urlify(inputText, color = "black") {
  const matches = inputText.match(globalConstants.linksRegExp) || [];
  const parts = inputText.split(globalConstants.linksRegExp);

  return parts.reduce((result, part, i) => {
    result.push(part);

    if (i < matches.length) {
      result.push(
        <a
          className={`text-${color} underline`}
          href={matches[i]}
          target="_blank"
          key={i}
        >
          {matches[i]}
        </a>
      );
    }

    return result;
  }, []);
}
