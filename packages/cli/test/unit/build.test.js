import { consola, mockGetNuxt, mockGetBuilder, mockGetGenerator } from '../utils'

describe('build', () => {
  let build

  beforeAll(async () => {
    build = await import('../../src/commands/build')
    build = build.default.run

    jest.spyOn(process, 'exit').mockImplementation(code => code)
  })

  afterAll(() => {
    process.exit.mockRestore()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('is function', () => {
    expect(typeof build).toBe('function')
  })

  test('builds on universal mode', async () => {
    mockGetNuxt({
      mode: 'universal',
      build: {
        analyze: true
      }
    })
    const builder = mockGetBuilder(Promise.resolve())

    await build()

    expect(builder).toHaveBeenCalled()
  })

  test('generates on spa mode', async () => {
    mockGetNuxt({
      mode: 'spa',
      build: {
        analyze: false
      }
    })
    const generate = mockGetGenerator(Promise.resolve())

    await build()

    expect(generate).toHaveBeenCalled()
    expect(process.exit).toHaveBeenCalled()
  })

  test('catches error', async () => {
    mockGetNuxt({ mode: 'universal' })
    mockGetBuilder(Promise.reject(new Error('Builder Error')))

    await build()

    expect(consola.fatal).toHaveBeenCalledWith(new Error('Builder Error'))
  })
})
