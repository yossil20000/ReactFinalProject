import {TypedUseSelectorHook, useDispatch,useSelector} from 'react-redux'
//import {RootState , AppDispatch} from './store'
import {RootState , AppDispatch} from './userStor'
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


