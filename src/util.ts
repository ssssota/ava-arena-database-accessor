export function countByteCharacter(string: string): number {
  return Array.
    from(string).
    reduce((acc, cur) => acc + (cur.match(/[ -~]/)? 1: 2), 0)
}