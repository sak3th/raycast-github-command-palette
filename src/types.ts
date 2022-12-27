export type HomeSections = Record<string, SectionItem>;

export type SectionItem = {
  title: string;
  icon: string;
};

export type Accessory = {
  text: string;
};

export type PageItem = {
  title: string;
  icon: string;
  url: string;
  key?: string;
  accessory?: Accessory;
};

export type Repo = {
  name: string;
  fullName: string;
  htmlUrl: string;
  ownerLogin: string;
  ownerType: string;
  ownerAvatarUrl: string;
};

export type RepoLink = {
  title: string;
  icon: string;
  endpoint: string;
};

export type PullRequest = {
  htmlUrl: string | null;
  mergedAt: string | null;
};

export type Issue = {
  title: string;
  number: number;
  htmlUrl: string;
  state: IssueState;
  repo: Repo;
  pullRequest: PullRequest;
  labels: Label[];
  assignees: Assignee[];
  milestone: Milestone | null;
};

export enum IssueState {
  OPEN = "open",
  CLOSED = "closed",
}

export type Milestone = {
  title: string;
  htmlUrl: string;
  state: IssueState;
};

export type Assignee = {
  id: number;
  avatarUrl: string;
  login: string;
  htmlUrl: string;
};

export type Label = {
  name: string;
  color: string;
};

export type WorkflowRun = {
  id: number;
  htmlUrl: string;
  status: string;
  conclusion: string;
  displayTitle: string;
  runNumber: number;
  event: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
