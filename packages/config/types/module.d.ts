/**
 * NuxtConfigurationModule
 * Documentation: https://nuxtjs.org/api/configuration-modules
 *                https://nuxtjs.org/guide/modules
 */

export type NuxtModule = (this: any, moduleOptions?: { [key: string]: any }) => Promise<void> | void // this, this.options & this.nuxt TBD

export type NuxtConfigurationModule = string | [string, { [key: string]: any }] | NuxtModule
