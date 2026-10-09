import fs from 'node:fs'
import path from 'node:path'

import { COLOR_TOKENS, palette } from './palette'

const css = fs.readFileSync(path.join(__dirname, '../../global.css'), 'utf8')
const [lightBlock = '', darkBlock = ''] = css.split('.dark:root')

const readVars = (block: string) =>
  Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([\d ]+);/g)].map((m) => [m[1], m[2]]))

describe('theme palette', () => {
  it('global.css light variables match palette.light', () => {
    expect(readVars(lightBlock)).toEqual(palette.light)
  })

  it('global.css dark variables match palette.dark', () => {
    expect(readVars(darkBlock)).toEqual(palette.dark)
  })

  it('tailwind.config.js exposes every token', () => {
    const tailwind = require('../../../tailwind.config.js')
    expect(Object.keys(tailwind.theme.extend.colors).sort()).toEqual([...COLOR_TOKENS].sort())
  })
})
