
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App.jsx'
import Admin from './Admin.jsx'

function Layout(){
  return (
    <>
      <nav style={{padding:12, borderBottom:'1px solid #ddd'}}>
        <Link to="/">Store</Link> | <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Layout />
  </BrowserRouter>
)
