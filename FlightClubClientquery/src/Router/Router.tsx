import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'


export function Router() {
  return (
    <Routes>
        <Route path="/main" element={<Home></Home>} />
        <Route path='*' element={<Navigate to="/main"/>}/>
    </Routes>
  )
}
