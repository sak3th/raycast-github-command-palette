import { Issue } from "../../types";
import { useEffect, useState } from "react";
import { isEmpty, isNil } from "lodash";
import { List, ActionPanel, Action, popToRoot } from "@raycast/api";
import { useListIssues, useSearchIssues, useSearchPulls, useListPulls } from "../../service/issue";
import { toIssue } from "./model";
import { getAccessories, getIssueIcon } from "./common";
import { getLogins } from "../../storage/logins";

export function Pulls() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cache, setCache] = useState<Issue[]>([]);
  const { isLoading: listIsLoading, data: listData, error: listError } = useListPulls();
  const { isLoading: searchIsLoading, data: searchData, error: searchError } = useSearchPulls(searchQuery, getLogins());

  const searchIssues = (query: string) => {
    // exit early on no change
    if (query === searchQuery) {
      return;
    }

    setSearchQuery(query);
  };

  const filteredIssues = cache.filter((issue: Issue) => filterIssues(issue, searchQuery));
  useEffect(() => {
    const issues = parseIssuesResponse(listData, searchData);
    setCache(dedupIssues(cache, issues));
  }, [listData, searchData]);

  return (
    <List
      isLoading={listIsLoading || searchIsLoading}
      onSearchTextChange={(newValue) => searchIssues(newValue)}
      searchBarPlaceholder={"Search pull requests..."}
      throttle
      /*isShowingDetail*/
    >
      <List.Section title="Pull Requests">
        {filteredIssues.map((issue: Issue, index: number) => (
          <List.Item
            key={index}
            title={`#${issue.number} ${issue.title}`}
            subtitle={issue.repo.fullName ? `in ${issue.repo.fullName}` : ""}
            icon={getIssueIcon(issue)}
            accessories={getAccessories(issue)}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={issue.htmlUrl} onOpen={() => popToRoot({ clearSearchBar: true })} />
              </ActionPanel>
            }
            detail={
              <List.Item.Detail
                metadata={
                  <List.Item.Detail.Metadata>
                    {!isEmpty(issue.labels) && (
                      <List.Item.Detail.Metadata.TagList title="Labels">
                        {issue.labels.map((label) => (
                          <List.Item.Detail.Metadata.TagList.Item
                            key={`${index} + ${label.name}`}
                            text={label.name}
                            color={`#${label.color}`}
                          />
                        ))}
                      </List.Item.Detail.Metadata.TagList>
                    )}
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

function filterIssues(issue: Issue, searchQuery: string) {
  searchQuery = searchQuery.trim();
  return (
    isEmpty(searchQuery) ||
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.number.toString().includes(searchQuery)
  );
}

function parseIssuesResponse(listData: any, searchData: any): Issue[] {
  //const data =  isEmpty(searchData?.items) ? listData : searchData.items
  //const data = (listData ?? []).concat(searchData?.items ?? []) as Issue []

  const issuesFromList = listData?.map((item: any) => toIssue(item)) ?? [];
  const issuesFromSearch = searchData?.items?.map((item: any) => toIssue(item)) ?? [];
  return dedupIssues(issuesFromList, issuesFromSearch);
}

function dedupIssues(a: Issue[], b: Issue[]): Issue[] {
  const issuesMap = new Map(a.map((issue: Issue) => [issue.number, issue]));

  b?.forEach((issue: Issue) => {
    const find = issuesMap.get(issue.number) as Issue;
    if (!find || isEmpty(find.repo.fullName)) {
      issuesMap.set(issue.number, issue);
    }
  });

  return [...issuesMap.values()] as Issue[];
}
