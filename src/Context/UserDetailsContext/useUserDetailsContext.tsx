//Deps
import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

//Interfaces
import { IUserDetailsContext, IUserDetails } from "./interfaces";

//Context
export const UserDetailsContext = createContext<IUserDetailsContext>({
  isAuthenticated: null,
  clearAuthentication: (): void => {},
});

export const useUserDetailsContext = (): IUserDetailsContext => {
  //Nav
  const navigate = useNavigate();

  //State
  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Queries
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['getSelf'],
    queryFn: () =>
      fetch(`/api/self`, {
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
  })

  const clearAuthentication = (): void => {
    setUserDetails(undefined);
    setIsAuthenticated(false);
  }

  return {userDetails, isAuthenticated, clearAuthentication};
}

export default useUserDetailsContext;
