import { render } from 'resumed'

const sectionOrder = [
  'work',
  'publications',
  'projects',
  'education',
  'volunteer',
  'awards',
  'certificates',
  'skills',
  'languages',
  'interests',
  'references'
]

export async function renderResume(resume, theme) {
  const html = await render(resume, theme)
  const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/)
  if (!bodyMatch) return html

  const sectionPattern = /<section id="([^"]+)">[\s\S]*?<\/section>/g
  const sections = new Map()
  const sectionIds = []
  let match

  while ((match = sectionPattern.exec(bodyMatch[1])) !== null) {
    sections.set(match[1], match[0])
    sectionIds.push(match[1])
  }

  if (sections.size === 0) return html

  const bodyWithoutSections = bodyMatch[1].replace(sectionPattern, '')
  const orderedIds = [
    ...sectionOrder,
    ...sectionIds.filter((id) => !sectionOrder.includes(id))
  ]
  const orderedSections = orderedIds
    .filter((id) => sections.has(id))
    .map((id) => sections.get(id))
    .join('')

  return html.replace(bodyMatch[0], `<body>${bodyWithoutSections}${orderedSections}</body>`)
}
