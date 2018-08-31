#!/usr/bin/env node -r esm

import path from 'path'
import fs from 'fs-extra'
import Package from './package'

// Commons
const rootDir = path.resolve(__dirname, '..')
const rootNodeModules = path.resolve(rootDir, 'node_modules')

// Build main package
const nuxtPackage = new Package({ rootDir: rootDir })
nuxtPackage.build()

// Build packages/*
const packages = [
  'nuxt-start',
  'nuxt-legacy'
]

for (const packageName of packages) {
  const packageDir = path.resolve(rootDir, 'packages', packageName)
  const pkg = new Package({ rootDir: packageDir })

  // Link global node_modules until we use lerna
  const pkgNodeModules = pkg.resolvePath('node_modules')
  fs.removeSync(pkgNodeModules)
  fs.ensureSymlinkSync(rootNodeModules, pkgNodeModules)

  // Build
  pkg.build()

  // Run prepack
  pkg.exec('node', '-r esm ./prepack.js')

  // Copy artifacts to the main dist for b.w compatibility
  fs.copySync(pkg.distDir, nuxtPackage.distDir)
}
