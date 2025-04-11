import {z} from 'zod'

import {Pipeline, PipelineSchema} from './pipeline.js'

export interface Config {
  pipelines: Pipeline[]
}

export const ConfigSchema = z.object({
  pipelines: z.array(PipelineSchema),
})

export type ConfigType = z.infer<typeof ConfigSchema>