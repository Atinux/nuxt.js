import consola from 'consola'
import commonOptions from '../options/common'

export default {
  description: 'Generate a static web application (server-rendered)',
  usage: 'generate <dir>',
  options: {
    ...commonOptions,
    build: {
      type: 'boolean',
      default: true,
      description: 'Only generate pages for dynamic routes. Nuxt has to be built once before using this option'
    }
  },
  async run(cmd) {
    const argv = cmd.getArgv()

    const generator = await cmd.getGenerator(
      await cmd.getNuxt(
        await cmd.getNuxtConfig(argv, { dev: false })
      )
    )

    return generator.generate({
      init: true,
      build: argv.build
    }).then(() => {
      process.exit(0)
    }).catch(err => consola.fatal(err))
  }
}
