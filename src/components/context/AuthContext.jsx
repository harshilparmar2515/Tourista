import { createContext, useEffect, useMemo, useState } from "react";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

const ADMIN_USERS = ["admin@tourista.com", import.meta.env.VITE_ADMIN_EMAIL].filter(Boolean);

export const authContext = createContext({
  user: null,
  loading: true,
  isAdmin: false,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => {
    if (!user?.email) return false;
    return ADMIN_USERS.includes(user.email.toLowerCase());
  }, [user]);

  return (
    <authContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;