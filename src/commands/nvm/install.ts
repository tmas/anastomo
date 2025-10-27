import { Command, Flags } from '@oclif/core'
import { resolve } from 'node:path'

import { ensureNvmInstalled, nvmInstalled } from "../../ensure-nvm-installed.js";

export default class Check extends Command {
  static description = 'Install NVM locally in the working directory'
  static examples = [
    `<%= config.bin %> <%= command.id %> --target .`,
  ]
  static flags = {
    target: Flags.string({
      char: 't',
      default: '.',
      description: 'Path to target project',
      required: false
    }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(Check)

    try {
      const targetDir = resolve(process.cwd(), flags.target)
      const isNvmInstalled = await nvmInstalled(targetDir)

      if (isNvmInstalled) {
        this.log('NVM is already installed! Proceeding without installation.')
      } else {
        this.log('NVM is NOT installed locally in the project. Installing NVM and creating required shell scripts...')
        await ensureNvmInstalled(targetDir)
        this.log('NVM installation complete.')
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(error.message)
      } else {
        this.error('Failed to check whether NVM is installed locally in the project: Unknown error')
      }
    }
  }
}
