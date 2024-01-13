//Deps
import {createContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

//Interfaces
import { IUserDetailsContext, IAuthority, IUserDetails } from "./interfaces";

//Context
export const UserDetailsContext = createContext<IUserDetailsContext>({
  isAuthenticated: null,
  handleIsAuthenticated: (): Promise<void> => { 
    return new Promise((resolve, reject) => reject())
  },
  clearAuthentication: (): void => {},
});

export const useUserDetailsContext = (): IUserDetailsContext => {
  //Nav
  const navigate = useNavigate();

  //State
  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  //Methods
  const handleIsAuthenticated = (): Promise<any> => {
      //Fetch User Details
      return fetch(`${import.meta.env.NODE_ENV === "production" ? "https://" : "http://"}${import.meta.env.VITE_API_ENDPOINT}/api/self`, {
        method: "GET"
      })
      .then(res => {
        if(res.status !== 200) throw new Error("Could Not Get User Details RES");
        return res.json();
      })
      .then(data => {
        if(!data) throw new Error("Could Not Get User Details JSON");
        setUserDetails(data);
        //Set Is Auth
        setIsAuthenticated(true);
        navigate("/");
      })
      .catch(e => {
        console.error(e);
        //Set State
        clearAuthentication();
      })
  }

  const clearAuthentication = (): void => {
    setUserDetails(undefined);
    setIsAuthenticated(false);
  }

  useEffect(() => {
    try{
      handleIsAuthenticated();
    } catch(e) {
      console.error(e);
    }
  }, [])

  return {userDetails, isAuthenticated, handleIsAuthenticated, clearAuthentication};
}

export default useUserDetailsContext;
