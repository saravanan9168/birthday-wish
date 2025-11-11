const fetch = globalThis.fetch || require('node-fetch')
const OWNER = 'saravanan9168'
const REPO = 'birthday-wish'
const PATH = 'wishes.json'
const BRANCH = 'master'

async function getFileSha(token){
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}`
  const r = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json', Authorization: `token ${token}` } })
  if (r.status === 404) return null
  if (!r.ok) throw new Error('failed-get-file')
  const body = await r.json()
  return body.sha
}

module.exports = async (req, res) => {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.VERCEL_GITHUB_TOKEN
    if (!token) return res.status(400).json({ error: 'no-token', message: 'Set GITHUB_TOKEN in Vercel env' })
    const payload = req.body && req.body.data ? req.body.data : req.body
    if (!payload) return res.status(400).json({ error: 'no-data' })

    const content = Buffer.from(JSON.stringify(payload, null, 2)).toString('base64')
    const sha = await getFileSha(token)
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`
    const body = {
      message: 'Update wishes.json via API',
      content,
      branch: BRANCH
    }
    if (sha) body.sha = sha

    const r = await fetch(url, { method: 'PUT', headers: { Accept: 'application/vnd.github.v3+json', Authorization: `token ${token}` }, body: JSON.stringify(body) })
    if (!r.ok) {
      const txt = await r.text()
      return res.status(r.status).json({ error: 'github', status: r.status, body: txt })
    }
    const resp = await r.json()
    return res.status(200).json({ ok: true, resp })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'server', message: err.message })
  }
}
