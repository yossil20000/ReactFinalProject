import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ReservationPage from '../pages/Reservations/ReservationPage'


export function Router() {
  return (
    <Routes>
        <Route path="/main" element={<Home></Home>} />
        <Route path="reservation" element={<ReservationPage></ReservationPage>}/>
        <Route path='*' element={<Navigate to="/main"/>}/>
    </Routes>
  )
}
