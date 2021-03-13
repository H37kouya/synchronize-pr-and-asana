import { getOctokit } from '@actions/github';
import * as pr from '../repository/github/pr';
import { NotExistPullRequestException } from './NotExistPullRequestException';
import { inProgressPullRequest } from './pullRequest';

describe('pullRequest', () => {
  describe('inProgressPullRequest', () => {
    it ('進行中の Pull Request を取得できる', () => {
      const PR_NUMBER: number = 10
      const prNumberFunc = jest.spyOn(pr, 'getPrNumber').mockReturnValueOnce(PR_NUMBER)
      const getPrFunc = jest.spyOn(pr, 'getPr').mockReturnValueOnce(pullRequestDummy(PR_NUMBER) as ReturnType<typeof pr.getPr>)

      return inProgressPullRequest({} as ReturnType<typeof getOctokit>).then((actual) => {
        expect(actual.pullRequest.number).toBe(PR_NUMBER)
        expect(prNumberFunc).toBeCalledTimes(1)
        expect(getPrFunc).toBeCalledTimes(1)
      })
    })

    it ('Pull Request の番号 を取得できないとき、NotExistPullRequestExceptionをはく', async () => {
      const PR_NUMBER: number = 10
      const prNumberFunc = jest.spyOn(pr, 'getPrNumber').mockReturnValueOnce(undefined)
      const getPrFunc = jest.spyOn(pr, 'getPr').mockReturnValueOnce(pullRequestDummy(PR_NUMBER) as ReturnType<typeof pr.getPr>)

      const inProgressPullRequestPromise = inProgressPullRequest({} as ReturnType<typeof getOctokit>)
      await expect(inProgressPullRequestPromise).rejects.toThrowError(NotExistPullRequestException)
      expect(prNumberFunc).toBeCalledTimes(1)
      expect(getPrFunc).toBeCalledTimes(0)
    })
  })
})


const pullRequestDummy = (prNumber = 10) => {
  return new Promise((resolve, reject) => {
    process.nextTick(() =>
      resolve({
        pullRequest: {
          "url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347",
          "id": 1,
          "node_id": "MDExOlB1bGxSZXF1ZXN0MQ==",
          "html_url": "https://github.com/octocat/Hello-World/pull/1347",
          "diff_url": "https://github.com/octocat/Hello-World/pull/1347.diff",
          "patch_url": "https://github.com/octocat/Hello-World/pull/1347.patch",
          "issue_url": "https://api.github.com/repos/octocat/Hello-World/issues/1347",
          "commits_url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits",
          "review_comments_url": "https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments",
          "review_comment_url": "https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}",
          "comments_url": "https://api.github.com/repos/octocat/Hello-World/issues/1347/comments",
          "statuses_url": "https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e",
          "number": prNumber,
          "state": "open",
          "locked": true,
          "title": "Amazing new feature",
        }
      })
    )
  })
}
