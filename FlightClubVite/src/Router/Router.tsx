import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { URLS } from '../Enums/Routers'
import HomePage from '../Pages/Home/HomePage'
import ChangePassword from '../Pages/Login/ChangePassword'
import LoginPage from '../Pages/Login/LoginPage'
import LogoutPage from '../Pages/Login/LogoutPage'
import ResetPage from '../Pages/Login/ResetPage'
import MembersPage from '../Pages/Members/MembersPage'
import MembersTablePage from '../Pages/Members/MembersTablePage'
import ProfilePage from '../Pages/Profile/ProfilePage'
import ReservationsPage from '../Pages/Reservations/ReservationsPage'
import RegistrationPage from '../Pages/Resistration/RegistrationPage'
import { ROUTES } from '../Types/Urls'



export function PagesRouter() {
  return (
    <Routes>
        <Route path="/home" element={<HomePage></HomePage>} />
        <Route path="/reservations" element={<ReservationsPage></ReservationsPage>}/>
        <Route path="/login" element={<LoginPage></LoginPage>}/>
        <Route path="/logout" element={<LogoutPage></LogoutPage>}/>
        <Route path="/reset" element={<ResetPage></ResetPage>}/>
        <Route path='change_password' element={<ChangePassword></ChangePassword>}/>
        <Route path='registration' element={<RegistrationPage></RegistrationPage>}/>
        <Route path="/profile" element={<ProfilePage></ProfilePage>}/>
        <Route path='/members' element={<MembersTablePage></MembersTablePage>}/>
        <Route path='*' element={<Navigate to="/home"/>}/>
    </Routes>
  )
}
