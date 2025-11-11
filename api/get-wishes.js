const fetch = globalThis.fetch || require('node-fetch')
const OWNER = 'saravanan9168'
const REPO = 'birthday-wish'
const PATH = 'wishes.json'
const BRANCH = 'master'

module.exports = async (req, res) => {
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`
    const r = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } })
    if (r.status === 404) return res.status(404).json({ error: 'no-file' })
    if (!r.ok) return res.status(r.status).json({ error: 'github', status: r.status })
    const body = await r.json()
    const content = Buffer.from(body.content, 'base64').toString('utf8')
    const data = JSON.parse(content || '[]')
    return res.status(200).json({ data })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server', message: err.message })
  }
}
