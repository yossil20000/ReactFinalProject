import { ClassNames } from '@emotion/react';
import React from 'react'
import {useForm} from 'react-hook-form'
import {useLoginMutation} from '../../features/Auth/authApiSlice'
import ILogin from '../../Interfaces/API/ILogin';
import {setCredentials,selectCurrentUser,selectCurrentId} from "../../features/Auth/authSlice"
import {useAppDispatch,useAppSelector} from '../../app/hooks'

export default function LoginPage() {
  const {register,handleSubmit} = useForm();
  const [loging,result]= useLoginMutation();
  const dispatch = useAppDispatch();
  const select = useAppSelector;
  const id = useAppSelector((state) => state.authSlice.member._id);
  console.log("id", id)
  console.log("id", selectCurrentId)
  const submitForm = async (data: any) => {
    console.log("submitForm/data", data);
    
    
    const loginProps : ILogin = {
      password: data.password,
      email:  data.email
    }
    console.log("submitForm/login", loginProps);
    try{
      const payload = await loging(loginProps).unwrap();
      dispatch(setCredentials(payload.data));
      
      console.log("Unwrap", payload.data);
      
    }
    catch(err)
    {
      console.log("submitForm/login: err", err);
    }
    console.log("LogingPageResult" , result)
  }
  return (
    <div className='main'>
    <div>LoginPage</div>
    <form onSubmit={handleSubmit(submitForm)}>


    <div className='form-group'>
      <label htmlFor='email'>Email</label>
      <input type='email' className='form-input' {...register('email')} required/>
    </div>
    <div className='form-group'>
      <label htmlFor='password'>Password</label>
      <input type='password' className='form-input' {...register('password')} required/>
    </div>
    
    <button type='submit' className='button'>Login </button>
    <div></div>
    </form>
    </div>
  )
}
