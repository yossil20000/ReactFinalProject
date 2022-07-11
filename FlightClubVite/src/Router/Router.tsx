import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from '../Pages/Home/HomePage'
import LoginPage from '../Pages/Login/LoginPage'
import ProfilePage from '../Pages/Profile/ProfilePage'
import ReservationsPage from '../Pages/Reservations/ReservationsPage'



export function PagesRouter() {
  return (
    <Routes>
        <Route path="/home" element={<HomePage></HomePage>} />
        <Route path="/reservations" element={<ReservationsPage></ReservationsPage>}/>
        <Route path="/login" element={<LoginPage></LoginPage>}/>
        <Route path="/profile" element={<ProfilePage></ProfilePage>}/>
        <Route path='*' element={<Navigate to="/home"/>}/>
    </Routes>
  )
}
