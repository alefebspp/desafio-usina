import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { User } from "@/types";
import { getProfile } from "@/services/auth";

export interface UserContextProps {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  logout(): void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User>();

  const { data } = useQuery({
    queryFn: getProfile,
    queryKey: ["profile"],
    enabled: !user,
    refetchOnWindowFocus: false,
  });

  function logout() {
    setUser(undefined);
  }

  useEffect(() => {
    if (data?.user) {
      setUser(data.user);
    }
  }, [data]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext(): UserContextProps {
  const context = useContext(UserContext) as UserContextProps;

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
}

export default UserContext;
