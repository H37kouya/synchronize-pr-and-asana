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
    // ラベルに反映させないタグ
    const ignoreTags = getInput("ignore-tags");
    // 追加するカスタムフィールド
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

    /**
     * PR本文からタスクGidの取得
     */
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
    console.log('task item', task.name, task.tags, task.custom_fields);

    const ignoreTagsList = ignoreTags ? ignoreTags.split(',') : []
    const allowCustomFields = customFields ? customFields.split(',') : []
    console.info('process list val', ignoreTagsList, allowCustomFields)

    const taskCustomFields = task.custom_fields.filter(cf => allowCustomFields.includes(cf.name))
    console.info('taskCustomFields val', taskCustomFields)

    const addLabelList = [
      ...task.tags.map(tag => tag.name).filter((tag) => !ignoreTagsList.includes(tag)),
      // @ts-ignore
      ...taskCustomFields.map(cf => cf.display_value)
    ]
    console.info('addLabelList val', addLabelList)

    await addLabels(client, pullRequest.number, addLabelList);
  } catch (e) {
    setFailed(e.message);
  }
}

run();
