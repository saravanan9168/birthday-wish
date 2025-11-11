import React, { useEffect, useState } from 'react'
import WishCard from '../components/WishCard'
import { Link, useNavigate } from 'react-router-dom'

function loadWishes(){
  try{
    const raw = localStorage.getItem('wishes')
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error(e)
    return []
  }
}

export default function Home(){
  const [wishes, setWishes] = useState([])
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(()=>{
    setWishes(loadWishes())
  },[])

  const filtered = wishes.filter(w=>
    w.name?.toLowerCase().includes(q.toLowerCase()) ||
    w.message?.toLowerCase().includes(q.toLowerCase())
  )

  const showRandom = ()=>{
    if(wishes.length===0) return
    const r = wishes[Math.floor(Math.random()*wishes.length)]
    navigate(`/wish/${r.id}`)
  }

  return (
    <div className="container">
      <section className="hero">
        <h1>Send a warm birthday wish 🎉</h1>
        <p className="lead">Browse wishes or create your own from the Admin page.</p>
        <div className="hero-actions">
          <input className="search" placeholder="Search name or message..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" onClick={showRandom}>Surprise me</button>
        </div>
      </section>

      <section className="wish-list">
        {filtered.length===0 && <div className="empty">No wishes yet. Go to Admin to add some.</div>}
        <div className="grid">
          {filtered.map(w=> (
            <Link to={`/wish/${w.id}`} key={w.id} style={{textDecoration:'none'}}>
              <WishCard wish={w} />
            </Link>
          ))}
        </div>
      </section>

      {/* per-wish view is now a separate page at /wish/:id */}
    </div>
  )
}
