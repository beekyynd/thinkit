import { useContext, createContext, type PropsWithChildren, useEffect, useState } from "react";
import { useStorageState } from "../hooks/useStorageState";
import { router } from "expo-router";
import axiosInstance from "@/config/axiosConfig";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  credits: number | null;
}

type UpdateUserFn = (userData: User | ((prevUser: User) => User)) => Promise<void>;

interface AuthContextType {
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  session?: string | null;
  user?: User | null;
  isLoading: boolean;
  updateUser: UpdateUserFn;
}

const AuthContext = createContext<AuthContextType>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  user: null,
  isLoading: false,
  updateUser: async () => {},
});

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[, storedUser], setStoredUser] = useStorageState("user");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, [storedUser]);

  useEffect(() => {
    if (session) {
      loadUserInfo(session);
    }
  }, [session]);

  const loadUserInfo = async (token: string) => {
    try {
      const response = await axiosInstance.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser(userData);
      await setStoredUser(JSON.stringify(userData));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSession(null);
        setStoredUser(null);
        router.replace("/sign-in");
      } else {
        console.error("Error loading user info:", error);
      }
    }
  };

  const signIn = async (token: string, userData: User) => {
  try {
    setUser(userData); // update state immediately
    await setStoredUser(JSON.stringify(userData));
    await setSession(token); // store session persistently
  } catch (error) {
    console.error("Sign in failed:", error);
  }
};


  const signOut = async () => {
    try {
      if (session) {
        await axiosInstance.post("/api/logout", null, {
          headers: {
            Authorization: `Bearer ${session}`,
          },
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setSession(null);
      setStoredUser(null);
      setUser(null);
      router.push("/sign-in");
    }
  };

  const updateUser: UpdateUserFn = async (userDataOrUpdater) => {
    try {
      setUser((prev) => {
        const newUser = typeof userDataOrUpdater === 'function'
          ? userDataOrUpdater(prev!)
          : userDataOrUpdater;
        // Save to async storage
        setStoredUser(JSON.stringify(newUser));
        return newUser;
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        isLoading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
