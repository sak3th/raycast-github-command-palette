import { useFetch } from "@raycast/utils";
import { PREF_TOKEN } from "../preferences";
import { Repo } from "../types";

export function useSearchRepos(query: string, inUsers: string[] = []) {
  const inUsersQuery = inUsers.reduce((p, c) => `${p}+user:${c}`, "");
  return useFetch(`https://api.github.com/search/repositories?q=${query}${inUsersQuery}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
  });
}

export function parseReposResponse(resp: any): Repo[] {
  return (
    resp?.items?.map((item: any) => {
      return {
        name: item.name,
        fullName: item.full_name,
        htmlUrl: item.html_url,
        ownerLogin: item?.owner?.login,
        ownerType: item?.owner?.type,
        ownerAvatarUrl: item?.owner?.avatar_url,
      } as Repo;
    }) ?? []
  );
}
