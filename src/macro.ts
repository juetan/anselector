import pkg from '../package.json'

export function getVersion() {
  return `v${pkg.version}`
}