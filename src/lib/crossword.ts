export default function crossword(size: number): string {
  let i = 1;
  let word = "";
  while (i <= size) {
    i++;
    word += "a";
  }
  return word;
}
