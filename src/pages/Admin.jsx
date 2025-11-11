import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { isLoggedIn, logout } from '../utils/auth'

function loadWishes(){
  try{ const raw = localStorage.getItem('wishes'); return raw?JSON.parse(raw):[] }catch(e){return[]}
}
function saveWishes(w){ localStorage.setItem('wishes', JSON.stringify(w)) }

export default function Admin(){
  const [wishes, setWishes] = useState([])
  const [form, setForm] = useState({name:'', message:'', image:'', date:''})
  const [editingId, setEditingId] = useState(null)

  useEffect(()=>{ setWishes(loadWishes()) },[])

  if(!isLoggedIn()){
    return <Navigate to="/login" replace />
  }

  const resetForm = ()=> setForm({name:'', message:'', image:'', date:''})

  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!form.name || !form.message) return alert('Name and message are required')

    if(editingId){
      const updated = wishes.map(w=> w.id===editingId ? {...w, ...form} : w)
      setWishes(updated); saveWishes(updated); setEditingId(null); resetForm()
    }else{
      const item = { id: Date.now().toString(), ...form }
      const next = [item, ...wishes]
      setWishes(next); saveWishes(next); resetForm()
    }
  }

  const remove = (id)=>{
    if(!confirm('Delete this wish?')) return
    const next = wishes.filter(w=>w.id!==id)
    setWishes(next); saveWishes(next)
  }

  const edit = (w)=>{ setEditingId(w.id); setForm({name:w.name, message:w.message, image:w.image||'', date:w.date||''}) }

  return (
    <div className="container admin">
      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button className="btn ghost" onClick={()=>{logout(); window.location.href='/login'}}>Logout</button>
      </div>
      <h2>Admin — manage wishes</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="row">
          <input placeholder="Name (required)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input placeholder="Image URL (optional)" value={form.image} onChange={e=>setForm({...form, image:e.target.value})} />
        </div>
        <textarea placeholder="Message (required)" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
        <div className="row">
          <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
          <button className="btn" type="submit">{editingId? 'Save':'Add Wish'}</button>
          {editingId && <button type="button" className="btn ghost" onClick={()=>{setEditingId(null); resetForm()}}>Cancel</button>}
        </div>
      </form>

      <section className="existing">
        <h3>Existing wishes ({wishes.length})</h3>
        {wishes.length===0 && <p className="muted">No wishes yet.</p>}
        <ul className="wish-table">
          {wishes.map(w=> (
            <li key={w.id}>
              <div className="meta">
                <div>
                  <strong>{w.name}</strong>
                  <div className="muted small">{w.date || '—'}</div>
                </div>
                <div className="controls">
                  <Link to={`/wish/${w.id}`} className="btn ghost">View</Link>
                  <button className="btn ghost" onClick={()=>edit(w)}>Edit</button>
                  <button className="btn danger" onClick={()=>remove(w.id)}>Delete</button>
                </div>
              </div>
              <div className="message">{w.message}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
