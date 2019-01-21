import BuildContext from '../src/context'

describe('builder: context', () => {
  test('should construct context', () => {
    const builder = {
      nuxt: { options: {} }
    }
    const context = new BuildContext(builder)
    expect(context._builder).toEqual(builder)
    expect(context.nuxt).toEqual(builder.nuxt)
    expect(context.options).toEqual(builder.nuxt.options)
    expect(context.isStatic).toEqual(false)
  })

  test('should return builder plugins context', () => {
    const builder = {
      plugins: [],
      nuxt: { options: {} }
    }
    const context = new BuildContext(builder)
    expect(context.plugins).toEqual(builder.plugins)
  })
})
