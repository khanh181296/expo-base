#!/usr/bin/env node
/**
 * Rename the app in one step: display name, slug, scheme, bundle ID / package and package.json name.
 *
 *   pnpm rename --name "My App" --bundle-id com.company.myapp [--slug my-app] [--scheme myapp]
 */
const fs = require('node:fs')
const path = require('node:path')
const { parseArgs } = require('node:util')

const root = path.resolve(__dirname, '..')

const { values } = parseArgs({
  options: {
    name: { type: 'string' },
    'bundle-id': { type: 'string' },
    slug: { type: 'string' },
    scheme: { type: 'string' },
  },
})

const fail = (message) => {
  console.error(`✖ ${message}`)
  console.error(
    'Usage: pnpm rename --name "My App" --bundle-id com.company.myapp [--slug my-app] [--scheme myapp]',
  )
  process.exit(1)
}

const name = values.name?.trim()
const bundleId = values['bundle-id']?.trim()
if (!name) fail('--name is required')
if (!bundleId || !/^[a-zA-Z][\w]*(\.[a-zA-Z][\w]*){2,}$/.test(bundleId)) {
  fail(
    '--bundle-id must look like com.company.app (letters, digits, underscores; at least 3 parts)',
  )
}

const toSlug = (value) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const slug = values.slug ?? toSlug(name)
const scheme = values.scheme ?? slug.replace(/-/g, '')
if (!/^[a-z][a-z0-9-]*$/.test(slug)) fail(`invalid slug "${slug}"`)
if (!/^[a-z][a-z0-9+.-]*$/.test(scheme)) fail(`invalid scheme "${scheme}"`)

const envPath = path.join(root, 'env.js')
const env = fs.readFileSync(envPath, 'utf8')
const baseBlock = /const BASE = \{[\s\S]*?\n\}/
if (!baseBlock.test(env)) fail('could not find `const BASE = {...}` in env.js')
fs.writeFileSync(
  envPath,
  env.replace(
    baseBlock,
    `const BASE = {\n  name: '${name.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}',\n  slug: '${slug}',\n  scheme: '${scheme}',\n  bundleId: '${bundleId}',\n}`,
  ),
)

const pkgPath = path.join(root, 'package.json')
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
pkg.name = slug
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)

console.log(`✔ Renamed to "${name}"`)
console.log(`  slug ${slug} · scheme ${scheme} · bundle ID ${bundleId} (+ .dev / .staging)`)
console.log(
  'Next: replace icons in assets/, run `eas init`, then `pnpm prebuild` if ios/ or android/ exist.',
)
