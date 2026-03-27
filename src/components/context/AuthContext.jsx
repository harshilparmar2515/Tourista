import { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";

export const authContext = createContext({
  user: null,
  loading: true,
});

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("AUTH STATE:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <authContext.Provider value={{ user, loading }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContextProvider;