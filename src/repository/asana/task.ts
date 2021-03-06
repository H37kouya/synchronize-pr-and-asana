import { GetTaskParam } from "./params/GetTaskParam"

const getTask = async ({ client, taskGid }: GetTaskParam) => {
  const task = await client.tasks.findById(taskGid)

  return task
}
