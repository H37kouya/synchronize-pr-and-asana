import { getInput, setFailed } from "@actions/core";
import { getOctokit, context as GitHubContext } from "@actions/github";
import { createAsanaClient } from "./repository/asana";
import { getTask } from "./repository/asana/task";
import { addLabels, getPrNumber } from "./helper";
import { extractionAsanaUrl } from "./regex";
import { AsanaTaskUrl } from "./domain/AsanaTaskUrl";

// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = getInput("repo-token", { required: true });
    const asanaClientToken = getInput("asana-token", { required: true });
    const customFields = getInput("custom-fields");

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
    const asanaTaskUrl = extractionAsanaUrl(pullRequest.body);

    if (!asanaTaskUrl) {
      console.info("asanaのURLが存在しませんでした。");
      return;
    }

    const asanaTaskUrlEntity = AsanaTaskUrl.of(asanaTaskUrl);
    const taskGid = asanaTaskUrlEntity.taskGid();

    console.info(taskGid);

    const asanaClient = createAsanaClient(asanaClientToken);
    const task = await getTask({
      client: asanaClient,
      taskGid
    });
    console.log(task);

    const allowCustomFields = customFields ? customFields.split(',') : []
    const taskCustomFields = task.custom_fields.filter(cf => allowCustomFields.includes(cf.name))

    await addLabels(client, prNumber, [
      ...task.tags.map(tag => tag.name),
      // @ts-ignore
      ...taskCustomFields.map(cf => cf.display_value)
    ]);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
