
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
import RegistrationPage from '../Pages/Resistration/RegistrationPage'
import NotificationPage from '../Pages/UserAccount/Notification'
import MyAccount from '../Pages/UserAccount/UserAccount'
import AccountReport from '../Pages/Report/AccountReport.jsx'
import InvoicePage from '../Pages/Report/InvoicePage'
import { IInvoiceTableData, IInvoiceTableHeader, InvoiceProps } from '../Interfaces/IReport'
import ExportExelTable from '../Components/Report/Exel/ExportExelTable'
import WOBPage from '../Pages/Aircraft/WABPage'
import { useState } from 'react'
import '../Types/date.extensions'
import LinksPage from '../Pages/Links'
import Signup from '../Pages/testValidation'
import { useAppSelector } from '../app/hooks'

export function PagesRouter() {
  const login = useAppSelector((state) => state.authSlice);
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
  const header: IInvoiceTableHeader = {
    header: [
      { title: "Date", toolTip: "Issue Date" },
      { title: "Description", toolTip: "Description" },
      { title: "Quantity", toolTip: "How many units" },
      { title: "Unit Price", toolTip: "Price per units" },
      { title: "Total", toolTip: "Total in shekel" }
    ]
  }
  const data: IInvoiceTableData = {
    rows: [
      { row: [{ data: "d1", toolTip: "tT1" }, { data: "d1", toolTip: "tT1" }] },
      { row: [{ data: "d1", toolTip: "tT1" }, { data: "d1", toolTip: "tT1" }] }
    ],
    total: 0
  }
  const invoiceProps: InvoiceProps = {
    invoiceItems: data,
    invoiceHeader: header,
    invoiceDetailes: {
      member: {
        member_id: "123456",
        family_name: "Yosef",
        first_name: 'levy'
      },
      invoiceNo: "123456",
      date: (new Date()).toLocaleDateString(),
      mainTitle: "Invoice"
    }
  }
  const [date,setDate] = useState<Date>()
  console.log("CalanderViewMonth/setDate",date)

  return (
    
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path="/TestValidation" element={<Signup />}/>
        <Route path="/WAB" element={<WOBPage />} />
        <Route path="/home" element={<HomePage></HomePage>} />
        <Route path="/links" element={<LinksPage/>}/>
        {/* <Route path="/calander" element={<CalanderViewMonth value={date} onChange={setDate}/>} /> */}
        <Route path="/exel" element={<ExportExelTable file={'./test'} sheet={'flight'} title={'Flight Table'} header={["Date", "Flight", "From", "To description"]} body={[["b1", "b2", "b3", "b4"], ["c1", "c2", "c3", "b5"], ["b1", "b2", "b3", "b4"], ["c1", "c2", "c3", "b5"]]} save={false} />} />
        <Route path="/report" element={<AccountReport />} />
        <Route path='/invoice' element={<InvoicePage invoiceItems={invoiceProps.invoiceItems} invoiceDetailes={invoiceProps.invoiceDetailes} invoiceHeader={invoiceProps.invoiceHeader} />} />

        <Route element={<RequireAuth roles={[Role.admin]} />}>
          <Route path="/admin" element={<AdminPage></AdminPage>} />

        </Route>
        <Route element={<RequireAuth roles={[Role.desk, Role.admin, Role.account]} />}>

          <Route path="/account" element={<AccountPage></AccountPage>} />
        </Route>
        <Route element={<RequireAuth roles={[Role.user, Role.desk, Role.admin, Role.account]} />}>
          {/* <Route path="/reservationsOld" element={<ReservationsPageOld></ReservationsPageOld>} /> */}
          <Route path="/reservations" element={<ReservationsPage></ReservationsPage>} />
          <Route path='gallery' element={<GalleryPage></GalleryPage>} />
          <Route path="/logout" element={<LogoutPage></LogoutPage>} />

          <Route path='change_password' element={<ChangePassword></ChangePassword>} />
          <Route path='/registration' element={<RegistrationPage></RegistrationPage>} />
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
