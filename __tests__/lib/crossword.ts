import { CrossWord, Direction, Cell } from "../../src/lib/crossword";
import Dictionary, { Dict } from "../../src/lib/dictionary";
import dictionaryData from "./words_dictionary_test.json";

describe("CrossWord unit tests", () => {
  const dictionary = new Dictionary(dictionaryData as Dict);
  const crossWordConfig = {
    size: 4,
    wordsConfig: [
      {
        start: new Cell(0, 0),
        size: 2,
        direction: Direction.HORIZONTAL
      }
    ]
  };
  const crossWord = new CrossWord(crossWordConfig, dictionary);

  test("crossword getCompleted returns false in new cross word", () => {
    expect(crossWord.getCompleted()).toBe(false);
  });

  test("crossword guess", () => {
    expect(crossWord.guessCell({ i: 0, j: 0 }, "a")).toBe(true);
    expect(crossWord.getCompleted()).toBe(false);
    expect(crossWord.guessCell({ i: 0, j: 1 }, "b")).toBe(false);
    expect(crossWord.getCompleted()).toBe(false);
    expect(crossWord.guessCell({ i: 0, j: 1 }, "a")).toBe(true);
    expect(crossWord.getCompleted()).toBe(true);
  });

  test("crossword with two words", () => {
    // set up
    const cwc = {
      size: 4,
      wordsConfig: [
        {
          start: new Cell(0, 0),
          size: 2,
          direction: Direction.HORIZONTAL
        },
        {
          start: new Cell(0, 0),
          size: 2,
          direction: Direction.VERTICAL
        }
      ]
    };

    // SUT
    const cw = new CrossWord(cwc, dictionary);

    // asserts
    expect(cw.getCompleted()).toBe(false);
    expect(cw.guessCell({ i: 0, j: 0 }, "a")).toBe(true);
    expect(cw.getCompleted()).toBe(false);
    expect(cw.guessCell({ i: 0, j: 1 }, "b")).toBe(false);
    expect(cw.getCompleted()).toBe(false);
    expect(cw.guessCell({ i: 0, j: 1 }, "a")).toBe(true);
    expect(cw.getCompleted()).toBe(false);
    expect(cw.guessCell({ i: 1, j: 0 }, "b")).toBe(false);
    expect(cw.getCompleted()).toBe(false);
    expect(cw.guessCell({ i: 1, j: 0 }, "a")).toBe(true);
    expect(cw.getCompleted()).toBe(true);
  });
});
