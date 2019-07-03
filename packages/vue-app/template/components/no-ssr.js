/*<%= isTest ? ' @vue/component' : '' %>
** From https://github.com/egoist/vue-no-ssr
** With the authorization of @egoist
*/
import NoSsr from 'vue-client-only'
export default {
  ...NoSsr,
  name: 'NoSsr',
  created() {
    console.warn(`deprecation warning in favour of using <client-only>`)
  }
}
