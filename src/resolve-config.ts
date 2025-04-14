import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { z } from 'zod'

import { Config, ConfigSchema } from './entities/config.js'
import { defaultPipeline, Pipeline } from './entities/pipeline.js'
import { npmInstalled } from './hooks/init/require-nvm.js'

export async function resolveConfig(configPath: string): Promise<Config> {
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
    const resolvedConfig: Config = {
      pipelines: config.pipelines.map(pipeline => ({
        ...defaultPipeline,
        ...pipeline,
        // Ensure artifacts and src are always provided by the pipeline config.
        artifacts: pipeline.artifacts,
        src: pipeline.src,
      }) as Pipeline)
    }


    if (resolvedConfig.pipelines.some(pipeline => pipeline.nodeVersion) && !(await npmInstalled())) {
      throw new Error('Pipelines must not define nodeVersion unless NVM is available.')
    }

    return resolvedConfig as Config
  } catch (error) {
    if (error instanceof Error) {
      throw new TypeError(`Failed to resolve config: ${error.message}`)
    }

    throw new Error('Failed to resolve config: Unknown error')
  }
}
