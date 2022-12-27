import { Issue } from "../../types";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { List, ActionPanel, Action, popToRoot } from "@raycast/api";
import { useListIssues, useSearchIssues } from "../../service/issue";
import { toIssue } from "./model";
import { getAccessories, getIssueIcon } from "./common";
import { getLogins } from "../../storage/logins";

export function Issues() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cache, setCache] = useState<Issue[]>([]);
  const { isLoading: listIsLoading, data: listData, error: listError } = useListIssues();
  const {
    isLoading: searchIsLoading,
    data: searchData,
    error: searchError,
  } = useSearchIssues(searchQuery, getLogins());

  //const searchIssues = _.debounce((query: string) => {
  const searchIssues = (query: string) => {
    // exit early on no change
    if (query === searchQuery) {
      return;
    }

    setSearchQuery(query);
  };
  //}, 500);

  const filteredIssues = cache.filter((issue: Issue) => filterIssues(issue, searchQuery));
  useEffect(() => {
    const issues = parseIssuesResponse(listData, searchData);
    setCache(dedupIssues(cache, issues));
  }, [listData, searchData]);

  return (
    <List
      isLoading={listIsLoading || searchIsLoading}
      onSearchTextChange={(newValue) => searchIssues(newValue)}
      searchBarPlaceholder={"Search issues..."}
      throttle
      /*isShowingDetail*/
    >
      <List.Section title="Issues">
        {filteredIssues.map((issue: Issue, index: number) => {
          return (
            <List.Item
              key={`${index} + ${issue.repo} + ${issue.number}`}
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
                          {issue.labels.map((label, index) => (
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
          );
        })}
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
