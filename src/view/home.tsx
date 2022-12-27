import { List, ActionPanel, Action, Color, popToRoot } from "@raycast/api";
import PAGES from "../pages.json";
import { PageItem, Repo } from "../types";
import { Repos } from "./repos";
import { Issues } from "./issues/issues";
import { Pulls } from "./issues/pulls";

export function Home({ repos }: { repos: Repo[] }) {
  return (
    <>
      <List.Section title="Pages">
        {PAGES.map((pageItem: PageItem, index) => (
          <List.Item
            key={index}
            title={pageItem.title}
            icon={{ source: pageItem.icon, tintColor: Color.PrimaryText }}
            actions={
              <ActionPanel>
                <Action.OpenInBrowser url={pageItem.url} onOpen={() => popToRoot({ clearSearchBar: true })} />
                {getPushAction(pageItem.key)}
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      {repos && <Repos data={repos} isError={false} />}
    </>
  );
}

function getPushAction(key?: string) {
  if (key === "issues") {
    return <Action.Push title="Issues" shortcut={{ modifiers: [], key: "tab" }} target={<Issues />} />;
  }
  if (key === "pulls") {
    return <Action.Push title="Pull Requests" shortcut={{ modifiers: [], key: "tab" }} target={<Pulls />} />;
  }
  return null;
}
