'use strict'

const http = require('http')

class Server {

  constructor (nuxt) {
    this.nuxt = nuxt
    this.server = http.createServer(this.render.bind(this))
    return this
  }

  render (req, res) {
    this.nuxt.render(req, res)
    return this
  }

  listen (port, host) {
    host = host || '0.0.0.0' // http://stackoverflow.com/a/30712750/44080 - enable connecting to localhost:3000 from another computer
    port = port || 3000
    this.server.listen(port, host, () => {
      console.log('Ready on http://%s:%s', host, port) // eslint-disable-line no-console
    })
    return this
  }

  close (cb) {
    return this.server.close(cb)
  }

}

export default Server
