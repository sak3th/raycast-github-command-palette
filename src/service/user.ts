import { useFetch } from "@raycast/utils";
import { PREF_TOKEN } from "../preferences";

export function useFetchUser() {
  return useFetch("https://api.github.com/user", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
    keepPreviousData: true,
  });
}

export type UserResponse = {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
};

export function useFetchUserOrgs() {
  return useFetch("https://api.github.com/user/orgs", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
    keepPreviousData: true,
  });
}

export type Org = {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_url: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url: string;
  description: string;
};

export type OrgsResponse = Org[];
