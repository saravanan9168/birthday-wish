import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'

export default function Login(){
  const [pwd, setPwd] = useState('')
  const navigate = useNavigate()

  const handle = (e)=>{
    e.preventDefault()
    if(login(pwd)){
      navigate('/admin')
    }else{
      alert('Wrong password')
    }
  }

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={handle} className="admin-form">
        <input type="password" placeholder="Enter admin password (first time sets it)" value={pwd} onChange={e=>setPwd(e.target.value)} />
        <div style={{marginTop:10}}>
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
  )
}
