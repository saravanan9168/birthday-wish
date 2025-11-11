import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'
import WishDetail from './pages/WishDetail'
import Login from './pages/Login'

export default function App(){
  return (
    <div className="app-root">
      <header className="site-header">
        <div className="brand">
          <Link to="/" className="brand-link"><span className="logo">🎂</span> Birthday Wishes</Link>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/admin" className="admin-link">Admin</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/admin" element={<Admin/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/wish/:id" element={<WishDetail/>} />
        </Routes>
      </main>

      <footer className="site-footer">Made with ❤️ — Try the Admin page to add wishes</footer>
    </div>
  )
}
