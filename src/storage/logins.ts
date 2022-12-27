import { Cache } from "@raycast/api";

const cache = new Cache();

export function getLogins(): string[] {
  const clogins = cache.get("logins");
  if (clogins) {
    return JSON.parse(clogins);
  } else {
    return [];
  }
}

export function setLogins(logins: string[]) {
  cache.set("logins", JSON.stringify(logins));
}
