import readTextFile from "../../src/lib/file.util";

test("readTextFile prints to console", () => {
  const allText = readTextFile(
    "file:///Volumes/workplace/vue-demo/src/data/words.txt"
  );
  expect(allText).toBe("a");
});
