import { List, ActionPanel, Action, Image, Color, popToRoot, Icon } from "@raycast/api";
import { Repo } from "../types";
import { RepoLinks } from "./repoLinks";

export function Repos({ data, isError }: { data: Repo[]; isError: boolean }) {
  return (
    <List.Section title="Repositories">
      {data.map((item: Repo, index: number) => (
        <List.Item
          key={index}
          title={item.name}
          icon={{ source: "repo.svg", tintColor: Color.PrimaryText }}
          accessories={[
            { icon: { source: item.ownerAvatarUrl, mask: Image.Mask.RoundedRectangle } },
            { text: item.ownerLogin },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={item.htmlUrl} onOpen={() => popToRoot({ clearSearchBar: true })} />
              <Action.Push
                icon={Icon.List}
                title="Search inside repo    [ tab ]"
                shortcut={{ modifiers: [], key: "tab" }}
                target={<RepoLinks repo={item} />}
              />
              <Action.CopyToClipboard
                icon={Icon.Clipboard}
                title="Copy repo url"
                shortcut={{ modifiers: ["opt","cmd"], key: "c" }}
                content={item.htmlUrl}
              />
            </ActionPanel>
          }
        />
      ))}
    </List.Section>
  );
}
