import { ClassNames } from '@emotion/react';
import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import {useResetMutation} from '../../features/Auth/authApiSlice'
import {IReset,IResetResult} from '../../Interfaces/API/ILogin';
import { ROUTES } from '../../Types/Urls';

export default function ResetPage() {
  const navigate = useNavigate();
  const {register,handleSubmit} = useForm();
  const [reset,result]= useResetMutation();
  const [isReset,setIsReset] = useState(false)
  let resetProps : IReset = {
    email:  ""
  }
  const submitForm = async (data: any) => {
    console.log("submitForm/data", data);
  
    console.log("submitForm/reset/data", data.email);
   resetProps.email = data
    console.log("submitForm/reset", resetProps);
    try{
      const paload = await reset(resetProps).unwrap();
      
      
      if(paload.success){
        console.log("Unwrap", paload.data.newPassword);
        console.log("resetProps" , resetProps.email)
        setIsReset(true);
      }
    }
    catch(err)
    {
      console.log("submitForm/reset: err", err);
    }
    console.log("ResetPageResult" , result)
  }
  const renderReset = () => {
    if(!isReset){
      return (
        <form onSubmit={handleSubmit(submitForm)}>

        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input type='email' className='form-input' {...register('email')} required/>
        </div>
        
        <button type='submit' className='button'>Reset</button>
        </form>
      )
    }
    else {
      navigate(`/${ROUTES.CHANGE_PASSWORD}`)
      return (
        <div>
          Yor Reset Password sent to email:{resetProps.email}
        </div>
      )
    }
  }
  return (
    <div className='main'>
    <div>ResetPage</div>
        {renderReset()}
    </div>
  )
}
