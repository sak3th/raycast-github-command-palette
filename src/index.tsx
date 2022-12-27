import { Detail, List, useNavigation } from "@raycast/api";

import { useState } from "react";
import { isEmpty } from "lodash";
import { useFetchUser, useFetchUserOrgs, UserResponse, OrgsResponse } from "./service/user";
import { Home } from "./view/home";
import { useSearchRepos, parseReposResponse } from "./service/repo";
import { Repos } from "./view/repos";
import { Issues } from "./view/issues/issues";
import { getLogins, setLogins } from "./storage/logins";

export default function Command() {
  const [logins, setLogins] = useState(getLogins());

  const onFetchedLogins = (loginsResp: string[]) => {
    setLogins(loginsResp);
  };

  return logins.length > 0 ? <ListHome /> : <Init onFetchedLogins={onFetchedLogins} />;
}

function ListHome() {
  const { push } = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const logins = getLogins();

  const { isLoading: repoIsLoading, data: repoData, error: repoError } = useSearchRepos(searchQuery, logins);

  const searchRepos = (query: string) => {
    // exit early on no change
    if (query === searchQuery) {
      return;
    }

    if (query === "#") {
      push(<Issues />);
      return;
    }

    setSearchQuery(query);
  };

  const repos = parseReposResponse(repoData);

  return (
    <List
      isLoading={repoIsLoading}
      onSearchTextChange={(newValue) => {
        //setState((previous: State) => ({ ...previous, searchText: newValue }));
        searchRepos(newValue);
      }}
      searchBarPlaceholder="Search your repos. Type # to search issues"
      throttle={true}
    >
      {isEmpty(searchQuery) ? <Home repos={repos} /> : <Repos data={repos} isError={false} />}
    </List>
  );
}

function Init({ onFetchedLogins }: { onFetchedLogins: (logins: string[]) => void }) {
  const { isLoading: userIsLoading, data: userData, error: userError } = useFetchUser();
  const { isLoading: orgsIsLoading, data: orgsData, error: orgsError } = useFetchUserOrgs();

  const userResponse = userData as UserResponse;
  const orgsResponse = orgsData as OrgsResponse;

  if (userResponse && orgsResponse) {
    const logins = [] as string[];
    logins.push(userResponse.login);
    orgsResponse.forEach((org: any) => logins.push(org.login));

    setTimeout(() => {
      setLogins(logins);
      onFetchedLogins(logins);
    }, 1000);
  }

  let markdown = "## Fetching orgs...";
  if (userResponse) {
    markdown = markdown + "\n\n" + "**User**: " + userResponse.login;
  }
  if (orgsResponse) {
    markdown = markdown + "\n\n" + "**User-Orgs**: ";
    orgsResponse.forEach((org: any) => (markdown = markdown + "\n - " + org.login));
  }

  return <Detail markdown={markdown} isLoading={userIsLoading || orgsIsLoading} />;
}
