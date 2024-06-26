import * as path from 'node:path'
import { promises as fs } from 'fs'
import { getInterCss } from '../../src/summary-pdf/interCss'
import { getTailwindCss } from '../../src/summary-pdf/tailwindCss'
// synchronizedPrettier must be used until https://github.com/jestjs/jest/issues/14305 is solved
import synchronizedPrettier from '@prettier/sync'

/*
 * This script generates base64-encoded assets from files and strings and writes them to the src/generated-assets
 * directory as TypeScript files.
 *
 * After examining multiple solutions that:
 *  - load the file as a string (file loaders in esbuild/vite/webpack, using fs directly) - for static assets,
 *  - pre-evaluate script (babel-plugin-preval, esbuild custom plugins) - for scripts that need to access the file system
 *    in their evaluation - e.g. generating Tailwind or Inter font CSS
 *
 * this no-frills approach was chosen for its simplicity and ease of use. It works in all environments (jest,
 * Next.js/Nest) or built/directly imported version of the library consistently and is as performant as other solutions.
 */

function convertStringToBase64(str: string) {
  return Buffer.from(str).toString('base64')
}

const rootDir = path.join(__dirname, '../../')

const assetsList = [
  {
    name: 'taxPdf',
    getBase64Content: async () =>
      fs.readFile(path.join(rootDir, './resources/Priznanie_komplet_tlacivo.pdf'), {
        encoding: 'base64',
      }),
  },
  {
    name: 'taxPdfFont',
    getBase64Content: async () =>
      fs.readFile(path.join(rootDir, './resources/LiberationSans.ttf'), {
        encoding: 'base64',
      }),
  },
  {
    name: 'summaryPdfCss',
    getBase64Content: async () => {
      const cssArray = await Promise.all([getInterCss(), getTailwindCss()])
      const joinedStrings = cssArray.join('\n')

      return convertStringToBase64(joinedStrings)
    },
  },
]

const reformatWithPrettier = (code: string) => {
  const configFile = synchronizedPrettier.resolveConfigFile(rootDir)
  if (!configFile) {
    throw new Error('Prettier config file not found')
  }
  const options = synchronizedPrettier.resolveConfig(configFile)
  if (!options) {
    throw new Error('Prettier options not found')
  }

  return synchronizedPrettier.format(code, { ...options, parser: 'typescript' })
}

const renderContent = (base64String: string) => {
  const code = `/* This file is automatically generated, don't change the contents, see "scripts/assets/". */ 

export default Buffer.from(${JSON.stringify(base64String)}, 'base64')\n`

  return reformatWithPrettier(code)
}

const srcAssetsDir = path.join(rootDir, './src/generated-assets')

export const getRenderedAssets = () => {
  return assetsList.map(async ({ name, getBase64Content }) => {
    return {
      path: path.join(srcAssetsDir, `./${name}.ts`),
      content: renderContent(await getBase64Content()),
    }
  })
}

export const generateAssetFiles = async () => {
  await fs.mkdir(srcAssetsDir, { recursive: true })
  const assets = await Promise.all(getRenderedAssets())
  for (const { path, content } of assets) {
    await fs.writeFile(path, content)
  }
}