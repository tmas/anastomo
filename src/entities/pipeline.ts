import {z} from 'zod'

export interface Pipeline {
  artifacts: string[]
  buildCommand?: string
  description: string
  name: string
  nodeVersion?: string
  packageJson: string
  packageLock: string
  pathMap?: Record<string, string>
  src: string[]
}

export const PipelineSchema = z.object({
  artifacts: z.array(z.string()),
  buildCommand: z.string().optional(),
  description: z.string(),
  name: z.string(),
  nodeVersion: z.string().optional(),
  packageJson: z.string().optional(),
  packageLock: z.string().optional(),
  pathMap: z.record(z.string(), z.string()).optional(),
  src: z.array(z.string()),
})

export type PipelineType = z.infer<typeof PipelineSchema>

export const defaultPipeline: Pipeline = {
  artifacts: [],
  description: '',
  name: '',
  packageJson: 'package.json',
  packageLock: 'package-lock.json',
  src: [],
}