import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-even'
import puppeteer from 'puppeteer'
import { renderResume } from './render-resume.js'

const resume = JSON.parse(await fs.readFile('resume.json', 'utf-8'))
const html = await renderResume(resume, theme)

const browser = await puppeteer.launch()
const page = await browser.newPage()

await page.setContent(html, { waitUntil: 'networkidle0' })
await page.addStyleTag({
  content: `
    @media print {
      html { font-size: 12px; }
      body { gap: 1em; margin-bottom: 2em; }
      .masthead { padding: 2.5em 0; }
      .stack { gap: 1em; }
      #work .stack {
        display: block;
      }
      #work .stack > article + article {
        margin-top: 1em;
      }
    }
  `
})
await page.pdf({ path: 'resume.pdf', format: 'letter', printBackground: true, margin: {top: 20, bottom: 20} })
await browser.close()
