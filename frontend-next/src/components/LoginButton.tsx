"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export default function LoginButton() {
  const { loggedIn, handleLogin, handleLogout } = useUser();

  return (
    <div className="flex items-center space-x-2">
      {loggedIn ? (
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-bold text-lg rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-slate-500 text-white font-bold text-lg rounded hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Login
        </button>
      )}
    </div>
  );
}



// ------------------------------------------

// "use client";

// import React from "react";
// import { useUser } from "../context/UserContext";
// import Cookies from "js-cookie";

// const LoginButton: React.FC = () => {
//   const { userName, setUserName } = useUser();

//   const handleLogin = () => {
//     const newName = "NewUser";
//     // Write the cookie
//     Cookies.set("userName", newName, { path: "/" });
//     // Update the React Context
//     setUserName(newName);
//   };

//   const handleLogout = () => {
//     // Remove the cookie
//     Cookies.remove("userName", { path: "/" });
//     // Clear the React Context
//     setUserName(null);
//   };

//   if (userName) {
//     // If a user is logged in, show the Logout button
//     return <button onClick={handleLogout}>Logout</button>;
//   }

//   // Otherwise, show the Login button
//   return <button onClick={handleLogin}>Login</button>;
// };

// export default LoginButton;











// ---------------------------------------------

// "use client";

// import React from "react";
// import { useUser } from "../context/UserContext";
// import Cookies from "js-cookie";

// const LoginButton: React.FC = () => {
//   const { setUserName } = useUser();

//   const handleLogin = () => {
//     const newName = "NewUser";
//     // Write the cookie
//     Cookies.set("userName", newName, { path: "/" });
//     // Update the React Context
//     setUserName(newName);
//   };

//   return <button onClick={handleLogin}>Login</button>;
// };

// export default LoginButton;
