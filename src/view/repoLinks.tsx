import { List, ActionPanel, Action, Color, popToRoot, Icon } from "@raycast/api";
import { RepoLink, Repo } from "../types";
import REPO_LINKS from "../repo-links.json";
import { useState } from "react";
import _, { isEmpty } from "lodash";
import { RepoIssues } from "./issues/repoIssues";
import { RepoPulls } from "./issues/repoPulls";
import { RepoActions } from "./issues/repoActions";

export function RepoLinks({ repo }: { repo: Repo }) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRepos = _.debounce((query: string) => {
    // exit early on no change
    if (query === searchQuery) {
      return;
    }

    setSearchQuery(query);
  }, 500);

  return (
    <List onSearchTextChange={(newValue) => searchRepos(newValue)}>
      <List.Section title="Repo links">
        {REPO_LINKS.filter((item) => filterRepoLinks(item, searchQuery)).map((repoLink: RepoLink, index) => (
          <List.Item
            key={index}
            title={repoLink.title}
            icon={{ source: repoLink.icon, tintColor: Color.PrimaryText }}
            accessories={getAccessories(repo, repoLink.endpoint)}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser
                  url={`${repo.htmlUrl}/${repoLink.endpoint}`}
                  onOpen={() => popToRoot({ clearSearchBar: true })}
                />
                {getPushAction(repo, repoLink.endpoint)}
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function filterRepoLinks(repoLink: RepoLink, searchQuery: string) {
  return isEmpty(searchQuery) || repoLink.title.toLowerCase().includes(searchQuery.toLowerCase());
}

function getAccessories(repo: Repo, key?: string) {
  if (key === "issues") {
    return [{ text: "Search" }, { text: "Open in Browser" }];
  }
  if (key === "pulls") {
    return [{ text: "Search" }, { text: "Open in Browser" }];
  }
  if (key === "actions") {
    return [{ text: "Search" }, { text: "Open in Browser" }];
  }
  return [{ text: "Open in Browser" }];
}

function getPushAction(repo: Repo, key?: string) {
  if (key === "issues") {
    return (
      <Action.Push
        icon={Icon.MagnifyingGlass}
        title="Search Issues    [tab]"
        shortcut={{ modifiers: [], key: "tab" }}
        target={<RepoIssues repo={repo} />}
      />
    );
  }
  if (key === "pulls") {
    return (
      <Action.Push
        icon={Icon.MagnifyingGlass}
        title="Search PRs    [ tab ]"
        shortcut={{ modifiers: [], key: "tab" }}
        target={<RepoPulls repo={repo} />}
      />
    );
  }
  if (key === "actions") {
    return (
      <Action.Push
        icon={Icon.MagnifyingGlass}
        title="Search Actions    [tab]"
        shortcut={{ modifiers: [], key: "tab" }}
        target={<RepoActions repo={repo} />}
      />
    );
  }
  return null;
}
