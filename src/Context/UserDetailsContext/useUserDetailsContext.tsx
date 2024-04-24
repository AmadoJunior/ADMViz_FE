//Deps
import { createContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

//Interfaces
import { IUserDetailsContext, IUserDetails } from "./interfaces";

//Context
export const UserDetailsContext = createContext<IUserDetailsContext>({
  isLoading: false,
  isAuthenticated: false,
  clearAuthentication: (): void => {},
});

export const useUserDetailsContext = (): IUserDetailsContext => {
  const queryClient = useQueryClient();

  // Queries
  const { isLoading, isSuccess, data } = useQuery({
    queryKey: ["getSelf"],
    queryFn: (): Promise<IUserDetails> => {
      return fetch(`/api/self`, {
        method: "GET",
      })
        .then((res) => {
          if (res.status !== 200)
            throw new Error("Could Not Get User Details RES");
          return res.json();
        })
        .then((data) => {
          if (!data) throw new Error("Could Not Get User Details JSON");
          return data;
        });
    },
    retry: 2,
    enabled: true,
  });

  const clearAuthentication = (): void => {
    queryClient.resetQueries({
      queryKey: ["getSelf"],
    });
    queryClient.cancelQueries({
      queryKey: ["getSelf"],
    });
  };

  return {
    userDetails: data,
    isAuthenticated: isSuccess,
    isLoading,
    clearAuthentication,
  };
};

export default useUserDetailsContext;
