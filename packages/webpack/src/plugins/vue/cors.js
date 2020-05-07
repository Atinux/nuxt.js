import HtmlWebpackPlugin from 'html-webpack-plugin'

export default class CorsPlugin {
  constructor ({ crossorigin }) {
    this.crossorigin = crossorigin
  }

  apply (compiler) {
    const ID = 'vue-cors-plugin'
    compiler.hooks.compilation.tap(ID, (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tap(ID, ({ assetTags }) => {
        if (!this.crossorigin) {
          return
        }
        [...assetTags.scripts, ...assetTags.styles].forEach((tag) => {
          if (tag.attributes) {
            tag.attributes.crossorigin = this.crossorigin
          }
        })
      })
    })
  }
}
