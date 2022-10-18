import { useAppSelector } from "../../app/hooks";



const useAuth = () => {
  const login = useAppSelector((state) => state.authSlice);
}