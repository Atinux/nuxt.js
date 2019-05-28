import Vue from 'vue'
import { compile } from '../utils'

<% if (components.ErrorPage) { %>
  <% if (('~@').includes(components.ErrorPage.charAt(0))) { %>
import NuxtError from '<%= components.ErrorPage %>'
  <% } else { %>
import NuxtError from '<%= "../" + components.ErrorPage %>'
  <% } %>
<% } else { %>
import NuxtError from './nuxt-error.vue'
<% } %>
import NuxtChild from './nuxt-child'

<%if (buildIndicator) { %>import BuildIndicator from './build-indicator'<% } %>

<%= isTest ? '// @vue/component' : '' %>
export default {
  name: 'Nuxt',
  components: {
    NuxtChild,
    NuxtError<%if(buildIndicator) { %>,
    BuildIndicator <% } %>
  },
  props: {
    nuxtChildKey: {
      type: String,
      default: undefined
    },
    keepAlive: Boolean,
    keepAliveProps: {
      type: Object,
      default: undefined
    },
    name: {
      type: String,
      default: 'default'
    }
  },
  computed: {
    routerViewKey() {
      // If nuxtChildKey prop is given or current route has children
      if (typeof this.nuxtChildKey !== 'undefined' || this.$route.matched.length > 1) {
        return this.nuxtChildKey || compile(this.$route.matched[0].path)(this.$route.params)
      }

      const [matchedRoute] = this.$route.matched
      const Component = matchedRoute && matchedRoute.components.default

      if (Component && Component.options) {
        const { options } = Component

        if (options.key) {
          return (typeof options.key === 'function' ? options.key(this.$route) : options.key)
        }
      }

      const strict = /\/$/.test(matchedRoute.path)
      return strict ? this.$route.path : this.$route.path.replace(/\/$/, '')
    }
  },
  beforeCreate() {
    Vue.util.defineReactive(this, 'nuxt', this.$root.$options.nuxt)
  },
  render(h) {
    let el
    // If there is some error
    if (this.nuxt.err) {
      el = h('NuxtError', {
        props: {
          error: this.nuxt.err
        }
      })
    } else {
      // Render nuxt child
      el = h('NuxtChild', {
        key: this.routerViewKey,
        props: this.$props
      })
    }
    <%if (buildIndicator) { %>
    return h('div', [
      el,
      h(BuildIndicator)
    ])
    <% } else { %>
    return el
    <% } %>
  }
}
