'use strict'

import path from 'path'
import fs from 'fs'
import {uniq} from 'lodash'
import hash from 'hash-sum'
import {chainFn} from './utils'

class Module {
  constructor (nuxt) {
    this.nuxt = nuxt
    this.options = nuxt.options
    this.modules = []
  }

  addVendor (vendor) {
    /* istanbul ignore if */
    if (!vendor) {
      return
    }
    this.options.build.vendor = uniq(this.options.build.vendor.concat(vendor))
  }

  addTemplate (template) {
    /* istanbul ignore if */
    if (!template) {
      return
    }
    // Validate & parse source
    const src = template.src || template
    const srcPath = path.parse(src)
    /* istanbul ignore if */
    if (!src || typeof src !== 'string' || !fs.existsSync(src)) {
      // eslint-disable-next-line no-console
      console.warn('[Nuxt] invalid template', template)
      return
    }
    // Generate unique and human readable dst filename
    const dst = template.fileName ||
      (path.basename(srcPath.dir) + '.' + srcPath.name + '.' + hash(src) + srcPath.ext)
    // Add to templates list
    const templateObj = {
      src,
      dst,
      options: template.options
    }
    this.options.build.templates.push(templateObj)
    // Watch template for changes
    this.addWatch(src)
    return templateObj
  }

  addWatch (pattern) {
    this.options.build.watch.push(pattern)
  }

  addPlugin (template) {
    const {dst} = this.addTemplate(template)
    // Add to nuxt plugins
    this.options.plugins.push({
      src: '~/.nuxt/' + dst,
      ssr: template.ssr,
      injectAs: template.injectAs
    })
  }

  addServerMiddleware (middleware) {
    this.options.serverMiddleware.push(middleware)
  }

  extendBuild (fn) {
    this.options.build.extend = chainFn(this.options.build.extend, fn)
  }

  extendRoutes (fn) {
    this.options.router.extendRoutes = chainFn(this.options.router.extendRoutes, fn)
  }

  requireModule (moduleOpts) {
    if (this.modules.indexOf(moduleOpts) !== -1 || this.modules.indexOf(moduleOpts.src) !== -1) {
      return false
    }
    return this.addModule(moduleOpts)
  }

  addModule (moduleOpts) {
    /* istanbul ignore if */
    if (!moduleOpts) {
      return
    }
    // Allows passing runtime options to each module
    const options = moduleOpts.options || {}
    let src = moduleOpts.src || moduleOpts
    // Resolve module
    let module
    try {
      if (typeof src === 'string') {
        // Using ~ shorthand modules are resolved from project srcDir
        if (src.indexOf('~') === 0) {
          src = path.resolve(this.options.srcDir, src.substr(1))
        }
        // eslint-disable-next-line no-eval
        module = eval('require')(src)
      }
    } catch (e) /* istanbul ignore next */ {
      // eslint-disable-next-line no-console
      console.error('[Nuxt] Unable to resolve module', src)
      // eslint-disable-next-line no-console
      console.error(e)
      return
    }
    // Validate module
    /* istanbul ignore if */
    if (!(module instanceof Function)) {
      // eslint-disable-next-line no-console
      console.error('[Nuxt] Module should be a function', module)
    }
    // Add module to this.modules
    this.modules.push(module)
    // Call module with `this` context and pass options
    return new Promise((resolve, reject) => {
      const result = module.call(this, options, err => {
        /* istanbul ignore if */
        if (err) {
          return reject(err)
        }
        resolve(module)
      })
      if (result && result.then instanceof Function) {
        return result.then(resolve)
      }
    })
  }
}

export default Module
