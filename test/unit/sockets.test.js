import { loadFixture, Nuxt } from '../utils'


describe.skip.win('basic sockets', () => {
  test('/', async () => {
    const options = await loadFixture('sockets')
    const nuxt = new Nuxt(options)
    await nuxt.server.listen()

    const { html } = await nuxt.server.renderRoute('/')
    expect(html).toContain('<h1>Served over sockets!</h1>')

    await nuxt.close()
  })
})
