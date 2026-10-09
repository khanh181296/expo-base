import { compareVersions } from './version'

describe('compareVersions', () => {
  it.each([
    ['1.0.0', '1.0.0', 0],
    ['1.10.0', '1.9.3', 1],
    ['1.2', '1.2.1', -1],
    ['2.0.0', '10.0.0', -1],
  ])('%s vs %s = %i', (a, b, expected) => {
    expect(compareVersions(a, b)).toBe(expected)
  })
})
