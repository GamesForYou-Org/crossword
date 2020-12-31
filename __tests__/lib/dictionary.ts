import Dictionary, { Dict, DictBySize } from "../../src/lib/dictionary";
import dictionaryData from "./words_dictionary_test.json";

describe("Dictionary unit tests", () => {
  const dictionary = new Dictionary(dictionaryData as Dict);

  test("getWords should return Dict", () => {
    const dict: Dict = dictionary.getWords();

    expect(dict.a).toBe(1);
    expect(dict.aa).toBe(1);
    expect(dict.aaa).toBe(1);
    expect(dict.aah).toBe(1);
  });

  test("getDictBySize should return DictBySize with words grouped by size", () => {
    const dict: DictBySize = dictionary.getWordsBySize();

    expect(dict[1]).toEqual(["a"]);
    expect(dict[2]).toEqual(["aa"]);
    expect(dict[3]).toEqual(["aaa", "aah"]);
  });

  test("getBySize should return word with specified size", () => {
    const dict: DictBySize = dictionary.getWordsBySize();

    const wordSize1: string = dictionary.getBySize(1);
    const wordSize2: string = dictionary.getBySize(2);
    const wordSize3: string = dictionary.getBySize(3);

    expect(wordSize1).toBe("a");
    expect(wordSize2).toBe("aa");
    expect(dict[3].some(w => w === wordSize3)).toBe(true);
  });

  test("getBySizeAndPosition should return word with specified size and positions", () => {
    const wordSize1 = dictionary.getBySizeAndPosition(1, { a: [0] });
    const wordSize2 = dictionary.getBySizeAndPosition(2, { a: [0, 1] });
    const wordSize3 = dictionary.getBySizeAndPosition(3, { a: [0, 1, 2] });
    const wordSize4 = dictionary.getBySizeAndPosition(3, { a: [0], h: [2] });

    expect(wordSize1).toBe("a");
    expect(wordSize2).toBe("aa");
    expect(wordSize3).toBe("aaa");
    expect(wordSize4).toBe("aah");
  });

  test("getBySizeAndPosition should throw Error when position is greater than size", () => {
    expect(() =>
      dictionary.getBySizeAndPosition(1, { a: [0], b: [1] })
    ).toThrow("positions cannot be greater than size");

    expect(() => dictionary.getBySizeAndPosition(1, { a: [1] })).toThrow(
      "Position cannot be greater than size"
    );
  });
});
