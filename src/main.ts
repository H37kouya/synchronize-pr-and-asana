import { getInput, setFailed } from "@actions/core";
import { getOctokit, context as GitHubContext } from "@actions/github";
import { addLabels, getPrNumber } from "./helper";
import { extractionAsanaUrl } from "./regex";

// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = getInput("repo-token", { required: true });
    const asanaToken = getInput("asana-token", { required: true });

    const prNumber = getPrNumber();
    if (!prNumber) {
      console.log("Could not get pull request number from context, exiting");
      return;
    }
    console.info(`PrNumber=${prNumber}`);

    const client = getOctokit(token);

    const { data: pullRequest } = await client.pulls.get({
      owner: GitHubContext.repo.owner,
      repo: GitHubContext.repo.repo,
      pull_number: prNumber
    });

    console.info(pullRequest);

    /**
     * PRの説明からAsanaのURLを取得する
     */
    const asanaUrl = extractionAsanaUrl(pullRequest.body);

    if (!asanaUrl) {
      console.info("asanaのURLが存在しませんでした。");
      return;
    }

    await addLabels(client, prNumber, [asanaUrl]);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
