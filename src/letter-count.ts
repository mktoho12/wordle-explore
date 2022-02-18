import * as fs from "fs"
import wordsListPath from "word-list"

type LetterCount = { [key: string]: number }

const count = (accm: LetterCount, letter: string) => ({ ...accm, [letter]: (accm[letter] || 0) + 1 })
const compare = <T>(a: T, b: T, fn: ((a: T) => any) | null = null): number => fn ? compare(fn(a), fn(b)) : a > b ? 1 : a === b ? 0 : -1

const letterCount = fs
  .readFileSync(wordsListPath, {encoding: 'utf8'})
  .split(/\n/)
  .filter(w => w.length === 5)
  .map(word => [...word].reduce(count, {}))
  .reduce((accm: LetterCount, lc) => Object.entries(lc).reduce((_accm, [letter, count]) => ({..._accm, [letter]: (_accm[letter] || 0) + count}), accm), {})

const view1 = Object.entries(letterCount)
  .map(([letter, count]) => ({ letter, count }))
  .sort((a, b) => compare(a, b, (v => v.letter)))

const all = Object.values(letterCount).reduce((accm, c) => accm + c, 0)

const view2 = Object.entries(letterCount)
  .map(([letter, count]) => ({
    letter,
    count,
    rate: (count / all).toLocaleString('ja-JP', { style: 'percent', minimumFractionDigits: 2 })
  }))
  .sort((a, b) => compare(b, a, (v => v.count)))

console.log(view1)
console.log(view2)
