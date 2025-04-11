import {Command, Flags} from '@oclif/core'
import {execSync} from 'node:child_process'

import {resolveConfig} from '../../config-resolver.js'

export default class Lint extends Command {
  static description = 'Parse the config file and ensure it is valid'
  static examples = [
    `<%= config.bin %> <%= command.id %> --config anastomo.config.ts
Config is valid!
`,
  ]
  static flags = {
    config: Flags.string({char: 'c', default: 'anastomo.conf.json', description: 'Path to config file', required: false}),
  }

  async run(): Promise<void> {
    const {flags} = await this.parse(Lint)

    try {
      const config = await resolveConfig(flags.config)
      this.log('Config is valid!')
      this.log('Found ' + config.pipelines.length + ' pipelines:')
      config.pipelines.forEach(pipeline => {
        this.log(` - ${pipeline.name}: ${pipeline.description} (${pipeline.src.length} sources, ${pipeline.artifacts.length} artifacts)`)
        if (pipeline.buildCommand) {
          this.log(`   - Using build command: ${pipeline.buildCommand}`)
        } else {
          this.log(`   - No build command defined`)
        }

        if (pipeline.nodeVersion) {
          this.log(`   - Using node version: ${pipeline.nodeVersion}`)
        } else {
          this.log(`   - Using default node version (${execSync('node --version').toString().trim()})`)
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        this.error(error.message)
      } else {
        this.error('Failed to validate config: Unknown error')
      }
    }
  }
}
