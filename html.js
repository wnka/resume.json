import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-even'
import { renderResume } from './render-resume.js'

const resume = JSON.parse(await fs.readFile('resume.json', 'utf-8'))
const html = await renderResume(resume, theme)
const wideScreenStyle = `
<style>
  @media screen and (min-width: 48em) {
    body {
      grid-template-columns:
        [full-start] 1fr
        [main-start side-start] minmax(min-content, 12em)
        [side-end content-start] minmax(min-content, 48em)
        [main-end content-end] 1fr
        [full-end];
    }
  }
</style>`

await fs.writeFile('index.html', html.replace('</head>', `${wideScreenStyle}</head>`))
