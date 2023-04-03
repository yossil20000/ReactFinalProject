import React, { useEffect, useState } from 'react'

type ReturnType<T> = [
  T,
  React.Dispatch<React.SetStateAction<T>>
]

function useLocalStorage<T>(key: string, initialValue: T): ReturnType<T> {
  const [state, setState] = useState<T>(() => {

    try {
      const value = sessionStorage.getItem(key);
      CustomLogger.info(`useLocalStorage/value/${key} `, value)
      if (value) {
        const parsed = JSON.parse(value);
        CustomLogger.info(`useLocalStorage/parsed/${key} `, parsed)
        return parsed;
      }
      else {
        if (!initialValue) return;
        return initialValue;
      }
    }
    catch (err) {
      CustomLogger.error("useLocalStorage exception: ", err)
      return initialValue;
    }
  })
  CustomLogger.log(`useLocalStorage/state/${key} `, state)
  useEffect(() => {

    {
      try {
        sessionStorage.setItem(key, JSON.stringify(state))
      }
      catch (err) {
        CustomLogger.error("useLocalStorage exception: ", err)
      }
    }

  }, [state, key])

  return [state, setState]
}

export default useLocalStorage
