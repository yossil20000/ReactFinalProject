import { ClassNames } from '@emotion/react';
import React from 'react'
import {useForm} from 'react-hook-form'
import {useResetMutation} from '../../features/Auth/authSlice'
import {IReset} from '../../Interfaces/API/ILogin';
export default function ResetPage() {
  const {register,handleSubmit} = useForm();
  const [reset,result]= useResetMutation();

  const submitForm = async (data: any) => {
    console.log("submitForm/data", data);
  
    
    const resetProps : IReset = {
      email:  data.email
    }
    console.log("submitForm/reset", resetProps);
    try{
      const paload = await reset(resetProps).unwrap();
      console.log("Unwrap", paload);
    }
    catch(err)
    {
      console.log("submitForm/reset: err", err);
    }
    console.log("ResetPageResult" , result)
  }
  return (
    <div className='main'>
    <div>ResetPage</div>
    <form onSubmit={handleSubmit(submitForm)}>


    <div className='form-group'>
      <label htmlFor='email'>Email</label>
      <input type='email' className='form-input' {...register('email')} required/>
    </div>
    
    <button type='submit' className='button'>Reset</button>
    </form>
    </div>
  )
}
