export const fromBase64ToUTF8 = (str: string): string =>
  Buffer.from(str, "base64").toString("utf8");

export const fromUTF8ToBase64 = (str: string): string =>
  Buffer.from(str, "utf8").toString("base64");
