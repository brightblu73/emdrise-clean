import { createContext, ReactNode, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn, apiRequest } from "./queryClient";

interface User {
  id: number;
  username: string;
  email: string;
  subscriptionStatus: string;
  trialEndsAt?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  refetchUser: () => void;
  loginUser: (userData: User) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [manualUser, setManualUser] = useState<User | null>(null);
  
  const { 
    data: fetchedUser, 
    isLoading, 
    refetch: refetchUser 
  } = useQuery({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchInterval: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Use manual user state if available, otherwise use fetched user
  const user = manualUser || (fetchedUser as any)?.user || null;

  const loginUser = (userData: User) => {
    console.log('Manual login user set:', userData.email);
    setManualUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logoutUser = () => {
    console.log('Manual logout user cleared');
    setManualUser(null);
    localStorage.removeItem('authUser');
  };

  // Restore user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser && !manualUser) {
      try {
        const userData = JSON.parse(storedUser);
        setManualUser(userData);
        console.log('Restored user from localStorage:', userData.email);
      } catch (e) {
        localStorage.removeItem('authUser');
      }
    }
  }, [manualUser]);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      refetchUser,
      loginUser,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
