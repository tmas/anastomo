import { Command, Flags } from '@oclif/core'
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

import { ensureNvmInstalled } from '../../ensure-nvm-installed.js'
import { Pipeline } from '../../entities/pipeline.js'
import { resolveConfig } from '../../resolve-config.js'

export default class Build extends Command {
    static description = 'Split assets and tooling, run build commands, and copy artifacts to build directory'
    static examples = [
        `<%= config.bin %> <%= command.id %> --config anastomo.config.ts --target .`,
    ]
    static flags = {
        config: Flags.string({
            char: 'c',
            default: 'anastomo.conf.json',
            description: 'Path to config file',
            required: false
        }),
        target: Flags.string({
            char: 't',
            default: '.',
            description: 'Path to target project',
            required: false
        }),
    }

    getBuildDir(workingDir: string): string {
        const buildDir = join(workingDir, 'build/')

        mkdirSync(buildDir, { recursive: true })

        return buildDir
    }

    getPipelineWorkingDir(workingDir: string, pipeline: Pipeline): string {
        const path = join(workingDir, pipeline.name.toLowerCase().replaceAll(' ', '-') + '/')

        mkdirSync(path, { recursive: true })

        return path
    }

    getWorkingDir(targetDir: string): string {
        const workingDir = join(targetDir, '.anastomo/')

        // if workingDir exists, remove its contents. Else, create it.
        if (existsSync(workingDir)) {
            rmSync(workingDir, { force: true, recursive: true })
        }

        mkdirSync(workingDir, {recursive: true})

        return workingDir
    }

    async run(): Promise<void> {
        const { flags } = await this.parse(Build)

        try {
            const config = await resolveConfig(flags.config)
            const targetDir = resolve(process.cwd(), flags.target)
            const workingDir = this.getWorkingDir(targetDir)
            const nvmSrcScript = join(workingDir, 'tools/nvm-src.sh')
            const buildDir = this.getBuildDir(workingDir)
            const defaultNodeVersion = execSync('node --version').toString().trim()

            await ensureNvmInstalled(targetDir)

            for (const pipeline of config.pipelines) {
                this.log(`Processing pipeline ${pipeline.name}...`)
                this.log(`\tSplitting...`)
                const pipelineWorkingDir = this.getPipelineWorkingDir(workingDir, pipeline)

                // copy this pipeline's configured package.json and package-lock.json to pipelineWorkingDir
                cpSync(join(targetDir, pipeline.packageJson), join(pipelineWorkingDir, 'package.json'))
                cpSync(join(targetDir, pipeline.packageLock), join(pipelineWorkingDir, 'package-lock.json'))

                // copy src files to pipelineWorkingDir
                for (const file of pipeline.src) {
                    const srcPath = join(targetDir, file)
                    const destPath = join(pipelineWorkingDir, file)
                    this.log(`\t\tCopying asset ${srcPath.replace(targetDir, '')} to ${destPath.replace(targetDir, '')}`)

                    // ensure directory for destPath exists
                    const destDir = dirname(destPath)
                    if (!existsSync(destDir)) {
                        this.log(`\t\t\tCreating directory ${destDir.replace(targetDir, '')}`)
                        mkdirSync(destDir, { recursive: true })
                    }

                    cpSync(srcPath, destPath, { recursive: true })
                }

                this.log(`\tSplit complete! Building pipeline ${pipeline.name}...`)

                // if there is a build command, run it.
                // if there is a node version, use it.
                // if there is no node version, use the default node version.
                if (pipeline.buildCommand) {
                    const nodeVersion = pipeline.nodeVersion || defaultNodeVersion
                    this.log(`\t\tInstalling node version ${nodeVersion} and running '${pipeline.buildCommand}'...`)
                    const result = execSync(`source $NVM_DIR/nvm.sh && nvm install ${nodeVersion} 2>&1 && ${pipeline.buildCommand}`, {cwd: pipelineWorkingDir})
                    for (const line of result.toString().split('\n')) {
                        this.log(`\t\t\t${line}`)
                    }
                }

                this.log('\tBuild complete!')

                // if there is a pathMap, apply it in pipelineWorkingDir
                if (pipeline.pathMap) {
                    this.log('\tApplying pathMap...')
                    for (const [src, dest] of Object.entries(pipeline.pathMap)) {
                        const srcPath = join(pipelineWorkingDir, src)
                        const destPath = join(pipelineWorkingDir, dest)

                        this.log(`\t\tCopying ${srcPath.replace(targetDir, '')} to ${destPath.replace(targetDir, '')}`)

                        // ensure directory for destPath exists
                        const destDir = dirname(destPath)
                        if (!existsSync(destDir)) {
                            this.log(`\t\t\tCreating directory ${destDir.replace(targetDir, '')}`)
                            mkdirSync(destDir, { recursive: true })
                        }

                        cpSync(srcPath, destPath, { recursive: true })
                    }
                }

                this.log('\tCopying artifacts...')

                // copy artifacts from pipelineWorkingDir to buildDir unless they already exist
                for (const file of pipeline.artifacts) {
                    const srcPath = join(pipelineWorkingDir, file)
                    const destPath = join(buildDir, file)
                    this.log(`\t\tCopying artifact ${srcPath.replace(targetDir, '')} to ${destPath.replace(targetDir, '')}`)

                    // ensure directory for destPath exists
                    const destDir = dirname(destPath)
                    if (!existsSync(destDir)) {
                        this.log(`\t\t\tCreating directory ${destDir.replace(targetDir, '')}`)
                        mkdirSync(destDir, { recursive: true })
                    }

                    if (existsSync(destPath)) {
                        this.error(`\t\tERROR: artifact ${file} from pipeline ${pipeline.name} already exists in ${buildDir}. Aborting.`)
                    }

                    cpSync(srcPath, destPath, { recursive: true })
                }
            }

            this.log('Build complete!')
        } catch (error) {
            if (error instanceof Error) {
                this.error(error.message)
            } else {
                this.error('Anastomo build failed: Unknown error')
            }
        }
    }
}
