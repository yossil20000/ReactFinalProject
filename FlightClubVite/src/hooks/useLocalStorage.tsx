import React, { useEffect, useState } from 'react'

type ReturnType<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>
]

function useLocalStorage<T>(key: string, initialValue: T): ReturnType<T> {
  const [state, setState] = useState<T>(() => {
    
    try {
      const value =  sessionStorage.getItem(key);
      console.log(`useLocalStorage/value/${key} `, value)
      if(value){
        const parsed =  JSON.parse(value);
        console.log(`useLocalStorage/parsed/${key} `, parsed)
        return parsed;
      }
      else{
        if (!initialValue) return;
         return initialValue;
      }
    }
    catch (err) {
      return initialValue;
    }
  })
 console.log(`useLocalStorage/state/${key} ` , state)
  useEffect(()=> {
    if(state)
    {
      try{
        sessionStorage.setItem(key,JSON.stringify(state))
      }
      catch(err){
        console.log("useLocalStorage exception: ", err)
      }
    }
    
  },[state,key])

  return [state,setState]
}

export default useLocalStorage
