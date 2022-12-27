import { Issue, Label, Milestone, Assignee, Repo, PullRequest, WorkflowRun } from "../../types";
import { isEmpty } from "lodash";

export function toIssue(item: any): Issue {
  return {
    title: item.title,
    number: item.number,
    htmlUrl: item.html_url,
    state: item.state,
    repo: {
      name: item.repository?.name,
      fullName: item.repository?.full_name,
      htmlUrl: item.repository?.html_url,
      ownerLogin: item.repository?.owner?.login,
      ownerType: item.repository?.owner?.type,
      ownerAvatarUrl: item.repository?.owner?.avatar_url,
    } as Repo,
    pullRequest: {
      htmlUrl: item.pull_request?.html_url ?? null,
      mergedAt: item.pull_request?.merged_at ?? null,
    } as PullRequest,
    assignees: toAssignees(item),
    labels: toLabels(item),
    milestone: toMilestone(item),
  };
}

function toAssignees(item: any): Assignee[] {
  const assigneeMap = new Map();
  if (item.assignee) {
    const assignee = toAssignee(item.assignee);
    assigneeMap.set(assignee.id, assignee);
  }

  if (!isEmpty(item.assignees)) {
    item.assignees.forEach((it: any) => {
      const assignee = toAssignee(it);
      assigneeMap.set(assignee.id, assignee);
    });
  }

  return [...assigneeMap.values()];
}

function toAssignee(item: any): Assignee {
  return {
    id: item.id,
    login: item.login,
    avatarUrl: item.avatar_url,
    htmlUrl: item.html_url,
  } as Assignee;
}

function toLabels(item: any): Label[] {
  return (
    item?.labels?.map(
      (it: any) =>
        ({
          name: it.name,
          color: it.color,
        } as Label)
    ) ?? []
  );
}

function toMilestone(item: any): Milestone | null {
  if (item.milestone?.title) {
    return {
      title: item.milestone?.title,
      htmlUrl: item.milestone?.html_url,
      state: item.milestone?.state,
    } as Milestone;
  }
  return null;
}

export function toWorkflowRun(item: any): WorkflowRun {
  return {
    id: item.id,
    htmlUrl: item.html_url,
    status: item.status,
    conclusion: item.conclusion,
    displayTitle: item.display_title,
    runNumber: item.run_number,
    event: item.event,
    name: item.name,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  } as WorkflowRun;
}
