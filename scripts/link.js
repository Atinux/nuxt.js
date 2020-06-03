// @ts-check

const path = require('path')
const consola = require('consola').default
const execa = require('execa')
const fs = require('fs-extra')
const glob = require('pify')(require('glob'))

/**
 * @typedef {import('./package').PackageJson} PackageJson
 */

async function main () {
  /**
   * @type {string[]}
   */
  const packageDirs = await glob('+(packages|distributions)/*')

  /**
   * @type {Array<{ dir: string, pkg: PackageJson }>} packages
   */
  const packages = packageDirs.map(pkgDir => ({
    dir: pkgDir,
    pkg: fs.readJSONSync(path.join(pkgDir, 'package.json'))
  }))

  const packageNames = packages.map(p => p.pkg.name).join(' ')

  consola.info(`Linking ${packages.length} packages...`)

  await Promise.all(packages.map(pkg => execa('yarn', ['link'], { cwd: pkg.dir })))

  consola.log(`Link: \nyarn link ${packageNames}\n`)
  consola.log(`Unlink: \nyarn unlink ${packageNames}\n`)
}

main().catch(consola.error)
