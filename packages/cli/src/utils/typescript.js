import path from 'path'
import fs from 'fs-extra'
import * as imports from '../imports'

let _guard = false
export const setGuard = (val) => { _guard = val }

async function registerTSNode({ tsConfigPath, options }) {
  if (_guard) {
    return
  }

  const { register } = await imports.tsNode()

  // https://github.com/TypeStrong/ts-node
  register({
    project: tsConfigPath,
    compilerOptions: {
      module: 'commonjs'
    },
    ...options
  })

  _guard = true
}

async function getNuxtTypeScript() {
  try {
    return await imports.nuxtTypescript()
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw (error)
    }
  }
}

export async function detectTypeScript(rootDir, options = {}) {
  const typescript = {
    tsConfigPath: path.resolve(rootDir, 'tsconfig.json'),
    tsConfigExists: false,
    runtime: false,
    build: false,
    options
  }

  // Check if tsconfig.json exists
  typescript.tsConfigExists = await fs.exists(typescript.tsConfigPath)

  // Skip if tsconfig.json not exists
  if (!typescript.tsConfigExists) {
    return typescript
  }

  // Register runtime support
  typescript.runtime = true
  await registerTSNode(typescript)

  // Try to load @nuxt/typescript
  const nuxtTypeScript = await getNuxtTypeScript()

  // If exists do additional setup
  if (nuxtTypeScript) {
    typescript.build = true
    await nuxtTypeScript.setupDefaults({ tsConfigPath: typescript.tsConfigPath, srcDir: options.srcDir })
  }

  return typescript
}
