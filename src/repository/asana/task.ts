import { GetTaskParam } from "./params/GetTaskParam";

export const getTask = async ({ client, taskGid }: GetTaskParam) => {
  const task = await client.tasks.findById(taskGid);

  return task;
};
