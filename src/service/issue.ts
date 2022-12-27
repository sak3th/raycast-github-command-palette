import { useFetch } from "@raycast/utils";
import { PREF_TOKEN } from "../preferences";
import { Repo } from "../types";

export function useListIssues() {
  return useFetch(`https://api.github.com/user/issues?state=all+is:issue`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
    keepPreviousData: true,
  });
}

export function useListPulls() {
  return useFetch(`https://api.github.com/user/issues?state=all+is:pr`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
    keepPreviousData: true,
  });
}

export function useSearchIssues(query: string, inUsers: string[] = []) {
  const inUsersQuery = inUsers.reduce((p, c) => `${p}+user:${c}`, "");
  return useFetch(`https://api.github.com/search/issues?q=${query}${inUsersQuery}+is:issue`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
  });
}

export function useSearchPulls(query: string, inUsers: string[] = []) {
  const inUsersQuery = inUsers.reduce((p, c) => `${p}+user:${c}`, "");
  return useFetch(`https://api.github.com/search/issues?q=${query}${inUsersQuery}+is:pr`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
  });
}

export function useSearchIssuesInRepo(query: string, repo: Repo) {
  const repoQuery = `+repo:${repo.fullName}`;
  return useFetch(`https://api.github.com/search/issues?q=${query}${repoQuery}+is:issue`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
  });
}

export function useSearchPullsInRepo(query: string, repo: Repo) {
  const repoQuery = `+repo:${repo.fullName}`;
  return useFetch(`https://api.github.com/search/issues?q=${query}${repoQuery}+is:pr`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
  });
}
