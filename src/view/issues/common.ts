import { Issue, IssueState, WorkflowRun } from "../../types";
import { isEmpty, isNil } from "lodash";
import { Image, Color } from "@raycast/api";

export function getIssueIcon(issue: Issue) {
  const isOpen = issue.state === IssueState.OPEN;
  const isMerged = !isEmpty(issue.pullRequest.mergedAt);
  if (issue.pullRequest.htmlUrl) {
    return {
      source: isOpen ? "pull-request.svg" : isMerged ? "merge.svg" : "pull-request-closed.svg",
      tintColor: isOpen ? Color.Green : isMerged ? Color.Purple : Color.Red,
    };
  }
  return { source: isOpen ? "issue.svg" : "issue-closed.svg", tintColor: isOpen ? Color.Green : Color.Red };
}

export function getAccessories(issue: Issue) {
  const accessories = [];
  let res: any = getAssigneeIcon(issue);
  if (res) accessories.push(res);
  res = getAssigneeText(issue);
  if (res) accessories.push(res);
  /*res = getMilestoneIcon(issue)
  if (res) accessories.push(res)
  res = getMilestoneText(issue)
  if (res) accessories.push(res)*/

  return accessories;
}

function getAssigneeIcon(issue: Issue) {
  if (isEmpty(issue.assignees)) {
    return null;
  }
  const assignee = issue.assignees[0];
  return { icon: { source: assignee.avatarUrl, mask: Image.Mask.Circle } };
}

function getAssigneeText(issue: Issue) {
  if (isEmpty(issue.assignees)) {
    return null;
  }
  const assignee = issue.assignees[0];
  return { text: assignee.login };
}

function getMilestoneIcon(issue: Issue) {
  if (isNil(issue.milestone)) {
    return null;
  }
  return { icon: { source: "milestone.svg" } };
}

function getMilestoneText(issue: Issue) {
  if (isNil(issue.milestone)) {
    return null;
  }
  return { text: issue.milestone.title };
}

export function getWorkflowRunIcon(run: WorkflowRun) {
  if (run.status === "completed") {
    if (run.conclusion === "success") {
      return { source: "check-circle.svg", tintColor: Color.Green };
    }
    if (run.conclusion === "failure") {
      return { source: "x-circle.svg", tintColor: Color.Red };
    }
    if (run.conclusion === "cancelled") {
      return { source: "cancelled.svg", tintColor: Color.SecondaryText };
    }
  }
  if (run.status === "in_progress") {
    return { source: "dot.svg", tintColor: Color.Yellow };
  }
  if (run.status === "queued") {
    return { source: "clock.svg", tintColor: Color.SecondaryText };
  }
}
