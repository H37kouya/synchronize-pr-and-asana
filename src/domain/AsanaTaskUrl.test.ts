import { ASANA_URL } from "../const";
import { AsanaTaskUrl } from './AsanaTaskUrl'

describe("AsanaTaskUrl", () => {
  describe("インスタンスを生成できる", () => {
    type TestCase = {
      arg: string;
      expected: string;
    };

    const testCases: TestCase[] = [
      {
        arg: ASANA_URL('/foo/bar'),
        expected: ASANA_URL('/foo/bar')
      }
    ]

    testCases.forEach(testCase => {
      it(`arg=${testCase.arg}, expected=${testCase.expected}`, () => {
        // WHEN
        const actual = new AsanaTaskUrl(testCase.arg)

        expect(actual).toBeInstanceOf(AsanaTaskUrl)
        expect(actual.get()).toBe(testCase.expected)
      })
    })
  })
})
