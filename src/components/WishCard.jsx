import React from 'react'

export default function WishCard({wish, large}){
  const style = wish.image ? {backgroundImage:`linear-gradient(120deg, rgba(255,255,255,0.06), rgba(0,0,0,0.06)), url(${wish.image})`, backgroundSize:'cover'} : {}
  return (
    <article className={`wish-card ${large? 'large':''}`} style={style}>
      <div className="card-inner">
        <div className="avatar">{wish.image ? <img src={wish.image} alt={wish.name}/> : <div className="initials">{(wish.name||'').slice(0,2).toUpperCase()}</div>}</div>
        <div className="content">
          <h4 className="name">{wish.name}</h4>
          <p className="msg">{wish.message}</p>
          {wish.date && <div className="date">{wish.date}</div>}
        </div>
      </div>
    </article>
  )
}
