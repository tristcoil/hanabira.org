"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";

interface UserContextValue {
  loggedIn: boolean;
  userName: string;
  userId: string;
  jwtToken: string;
  loading: boolean;              // <-- NEW: Indicates if we're still checking for cookies/session
  handleLogin: () => void;
  handleLogout: () => void;
}

const UserContext = createContext<UserContextValue>({
  loggedIn: false,
  userName: "",
  userId: "",
  jwtToken: "",
  loading: true,                 // <-- Provide a default "true" for SSR/hydration
  handleLogin: () => {},
  handleLogout: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  //const [userId, setUserId] = useState("");
  const [userId, setUserId] = useState("testUserId");     // TODO: remove later and set to empty, so we see errors
  const [jwtToken, setJwtToken] = useState("");
  const [loading, setLoading] = useState(true); // <-- track if we’re still “verifying” cookies

  // // On client mount, read cookies to see if we have an existing login
  // useEffect(() => {
  //   const storedName = Cookies.get("hanabira_userName");
  //   const storedId = Cookies.get("hanabira_userId");
  //   const storedJwt = Cookies.get("hanabira_jwt");

  //   if (storedName && storedId && storedJwt) {
  //     setLoggedIn(true);
  //     setUserName(storedName);
  //     setUserId(storedId);
  //     setJwtToken(storedJwt);
  //   }

  //   // We have finished checking cookies
  //   setLoading(false);
  // }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      const storedName = Cookies.get("hanabira_userName");
      const storedId = Cookies.get("hanabira_userId");
      const storedJwt = Cookies.get("hanabira_jwt");
  
      if (storedName && storedId && storedJwt) {
        setLoggedIn(true);
        setUserName(storedName);
        setUserId(storedId);
        setJwtToken(storedJwt);
      }
      setLoading(false);
    }, 10); // 2000 milisecond delay
  
    return () => clearTimeout(timer);
  }, []);
  












  const notifyLogin = async (userId: string) => {
    try {
      const response = await fetch(`/f-api/v1/notify-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.message) {
        console.log(data.message);
      } else if (data.error) {
        console.error("Error notifying login:", data.error);
      }
    } catch (error) {
      console.error("Error notifying login:", error);
    }
  };

  const handleLogin = () => {
    // Replace with your real logic, e.g. Google OAuth flow or custom auth
    const name = "testUserName";
    const id = "testUserId";
    const token = "AAA.BBB.CCC";

    // Store in cookies (7-day expiration is just an example)
    Cookies.set("hanabira_userName", name, { expires: 7 });
    Cookies.set("hanabira_userId", id, { expires: 7 });
    Cookies.set("hanabira_jwt", token, { expires: 7 });

    // Update local state
    setLoggedIn(true);
    setUserName(name);
    setUserId(id);
    setJwtToken(token);

    // Optionally notify backend
    notifyLogin(id);
  };

  const handleLogout = () => {
    // Remove cookies
    Cookies.remove("hanabira_userName");
    Cookies.remove("hanabira_userId");
    Cookies.remove("hanabira_jwt");

    // Reset local state
    setLoggedIn(false);
    setUserName("");
    setUserId("");
    setJwtToken("");
  };

  return (
    <UserContext.Provider
      value={{
        loggedIn,
        userName,
        userId,
        jwtToken,
        loading,               // <-- expose loading to consumers
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);












// ------------------------------------------------

// PRODUCTION----------------
// "use client";

// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   ReactNode,
// } from "react";
// import Cookies from "js-cookie";

// interface UserContextValue {
//   loggedIn: boolean;
//   userName: string;
//   userId: string;
//   jwtToken: string;
//   handleLogin: () => void;
//   handleLogout: () => void;
// }

// const UserContext = createContext<UserContextValue>({
//   loggedIn: false,
//   userName: "",
//   userId: "",
//   jwtToken: "",
//   handleLogin: () => {},
//   handleLogout: () => {},
// });

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [userId, setUserId] = useState("");
//   const [jwtToken, setJwtToken] = useState("");

//   // On client mount, read cookies to see if we have an existing login
//   useEffect(() => {
//     const storedName = Cookies.get("hanabira_userName");
//     const storedId = Cookies.get("hanabira_userId");
//     const storedJwt = Cookies.get("hanabira_jwt");

//     if (storedName && storedId && storedJwt) {
//       setLoggedIn(true);
//       setUserName(storedName);
//       setUserId(storedId);
//       setJwtToken(storedJwt);
//     }
//   }, []);

//   const notifyLogin = async (userId: string) => {
//     try {
//       const response = await fetch(`/f-api/v1/notify-login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userId }),
//       });

//       const data = await response.json();
//       if (data.message) {
//         console.log(data.message);
//       } else if (data.error) {
//         console.error("Error notifying login:", data.error);
//       }
//     } catch (error) {
//       console.error("Error notifying login:", error);
//     }
//   };

//   const handleLogin = () => {
//     // Replace with your real logic, e.g. Google OAuth flow or custom auth
//     const name = "testUserName";
//     const id = "testUserId";
//     const token = "AAA.BBB.CCC";

//     // Store in cookies (7-day expiration is just an example)
//     Cookies.set("hanabira_userName", name, { expires: 7 });
//     Cookies.set("hanabira_userId", id, { expires: 7 });
//     Cookies.set("hanabira_jwt", token, { expires: 7 });

//     // Update local state
//     setLoggedIn(true);
//     setUserName(name);
//     setUserId(id);
//     setJwtToken(token);

//     // Optionally notify backend
//     notifyLogin(id);
//   };

//   const handleLogout = () => {
//     // Remove cookies
//     Cookies.remove("hanabira_userName");
//     Cookies.remove("hanabira_userId");
//     Cookies.remove("hanabira_jwt");

//     // Reset local state
//     setLoggedIn(false);
//     setUserName("");
//     setUserId("");
//     setJwtToken("");
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         loggedIn,
//         userName,
//         userId,
//         jwtToken,
//         handleLogin,
//         handleLogout,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);






// -----------------------------------

// "use client";

// import React, {
//   createContext,
//   useState,
//   useContext,
//   ReactNode,
//   useEffect,
// } from "react";
// import Cookies from "js-cookie";

// interface UserContextValue {
//   userName: string | null;
//   setUserName: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const UserContext = createContext<UserContextValue>({
//   userName: null,
//   setUserName: () => {},
// });

// interface UserProviderProps {
//   children: ReactNode;
// }

// export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
//   const [userName, setUserName] = useState<string | null>(null);

//   // Re-hydrate state from cookies on client-side mount
//   useEffect(() => {
//     const cookieUserName = Cookies.get("userName");
//     if (cookieUserName) {
//       setUserName(cookieUserName);
//     }
//   }, []);

//   return (
//     <UserContext.Provider value={{ userName, setUserName }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = (): UserContextValue => useContext(UserContext);
