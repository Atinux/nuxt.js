import consola from 'consola'
import chalk from 'chalk'
import opener from 'opener'
import { common, server } from '../options'
import { eventsMapping, formatPath } from '../utils'
import { showBanner } from '../utils/banner'
import { showMemoryUsage } from '../utils/memory'

export default {
  name: 'dev',
  description: 'Start the application in development mode (e.g. hot-code reloading, error reporting)',
  usage: 'dev <dir>',
  options: {
    ...common,
    ...server,
    open: {
      alias: 'o',
      type: 'boolean',
      description: 'Opens the server listeners url in the default browser'
    }
  },

  async run (cmd) {
    const { argv } = cmd

    try {
      await this.startDev(cmd, argv, argv.open)
    } catch (error) {
      consola.error(error)
    }
  },

  async startDev (cmd, argv) {
    const config = await cmd.getNuxtConfig({ dev: true, _build: true })
    const nuxt = await cmd.getNuxt(config)

    // Setup hooks
    nuxt.hook('watch:restart', payload => this.onWatchRestart(payload, { nuxt, cmd, argv }))
    nuxt.hook('bundler:change', changedFileName => this.onBundlerChange(changedFileName))

    // Wait for nuxt to be ready
    await nuxt.ready()

    if (config.loadingScreen) {
      await this.listen(nuxt, argv)
    }

    // Create builder instance
    const builder = await cmd.getBuilder(nuxt)

    // Start Build
    await builder.build()

    if (!config.loadingScreen) {
      await this.listen(nuxt, argv)
    }

    // Print memory usage
    showMemoryUsage()

    // Return instance
    return nuxt
  },

  async listen (nuxt, argv) {
    // Start listening
    await nuxt.server.listen()

    // Show banner when listening
    showBanner(nuxt, false)

    // Opens the server listeners url in the default browser (only once)
    if (argv.open) {
      argv.open = false
      const openerPromises = nuxt.server.listeners.map(listener => opener(listener.url))
      await Promise.all(openerPromises)
    }
  },

  logChanged ({ event, path }) {
    const { icon, color, action } = eventsMapping[event] || eventsMapping.change

    consola.log({
      type: event,
      icon: chalk[color].bold(icon),
      message: `${action} ${chalk.cyan(formatPath(path))}`
    })
  },

  async onWatchRestart ({ event, path }, { nuxt, cmd, argv }) {
    this.logChanged({ event, path })

    await nuxt.close()

    try {
      await this.startDev(cmd, argv)
    } catch (error) {
      consola.error(error)
    }
  },

  onBundlerChange (path) {
    this.logChanged({ event: 'change', path })
  }
}
