
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../Components/Layout'
import RequireAuth from '../Components/RequireAuth'
import { Role } from '../Interfaces/API/IMember'
import AccountPage from '../Pages/Account/AccountPage'
import AdminPage from '../Pages/Administrator/AdminPage'
import FlightPage from '../Pages/Flight/FllightPage'
import GalleryPage from '../Pages/Gallery/GalleryPage'
import HomePage from '../Pages/Home/HomePage'
import ChangePassword from '../Pages/Login/ChangePassword'
import LoginPage from '../Pages/Login/LoginPage'
import LogoutPage from '../Pages/Login/LogoutPage'
import ResetPage from '../Pages/Login/ResetPage'
import MembersTablePage from '../Pages/Members/MembersTablePage'
import ProfilePage from '../Pages/Profile/ProfilePage'
import ReservationsPage from '../Pages/Reservations/ReservationsPage'
import ReservationsPageOld from '../Pages/Reservations/ReservationsPageOld'
import RegistrationPage from '../Pages/Resistration/RegistrationPage'
import NotificationPage from '../Pages/UserAccount/Notification'
import MyAccount from '../Pages/UserAccount/UserAccount'
import CalnanderViewDay from '../Components/Calander/CalnanderViewDay'
import AccountReport from '../Pages/Report/AccountReport.jsx'
import Invoice from '../Pages/Report/InvoiceReport'
import InvoicePage from '../Pages/Report/InvoicePage'


export function PagesRouter() {
/*   const dispatch = useAppDispatch();
  useEffect(() => {
      let login_info = getFromLocalStorage<ILoginResult>(LOCAL_STORAGE.LOGIN_INFO);
      if (login_info === "") {
          login_info = {
              "access_token": "",
              "exp": 0,
              "iat": "",
              "expDate": "",
              "message": "",
              "member": {
                  _id: "",
                  member_id: "",
                  family_name: "guset",
                  first_name: "user",
                  roles: [Role.guest],
                  email: ""
              }
          }
      }
      dispatch(setCredentials(login_info as ILoginResult));
  }, []) */
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
      <Route path="/calander" element={<CalnanderViewDay title='Yossi'/>} />
      <Route path="/report" element={<AccountReport/>} />
      <Route path='/invoice' element={<InvoicePage/>}/>
        <Route element={<RequireAuth roles={[Role.guest, Role.user, Role.desk, Role.admin, Role.account]} />}>
          <Route path="/home" element={<HomePage></HomePage>} />
        </Route>
        <Route element={<RequireAuth roles={[Role.admin]} />}>
          <Route path="/admin" element={<AdminPage></AdminPage>} />
          
        </Route>
        <Route element={<RequireAuth roles={[Role.user, Role.desk, Role.admin, Role.account]} />}>
          
          <Route path="/account" element={<AccountPage></AccountPage>}/>
        </Route>
        <Route element={<RequireAuth roles={[Role.user, Role.desk, Role.admin, Role.account]} />}>
        <Route path="/reservationsOld" element={<ReservationsPage></ReservationsPage>} />
          <Route path="/reservations" element={<ReservationsPageOld></ReservationsPageOld>} />
          <Route path='gallery' element={<GalleryPage></GalleryPage>}/>
          <Route path="/logout" element={<LogoutPage></LogoutPage>} />

          <Route path='change_password' element={<ChangePassword></ChangePassword>} />
          <Route path='registration' element={<RegistrationPage></RegistrationPage>} />
          <Route path="/profile" element={<ProfilePage></ProfilePage>} />
          <Route path='/members' element={<MembersTablePage></MembersTablePage>} />
          <Route path='/flights' element={<FlightPage></FlightPage>} />
          <Route path='/myaccount' element={<MyAccount></MyAccount>} />
          <Route path='/notification' element={<NotificationPage></NotificationPage>} />
          

          
        </Route>
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/reset" element={<ResetPage></ResetPage>} />
        <Route path='*' element={<Navigate to="/home" />} />
      </Route>
    </Routes>
  )
}
