/**
 * AsanaのURLを文中から取得する
 *
 * 取得する条件はtask: から始まるもの
 * task: ASANA_URL
 *
 * @param content
 */
export const extractionAsanaUrl = (content?: string): string | undefined => {
  if (!content) {
    return undefined
  }
  const linkList = content.match(/task: https?:\/\/app.asana.com\/0\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/);

  if (!linkList || linkList.length === 0) {
    return undefined
  }

  return linkList[0].replace(' ', '').replace('task:', '')
}
