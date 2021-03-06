import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import Login from '../pages/Loggin/Login'
import Profile from '../pages/Profile/Profile'
import ReservationPage from '../pages/Reservations/ReservationPage'


export function Router() {
  return (
    <Routes>
      
        <Route path="/home" element={<Home></Home>} />
        <Route path="/reservation" element={<ReservationPage></ReservationPage>}/>
        <Route path="/login" element={<Login></Login>}/>
        <Route path="/profile" element={<Profile></Profile>}/>
        <Route path='*' element={<Navigate to="/home"/>}/>
    </Routes>
  )
}
