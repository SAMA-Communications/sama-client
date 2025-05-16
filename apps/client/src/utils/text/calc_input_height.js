export default function calcInputHeight(text) {
  const countOfLines = text.split("\n").length - 1;
  return 55 + countOfLines * 20 < 230 ? 55 + countOfLines * 20 : 215;
}
