export default {
  mode: 'spa',
  pageTransition: false,
  render: {
    http2: {
      push: true
    },
    bundleRenderer: {
      shouldPrefetch: () => true
    }
  },
  build: {
    filenames: {
      app: '[name].js',
      chunk: '[name].js'
    }
  },
  router: {
    middleware: 'middleware'
  },
  plugins: [
    '~/plugins/error.js'
  ]
}
