import { XMLHttpRequest } from "xmlhttprequest-ts";

export default function readTextFile(file: string): string {
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        const allText = rawFile.responseText;
        return allText;
      }
    }
  };
  rawFile.send(null);
  return "";
}
