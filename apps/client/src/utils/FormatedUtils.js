export function getFormatedTime(dateParams) {
  const date = new Date(dateParams);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${date.getDate().toString().padStart(2, "0")}.${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`;

  return formattedDate;
}

export function calcInputHeight(text) {
  const countOfLines = text.split("\n").length - 1;
  return 55 + countOfLines * 20 < 230 ? 55 + countOfLines * 20 : 215;
}
