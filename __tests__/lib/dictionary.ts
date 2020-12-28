import Dictionary, { Dict } from "../../src/lib/dictionary";

test("getWords should return words", () => {
  const dictionary = new Dictionary();
  const dict: Dict = dictionary.getWords()

  expect(dict.a).toBe(1);
});
