const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const formatDate = (date) => {
  if (!date) return ''
  const parts = date.split('-')
  if (parts.length === 1) return parts[0]
  const month = Number(parts[1])
  const year = parts[0]
  return new Date(Date.UTC(Number(year), month - 1, 1))
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const formatDateRange = (start, end) => {
  const left = formatDate(start)
  const right = end ? formatDate(end) : 'Present'
  return left ? `${left} – ${right}` : right
}

const link = (url, label) =>
  url ? `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>` : escapeHtml(label)

const icon = (name) => {
  const paths = {
    location: '<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    email: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9s-1.1 6.5-3.3 9c-2.2-2.5-3.3-5.5-3.3-9S9.8 5.5 12 3Z"/>',
    github: '<path fill="currentColor" stroke="none" d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.2-1.2-1.5-1.2-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.7-1.3-2.3-.3-4.7-1.2-4.7-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.5 9.5 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.7 5.1.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z"/>'
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`
}

const list = (items = []) =>
  items.length
    ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : ''

const workEntry = (entry) => `
  <article class="entry">
    <header class="entry-header">
      <div>
        <h3>${escapeHtml(entry.position || entry.name || '')}</h3>
        <div class="organization">${link(entry.url, entry.name || '')}</div>
      </div>
      <div class="dates">${escapeHtml(formatDateRange(entry.startDate, entry.endDate))}</div>
    </header>
    ${entry.summary ? `<p class="summary">${escapeHtml(entry.summary)}</p>` : ''}
    ${list(entry.highlights)}
  </article>`

const publicationEntry = (entry) => `
  <article class="entry compact-entry">
    <h3>${link(entry.url, entry.name || '')}</h3>
    <div class="meta">${escapeHtml(entry.publisher || '')}${entry.releaseDate ? ` · ${escapeHtml(formatDate(entry.releaseDate))}` : ''}</div>
    ${entry.summary ? `<p>${escapeHtml(entry.summary)}</p>` : ''}
  </article>`

const projectEntry = (entry) => `
  <article class="entry compact-entry">
    <h3>${link(entry.url, entry.name || '')}</h3>
    ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ''}
  </article>`

const educationEntry = (entry) => `
  <article class="entry compact-entry">
    <h3>${link(entry.url, entry.institution || '')}</h3>
    <div class="meta">${escapeHtml(entry.studyType || '')}${entry.area ? ` · ${escapeHtml(entry.area)}` : ''}</div>
    <div class="dates">${escapeHtml(formatDateRange(entry.startDate, entry.endDate))}</div>
  </article>`

const section = (label, content) => `
  <section class="section">
    <h2>${escapeHtml(label)}</h2>
    <div class="section-content">${content}</div>
  </section>`

const styles = `
  :root {
    --ink: #252525;
    --muted: #77716a;
    --rule: #d8d1c8;
    --link: #245b73;
    --paper: #ffffff;
  }

  @page {
    size: letter;
    margin: 0.62in 0.72in;
  }

  * { box-sizing: border-box; }

  html {
    font-size: 16px;
    background: var(--paper);
  }

  body {
    max-width: 940px;
    margin: 0 auto;
    padding: 4.5rem 3rem 5rem;
    color: var(--ink);
    background: var(--paper);
    font-family: Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif;
    font-size: 1rem;
    line-height: 1.48;
  }

  a {
    color: var(--link);
    text-decoration: none;
    border-bottom: 1px solid color-mix(in srgb, var(--link) 35%, transparent);
  }

  a:hover { border-bottom-color: var(--link); }

  .masthead {
    display: block;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--rule);
  }

  .name {
    margin: 0;
    font-size: clamp(2.7rem, 7vw, 4.7rem);
    font-weight: 400;
    letter-spacing: -0.045em;
    line-height: 0.98;
  }

  .label {
    margin: 0.55rem 0 0;
    color: var(--muted);
    font-size: 1.25rem;
    font-style: italic;
  }

  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1.1rem;
    margin-top: 1rem;
    color: var(--muted);
    font-size: 0.88rem;
    text-align: left;
  }

  .contact-row {
    display: inline-flex;
    gap: 0.3rem;
    align-items: center;
  }

  .contact-icon {
    display: inline-flex;
    line-height: 0;
    color: var(--muted);
  }

  .contact-icon svg {
    display: block;
    width: 1rem;
    height: 1rem;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.7;
    vertical-align: -0.12em;
  }

  .summary {
    max-width: 48rem;
    margin: 1.4rem 0 0;
    font-size: 1.08rem;
  }

  .section {
    display: grid;
    grid-template-columns: 9rem minmax(0, 1fr);
    gap: 2rem;
    padding: 2rem 0;
    border-bottom: 1px solid var(--rule);
  }

  .section:last-child { border-bottom: 0; }

  .section > h2 {
    margin: 0;
    color: var(--muted);
    font-size: 1.05rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .section-content {
    min-width: 0;
  }

  .entry + .entry {
    margin-top: 2rem;
  }

  .entry-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
  }

  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .organization {
    margin-top: 0.18rem;
    font-size: 1.04rem;
  }

  .dates, .meta {
    color: var(--muted);
    font-size: 0.88rem;
    white-space: nowrap;
  }

  .summary {
    margin-top: 0.7rem;
  }

  p {
    margin: 0.55rem 0 0;
  }

  ul {
    margin: 0.7rem 0 0;
    padding-left: 1.15rem;
  }

  li {
    margin: 0.32rem 0;
    padding-left: 0.18rem;
  }

  li::marker {
    color: var(--muted);
  }

  .compact-entry + .compact-entry {
    margin-top: 1.15rem;
  }

  .compact-entry h3 {
    font-size: 1.06rem;
    font-weight: 500;
  }

  @media (max-width: 700px) {
    body { padding: 2rem 1.25rem 3rem; }
    .contact { gap: 0.35rem 0.8rem; }
    .section { grid-template-columns: 1fr; gap: 0.75rem; }
    .entry-header { display: block; }
    .dates { margin-top: 0.25rem; }
  }

  @media print {
    html { font-size: 10.5pt; }
    body { max-width: none; padding: 0; }
    .section { break-inside: auto; }
    .entry { break-inside: auto; }
    .masthead { padding-bottom: 1.25rem; }
    .section { padding: 1.1rem 0; }
    .entry + .entry { margin-top: 1.1rem; }
    a { border-bottom: 0; }
  }
`

export function renderCustomResume(resume) {
  const basics = resume.basics || {}
  const location = basics.location
    ? [basics.location.city, basics.location.region, basics.location.countryCode]
        .filter(Boolean)
        .join(', ')
    : ''
  const contactRow = (iconName, label, value) =>
    `<div class="contact-row" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"><span class="contact-icon">${icon(iconName)}</span><span>${value}</span></div>`
  const contact = [
    location ? contactRow('location', 'Location', escapeHtml(location)) : '',
    basics.email ? contactRow('email', 'Email', link(`mailto:${basics.email}`, basics.email)) : '',
    basics.url ? contactRow('website', 'Website', link(basics.url, basics.url.replace(/^https?:\/\//, ''))) : '',
    ...(basics.profiles || []).map((profile) =>
      contactRow('github', profile.network || 'Profile', link(profile.url, profile.username || profile.url))
    )
  ].filter(Boolean).join('')

  const work = (resume.work || []).map(workEntry).join('')
  const publications = (resume.publications || []).map(publicationEntry).join('')
  const projects = (resume.projects || []).map(projectEntry).join('')
  const education = (resume.education || []).map(educationEntry).join('')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(basics.name || 'Resume')}</title>
    <style>${styles}</style>
  </head>
  <body>
    <header class="masthead">
      <div>
        <h1 class="name">${escapeHtml(basics.name || '')}</h1>
      </div>
      <div class="contact">${contact}</div>
    </header>
    ${work ? section('Work', work) : ''}
    ${publications ? section('Publications', publications) : ''}
    ${projects ? section('Projects', projects) : ''}
    ${education ? section('Education', education) : ''}
  </body>
</html>`
}
