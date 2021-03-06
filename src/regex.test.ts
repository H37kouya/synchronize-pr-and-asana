import { extractionAsanaUrl } from './regex'



describe('regex', () => {
  describe('extractionAsanaUrl', () => {
    it('asanaのURLのみのとき、そのままの値が返却される', () => {

    })

    it('asanaのURLから始まるとき、asanaのURLを取得できる', () => {

    })

    it('asanaのURLから文中にあるとき、asanaのURLを取得できる', () => {

    })

    it('asanaのURLで終わるとき、asanaのURLを取得できる', () => {

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
