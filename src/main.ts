import { getInput, setFailed } from "@actions/core";
import { getOctokit } from "@actions/github";
import { createAsanaClient } from "./repository/asana";
import { getTask } from "./repository/asana/task";
import { extractionAsanaUrl } from "./utils/regex";
import { AsanaTaskUrl } from "./domain/AsanaTaskUrl";
import { addLabels } from "./repository/github/label";
import { inProgressPullRequest } from "./service/pullRequest";

// most @actions toolkit packages have async methods
async function run() {
  try {
    const token = getInput("repo-token", { required: true });
    const asanaClientToken = getInput("asana-token", { required: true });
    const customFields = getInput("custom-fields");

    const client = getOctokit(token);

    /** pr 情報の取得 */
    const { pullRequest } = await inProgressPullRequest(client)

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
    if (!taskGid) {
      console.info("taskGidが取得できませんでした");
      return;
    }

    console.info(taskGid);

    const asanaClient = createAsanaClient(asanaClientToken);
    const task = await getTask({
      client: asanaClient,
      taskGid
    });
    // console.log(task);

    const allowCustomFields = customFields ? customFields.split(',') : []
    const taskCustomFields = task.custom_fields.filter(cf => allowCustomFields.includes(cf.name))

    await addLabels(client, pullRequest.number, [
      ...task.tags.map(tag => tag.name),
      // @ts-ignore
      ...taskCustomFields.map(cf => cf.display_value)
    ]);
  } catch (error) {
    setFailed(error.message);
  }
}

run();
