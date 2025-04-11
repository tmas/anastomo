import {Hook} from '@oclif/core'
import {execSync} from 'node:child_process'

// this function returns a boolean
export const npmInstalled = async function(): Promise<boolean> {
  try {
    execSync('[ ! -z "$NVM_DIR" ];', {stdio: 'ignore'})
    return true
  } catch {
    return false
  }
}

const hook: Hook.Init = async function(options) {
  if (!(await npmInstalled())) {
    options.context.warn('NVM is not available. If your pipelines define nodeVersion, you must install NVM.')
  }
}

export default hook
