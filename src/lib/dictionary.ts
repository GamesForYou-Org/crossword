import data from "../data/words_dictionary.json";

export interface Dict {
  [propName: string]: number;
}

export default class Dictionary {
  getWords(): Dict {
    return data as Dict;
  }
  getBySize(size: number): string {
    return "";
  }
  getBySizeAndPosition(size: number, positions: string[]): string {
    return "";
  }
}
