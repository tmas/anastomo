import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import fs from 'node:fs'
import { join } from 'node:path'

describe('build', () => {
  it('runs build for example1', async () => {
    const { stdout } = await runCommand('build --config test/test-projects/example1/anastomo.conf.json --target test/test-projects/example1')
    expect(stdout).to.contain('Build complete!')
    // ensure the build directory contains the expected files
    const buildDir = join(process.cwd(), 'test', 'test-projects', 'example1', '.anastomo', 'build')
    expect(fs.existsSync(buildDir)).to.be.true
    expect(fs.readdirSync(buildDir, { recursive: true })).to.deep.equal([
      'public',
      'public/css',
      'public/js',
      'public/css/static.css',
      'public/js/new.js',
      'public/js/old.js'
    ])
  })
})
