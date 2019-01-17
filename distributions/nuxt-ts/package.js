import { readJSONSync, writeFile } from 'fs-extra'

export default {
  build: true,
  hooks: {
    async 'build:done'(pkg) {
      const mono = pkg.load('../..')
      const nuxt = pkg.load('../nuxt')

      await pkg.copyFilesFrom(mono, [
        'LICENSE'
      ])

      pkg.copyFieldsFrom(nuxt, [
        'license',
        'repository',
        'contributors',
        'keywords',
        'collective'
      ])

      await pkg.writePackage()

      if (pkg.options.suffix && pkg.options.linkedDependencies) {
        const tsconfig = readJSONSync(pkg.resolvePath('tsconfig.json'))

        tsconfig.compilerOptions.types = tsconfig.compilerOptions.types.map((type) => {
          const suffix = pkg.options.linkedDependencies.includes(type) ? pkg.options.suffix : ''
          return type + suffix
        })

        await writeFile('tsconfig.json', JSON.stringify(tsconfig, undefined, 2) + '\n')
      }
    }
  }
}
