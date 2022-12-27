import { Repo } from "../types";
import { useFetch } from "@raycast/utils";
import { PREF_TOKEN } from "../preferences";

export function useActionsInRepo(repo: Repo) {
  return useFetch(`https://api.github.com/repos/${repo.ownerLogin}/${repo.name}/actions/runs`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${PREF_TOKEN}`,
    },
    keepPreviousData: true,
  });
}
