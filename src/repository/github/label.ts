import { getOctokit, context as GitHubContext } from "@actions/github";

export const addLabels = async (
  client: ReturnType<typeof getOctokit>,
  prNumber: number,
  labels: string[]
) => {
  await client.issues.addLabels({
    owner: GitHubContext.repo.owner,
    repo: GitHubContext.repo.repo,
    issue_number: prNumber,
    labels: labels
  });
};
