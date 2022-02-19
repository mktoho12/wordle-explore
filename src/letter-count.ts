import * as fs from "fs"
import wordsListPath from "word-list"

type LetterCount = { [key: string]: number }

// for reduce: ['h', 'e', 'l', 'l', 'o'] -> { h: 1, e: 1, l: 2, o: 1 }
const countLetters = (accm: LetterCount, letter: string) =>
  ({ ...accm, [letter]: (accm[letter] || 0) + 1 })

// for reduce: [['a', 1], ['b', 2], ['a', 2], ['c', 4]] -> { a: 3, b: 2, c: 4 }
const mergeEntries = (accm: LetterCount, [letter, count]: [string, number]) =>
  ({ ...accm, [letter]: (accm[letter] || 0) + count })

// for sorting
const compare = <T> (
  a: T,
  b: T,
  fn?: ((a: T) => any)
): 1 | 0 | -1 =>
  fn ? compare(fn(a), fn(b)) :
  a > b ? 1 :
  a === b ? 0 :
  -1

const letterCount = fs
  .readFileSync(wordsListPath, { encoding: 'utf8' })
  .split(/\n/)
  .filter(w => w.length === 5)
  .map(word => [...word].reduce(countLetters, {}))
  .reduce((accm, lc) => Object.entries(lc).reduce(mergeEntries, accm), {})

const view1 = Object.entries(letterCount)
  .map(([letter, count]) => ({ letter, count }))
  .sort((a, b) => compare(a, b, (v => v.letter)))

console.log(view1)

const all = Object.values(letterCount).reduce((accm, c) => accm + c, 0)
const percent = (digits: number) => (n: number) => n.toLocaleString('ja-JP', {
  style: 'percent',
  minimumFractionDigits: digits
})

const view2 = Object.entries(letterCount)
  .map(([letter, count]) => ({
    letter,
    count,
    rate: percent(2)(count / all)
  }))
  .sort((a, b) => compare(b, a, (v => v.count)))

console.log(view2)
