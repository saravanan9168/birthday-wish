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

export default function WishDetail(){
  const { id } = useParams()
  const [wish, setWish] = useState(null)
  const [floating, setFloating] = useState([])

  useEffect(()=>{
    const w = loadWishes().find(x=>x.id===id)
    setWish(w || null)
    if(w){
      // create some floating emojis
      const base = emojiForName(w.name)
      const arr = Array.from({length:12}).map((_,i)=>({
        e: EMOJIS[(i*7) % EMOJIS.length],
        left: Math.random()*80 + 5,
        delay: Math.random()*2
      }))
      setFloating(arr)
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

  return (
    <div className="container wish-detail">
      <div className="detail-card">
        <div className="emoji-large">{bigEmoji}</div>
        <h1 className="detail-name">Happy Birthday, {wish.name}!</h1>
        <p className="detail-msg">{wish.message}</p>
        {wish.date && <div className="detail-date">{wish.date}</div>}

        <div className="detail-actions">
          <button className="btn" onClick={copyLink}>Copy link</button>
          <Link to="/" className="btn ghost">Back</Link>
        </div>
      </div>

      <div className="floating-area" aria-hidden>
        {floating.map((f, i)=> (
          <span key={i} className="float-emoji" style={{left:`${f.left}%`, animationDelay:`${f.delay}s`}}>{f.e}</span>
        ))}
      </div>
    </div>
  )
}
