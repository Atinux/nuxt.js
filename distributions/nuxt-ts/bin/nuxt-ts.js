#!/usr/bin/env node

// Globally indicate we are running in ts mode
process.env.NUXT_TS = 'true'

require('..').generateTsConfigIfMissing()
require('..').registerTsNode()

const suffix = require('../package.json').name.includes('-edge') ? '-edge' : ''
require('@nuxt/cli' + suffix).run()
  .catch((error) => {
    require('consola').fatal(error)
    process.exit(2)
  })
