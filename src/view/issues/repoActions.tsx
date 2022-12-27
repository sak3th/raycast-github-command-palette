import { Repo, WorkflowRun } from "../../types";
import { List, ActionPanel, Action, popToRoot } from "@raycast/api";
import { useActionsInRepo } from "../../service/actions";
import { toWorkflowRun } from "./model";
import { useEffect, useState } from "react";
import { getWorkflowRunIcon } from "./common";

export function RepoActions({ repo }: { repo: Repo }) {
  const [cache, setCache] = useState<WorkflowRun[]>([]);
  const { isLoading, data, error } = useActionsInRepo(repo);

  useEffect(() => {
    const actions = parseActionsResponse(data);
    setCache(actions);
  }, [data]);

  return (
    <List isLoading={isLoading}>
      {cache.map((action: WorkflowRun, index: number) => (
        <List.Item
          key={index}
          title={action.displayTitle}
          icon={getWorkflowRunIcon(action)}
          subtitle={`${action.name} #${action.runNumber}`}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={action.htmlUrl} onOpen={() => popToRoot({ clearSearchBar: true })} />
              <Action.CopyToClipboard title="Copy url" content={action.htmlUrl} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

function parseActionsResponse(data: any): WorkflowRun[] {
  return data?.workflow_runs?.map((item: any) => toWorkflowRun(item)) ?? [];
}
