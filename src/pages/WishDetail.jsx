import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

function loadWishes(){
  try{ const raw = localStorage.getItem('wishes'); return raw?JSON.parse(raw):[] }catch(e){return[]}
}

const EMOJIS = ['🎉','🎂','🥳','🎈','💖','✨','🌟','🍰','🕯️','🎁','🍾','🎊','😘']

function emojiForName(name){
  if(!name) return '🎉'
  let h=0; for(let i=0;i<name.length;i++) h = (h<<5)-h + name.charCodeAt(i)
  return EMOJIS[Math.abs(h) % EMOJIS.length]
}

function unsplashFor(query, seed){
  const q = encodeURIComponent(query)
  const s = seed ? `&sig=${encodeURIComponent(seed)}` : ''
  return `https://source.unsplash.com/1200x800/?${q}${s}`
}

export default function WishDetail(){
  const { id } = useParams()
  const [wish, setWish] = useState(null)
  const [floating, setFloating] = useState([])
  const [confetti, setConfetti] = useState([])

  useEffect(()=>{
    const w = loadWishes().find(x=>x.id===id)
    setWish(w || null)
    if(w){
      // floating emojis
      const arr = Array.from({length:12}).map((_,i)=>({
        e: EMOJIS[(i*7) % EMOJIS.length],
        left: Math.random()*80 + 5,
        delay: Math.random()*2
      }))
      setFloating(arr)

      // confetti pieces
      const pieces = Array.from({length:40}).map((_,i)=>({
        left: Math.random()*100,
        bg: ['#ff6b6b','#ffd93d','#6ee7b7','#6ea0ff','#ff7ab6'][i%5],
        rot: Math.random()*360,
        delay: Math.random()*2
      }))
      setConfetti(pieces)
    }
  },[id])

  const copyLink = async ()=>{
    try{ await navigator.clipboard.writeText(location.href); alert('Link copied') }catch(e){ alert('Copy failed') }
  }

  if(!wish) return (
    <div className="container">
      <h2>Wish not found</h2>
      <p>There is no wish with that id. Go back to <Link to="/">home</Link>.</p>
    </div>
  )

  const bigEmoji = emojiForName(wish.name)
  const nameSeed = wish.name ? wish.name.replace(/\s+/g,'-') : id
  const heroImg = unsplashFor(`birthday,party,${wish.name||'celebration'}`, id)
  const galleryQueries = ['birthday cake','balloons','party decorations']

  return (
    <div className="container wish-detail">
      <div className="hero" style={{backgroundImage:`linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.28)), url(${heroImg})`}}>
        <div className="hero-inner">
          <div className="emoji-large">{bigEmoji}</div>
          <h1 className="detail-name">Happy Birthday, {wish.name}!</h1>
          <p className="detail-msg">{wish.message}</p>
          <div className="detail-actions">
            <button className="btn" onClick={copyLink}>Copy link</button>
            <Link to="/" className="btn ghost">Back</Link>
          </div>
        </div>
      </div>

      <section className="gallery">
        <h3>Memories & images</h3>
        <div className="thumbs">
          {galleryQueries.map((q,i)=>{
            const url = unsplashFor(`${q},${wish.name||'birthday'}`, `${id}-${i}`)
            return (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="thumb">
                <img src={url} alt={q} />
              </a>
            )
          })}
          {/* if wish has an image URL, show it too */}
          {wish.image && <a className="thumb" href={wish.image} target="_blank" rel="noreferrer"><img src={wish.image} alt={wish.name} /></a>}
        </div>
      </section>

      <div className="floating-area" aria-hidden>
        {floating.map((f, i)=> (
          <span key={i} className="float-emoji" style={{left:`${f.left}%`, animationDelay:`${f.delay}s`}}>{f.e}</span>
        ))}
        {confetti.map((c, i)=> (
          <span key={`c${i}`} className="confetti" style={{left:`${c.left}%`, background:c.bg, transform:`rotate(${c.rot}deg)`, animationDelay:`${c.delay}s`}} />
        ))}
      </div>
    </div>
  )
}
