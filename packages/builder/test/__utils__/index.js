export const createNuxt = () => ({
  options: {
    globalName: 'global_name',
    globals: [],
    build: {
      watch: []
    },
    render: {
      ssr: true
    },
    router: {},
    dir: {
      app: 'app'
    }
  },
  ready: jest.fn(),
  hook: jest.fn(),
  callHook: jest.fn(),
  resolver: {
    resolveAlias: jest.fn(src => `resolveAlias(${src})`),
    resolvePath: jest.fn(src => `resolvePath(${src})`)
  }
})
