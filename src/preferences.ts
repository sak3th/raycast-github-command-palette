import { getPreferenceValues } from "@raycast/api";

interface Preferences {
  personalAccessToken: string;
}

const p = getPreferenceValues<Preferences>();

export const PREF_TOKEN = p.personalAccessToken;
//export const useInsiders = (p.useInsiders || false) as boolean;
