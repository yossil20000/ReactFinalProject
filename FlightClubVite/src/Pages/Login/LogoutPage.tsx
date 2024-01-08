import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks';
import { URLS } from '../../Enums/Urls';
import { logOut } from '../../features/Auth/authSlice';

function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  navigate(URLS.LOGIN);
  dispatch(logOut());
  return (
    
    <div>LogoutPage</div>
  )
}

export default LogoutPage