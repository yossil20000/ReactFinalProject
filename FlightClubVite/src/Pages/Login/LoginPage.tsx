import { ClassNames } from '@emotion/react';
import React from 'react'
import {useForm} from 'react-hook-form'
import {useLoginMutation,LogingProp} from '../../features/Users/userSlice'
export default function LoginPage() {
  const {register,handleSubmit} = useForm();
  const [loging,result]= useLoginMutation();

  const submitForm = async (data: any) => {
    console.log("submitForm/data", data);
  
    
    const logingProps : LogingProp = {
      password: data.password,
      email:  data.email
    }
    console.log("submitForm/login", logingProps);
    try{
      const paload = await loging(logingProps).unwrap();
      console.log("Unwrap", paload);
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
    
    <button type='submit' className='button'>Login</button>
    </form>
    </div>
  )
}
