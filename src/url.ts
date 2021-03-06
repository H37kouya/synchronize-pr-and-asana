import { URL } from 'node:url'

export const getLastPath = (url: string) => {
  // 末尾のスラッシュを削除
  const formatUrl = url.replace(/\/$/, '')

  const urlEntity = new URL(formatUrl)

  const paths = urlEntity.pathname.split('/').reverse()

  return paths[0]
}
