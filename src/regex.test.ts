import { ASANA_URL } from './const'
import { extractionAsanaUrl } from './regex'


describe('regex', () => {
  describe('extractionAsanaUrl', () => {
    describe('asanaのURLのみのとき、そのままの値が返却される', () => {
      type TestCase = {
        content: string
        expected: string
      }

      const testCases: TestCase[] = [
        { content: `task: ${ASANA_URL('/hogehoge')}`, expected: ASANA_URL('/hogehoge') },
        { content: `task: ${ASANA_URL('/hogehoge/')}`, expected: ASANA_URL('/hogehoge/') },
        { content: `task: ${ASANA_URL('/foo/bar')}`, expected: ASANA_URL('/foo/bar') },
        { content: `task: ${ASANA_URL('/foo/bar/')}`, expected: ASANA_URL('/foo/bar/') },
        { content: `\
          task: ${ASANA_URL('/foo/bar')}
        `, expected: ASANA_URL('/foo/bar') },
      ]

      testCases.forEach(testCase => {
        it(`content=${testCase.content}, expected=${testCase.expected}`, () => {
          expect(extractionAsanaUrl(testCase.content)).toBe(testCase.expected)
        })
      })
    })

    describe('asanaのURLから始まるとき、asanaのURLを取得できる', () => {
      type TestCase = {
        content: string
        expected: string
      }

      const testCases: TestCase[] = [
        {
          content: `\
            task: ${ASANA_URL('/hogehoge')}
            関係ない言葉
          `,
          expected: ASANA_URL('/hogehoge')
        },
        {
          content: `\
            task: ${ASANA_URL('/foo/bar')}
            関係ない言葉
          `,
          expected: ASANA_URL('/foo/bar')
        },
      ]

      testCases.forEach(testCase => {
        it(`content=${testCase.content}, expected=${testCase.expected}`, () => {
          expect(extractionAsanaUrl(testCase.content)).toBe(testCase.expected)
        })
      })
    })

    describe('asanaのURLから文中にあるとき、asanaのURLを取得できる', () => {
      type TestCase = {
        content: string
        expected: string
      }

      const testCases: TestCase[] = [
        {
          content: `\
            関係ない言葉1
            task: ${ASANA_URL('/hogehoge')}
            関係ない言葉2
          `,
          expected: ASANA_URL('/hogehoge')
        },
        {
          content: `\
            関係ない言葉1
            task: ${ASANA_URL('/foo/bar')}
            関係ない言葉2
          `,
          expected: ASANA_URL('/foo/bar')
        },
      ]

      testCases.forEach(testCase => {
        it(`content=${testCase.content}, expected=${testCase.expected}`, () => {
          expect(extractionAsanaUrl(testCase.content)).toBe(testCase.expected)
        })
      })
    })

    describe('asanaのURLで終わるとき、asanaのURLを取得できる', () => {
      type TestCase = {
        content: string
        expected: string
      }

      const testCases: TestCase[] = [
        {
          content: `\
            関係ない言葉1
            関係ない言葉2
            task: ${ASANA_URL('/hogehoge')}
          `,
          expected: ASANA_URL('/hogehoge')
        },
        {
          content: `\
            関係ない言葉1
            関係ない言葉2
            task: ${ASANA_URL('/foo/bar')}
          `,
          expected: ASANA_URL('/foo/bar')
        },
      ]

      testCases.forEach(testCase => {
        it(`content=${testCase.content}, expected=${testCase.expected}`, () => {
          expect(extractionAsanaUrl(testCase.content)).toBe(testCase.expected)
        })
      })
    })

    describe('asanaのURLが文が存在しない(undefined)とき、undefinedである', () => {
      type TestCase = {
        content?: string
      }

      const testCases: TestCase[] = [
        { content: undefined },
        { content: '' },
      ]

      testCases.forEach(testCase => {
        it(`content=${testCase.content}`, () => {
          expect(extractionAsanaUrl(testCase.content)).toBeUndefined()
        })
      })
    })

    it('asanaのURLが文中にないとき、undefinedである', () => {

    })
  })
})
