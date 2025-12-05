import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import fs from 'node:fs'
import { join } from 'node:path'

describe('build', () => {
  it('runs build for example1', async () => {
    const { stdout } = await runCommand('build --config test/test-projects/example1/anastomo.conf.json --target test/test-projects/example1')
    expect(stdout).to.contain('Build complete!')
    // ensure the build directory contains the expected files
    const artifactDir = join(process.cwd(), 'test', 'test-projects', 'example1', 'public')
    expect(fs.existsSync(artifactDir)).to.be.true
    expect(fs.readdirSync(artifactDir, { recursive: true }).sort()).to.deep.equal([
      'css',
      'js',
      'css/static.css',
      'css/app.css',
      'js/new.js',
      'js/old.js'
    ].sort())

    
    const testProjectDir = join(process.cwd(), 'test', 'test-projects', 'example1')
    const workingDir = join(testProjectDir, '.anastomo')
    
    // Verify configFiles: legacy pipeline should have tailwind.config.js (renamed from tailwind.config.legacy.js)
    const legacyWorkingDir = join(workingDir, 'legacy')
    expect(fs.existsSync(join(legacyWorkingDir, 'tailwind.config.js'))).to.be.true
    expect(fs.existsSync(join(legacyWorkingDir, 'tailwind.config.legacy.js'))).to.be.true
    
    // Verify configFiles: modern pipeline should have tailwind.config.js
    const modernWorkingDir = join(workingDir, 'modern')
    expect(fs.existsSync(join(modernWorkingDir, 'tailwind.config.js'))).to.be.true
    
    // Verify prePathMap: modern pipeline should have app.css (copied from static.css)
    expect(fs.existsSync(join(modernWorkingDir, 'resources', 'assets', 'css', 'app.css'))).to.be.true
    expect(fs.existsSync(join(modernWorkingDir, 'resources', 'assets', 'css', 'static.css'))).to.be.true

    // clean up artifactDir after test
    fs.rmSync(artifactDir, { recursive: true })
  })
})
