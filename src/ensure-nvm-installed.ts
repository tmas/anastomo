import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Check if NVM is installed locally in the project's .anastomo/tools/nvm directory
 */
export const nvmInstalled = async function(targetDir?: null | string): Promise<boolean> {
  try {
    if (!targetDir) {
      targetDir = process.cwd()
    }

    const nvmDir = join(targetDir, '.anastomo', 'tools', 'nvm')
    const nvmScript = join(nvmDir, 'nvm.sh')

    return existsSync(nvmScript)
  } catch {
    return false
  }
}

/**
 * Ensure NVM is installed locally in the project's .anastomo/tools/nvm directory
 */
export const ensureNvmInstalled = async function(targetDir?: null | string): Promise<void> {
  if (!targetDir) {
    targetDir = process.cwd()
  }

  const anastomoDir = join(targetDir, '.anastomo')
  const toolsDir = join(anastomoDir, 'tools')
  const nvmDir = join(toolsDir, 'nvm')
  const nvmRunScript = join(toolsDir, 'nvm-run.sh')
  const nvmSrcScript = join(toolsDir, 'nvm-src.sh')

  // Create directory structure
  if (!existsSync(anastomoDir)) {
    mkdirSync(anastomoDir, { recursive: true })
  }

  if (!existsSync(toolsDir)) {
    mkdirSync(toolsDir, { recursive: true })
  }

  if (!existsSync(nvmDir)) {
    mkdirSync(nvmDir, { recursive: true })
  }

  // Install NVM if not already installed
  if (!await nvmInstalled(targetDir)) {
    try {
      // Download and install NVM

      // Write temporary install script that installs directly to target directory
      const installNvm = `
#!/usr/bin/env bash
set -e

# Download and install NVM directly to the target directory
NVM_DIR="${nvmDir}" PROFILE=/dev/null bash -c "$(curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh)"
`
      const tempScript = join(nvmDir, 'install-nvm.sh')
      writeFileSync(tempScript, installNvm)

      // Make it executable and run it
      execSync(`chmod +x "${tempScript}"`, { stdio: 'inherit' })
      execSync(`bash "${tempScript}"`, { stdio: 'inherit' })

      // Clean up temp script
      execSync(`rm "${tempScript}"`, { stdio: 'inherit' })

    } catch (error) {
      throw new Error(`Failed to install NVM: ${error}`)
    }
  }

  // Create nvm-run.sh script
  const nvmRun = `
#!/usr/bin/env bash

# Resolve project directory
PROJECT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")/../../" && pwd)"
export NVM_DIR="$PROJECT_DIR/.anastomo/tools/nvm"

# Load nvm
. "$NVM_DIR/nvm.sh"

# Run given command using nvm's environment
"$@" || exit $?
`
  writeFileSync(nvmRunScript, nvmRun)
  execSync(`chmod +x "${nvmRunScript}"`, { stdio: 'inherit' })

  // Create nvm-run.sh script
  const nvmSrc = `
#!/usr/bin/env bash

# Resolve project directory
PROJECT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")/../../" && pwd)"
export NVM_DIR="$PROJECT_DIR/.anastomo/tools/nvm"

# unset npm_config_prefix to allow NVM to work
unset npm_config_prefix

# Load nvm
. "$NVM_DIR/nvm.sh"

# Return a successful exit code so the next command in the chain can run
true
`
  writeFileSync(nvmSrcScript, nvmSrc)
  execSync(`chmod +x "${nvmSrcScript}"`, { stdio: 'inherit' })
}
