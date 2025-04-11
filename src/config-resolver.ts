import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {z} from 'zod'

import {ConfigSchema, ConfigType} from './entities/config.js'
import {defaultPipeline} from './entities/pipeline.js'
import { npmInstalled } from './hooks/init/require-nvm.js'

export async function resolveConfig(configPath: string): Promise<ConfigType> {
  try {
    // Read and parse the config file
    const fullPath = join(process.cwd(), configPath)
    const configContent = readFileSync(fullPath, 'utf8')
    const parsedConfig = JSON.parse(configContent)

    // Validate against the schema
    const result = ConfigSchema.safeParse(parsedConfig)

    if (!result.success) {
      throw new Error('Config validation failed:\n' +
        result.error.issues.map((issue: z.ZodIssue) =>
          `- ${issue.path.join('.')}: ${issue.message}`
        ).join('\n')
      )
    }

    // Merge defaults with the validated config
    const config = result.data
    const resolvedConfig: ConfigType = {
      pipelines: config.pipelines.map(pipeline => ({
        ...defaultPipeline,
        ...pipeline,
        // Ensure arrays are not overwritten by defaults if they exist
        artifacts: pipeline.artifacts || defaultPipeline.artifacts,
        src: pipeline.src || defaultPipeline.src,
      }))
    }


    if (resolvedConfig.pipelines.some(pipeline => pipeline.nodeVersion) && !(await npmInstalled())) {
      throw new Error('Pipelines must not define nodeVersion unless NVM is available.')
    }

    return resolvedConfig
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Failed to resolve config: ${error.message}`)
    }

    throw new Error('Failed to resolve config: Unknown error')
  }
}
