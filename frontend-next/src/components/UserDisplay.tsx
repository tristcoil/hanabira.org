"use client";

import React from "react";
import { useUser } from "@/context/UserContext";

export default function UserDisplay() {
  const { loggedIn, userName, userId } = useUser();

  if (!loggedIn) {
    return (
      <div className="text-center">
        <p className="text-sm font-bold text-red-500 dark:text-red-400 space-y-4 mt-4 mb-2">
          You are not logged in.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center ">
      <p className="text-lg font-bold text-primary dark:text-white mb-2 space-y-4 mt-4">
        Welcome, {userName}!
      </p>
      <p className="text-xs font-bold text-primary dark:text-white mb-2">
        userName: {userName}
      </p>
      <p className="text-xs font-bold text-primary dark:text-white mb-2">
        userId: {userId}
      </p>
    </div>
  );
}









// -----------------------------------------------------

// "use client";

// import React from "react";
// import { useUser } from "../context/UserContext";

// export default function UserDisplay() {
//   const { userName, userId } = useUser();

//   return (
//     <div className="text-center">
//       <p className="text-lg font-bold text-primary dark:text-white mb-2">
//         Welcome, {userName}!
//       </p>
//       <p className="text-xs font-bold text-primary dark:text-white mb-2">
//         userName: {userName}
//       </p>
//       <p className="text-xs font-bold text-primary dark:text-white mb-2">
//         userId: {userId}
//       </p>
//     </div>
//   );
// }


// ---------------------------------------------













// "use client";

// import React from "react";
// import { useUser } from "../context/UserContext";

// const UserDisplay: React.FC = () => {
//   const { userName } = useUser();
//   return <div>User: {userName ?? "No one logged in yet"}</div>;
// };

// export default UserDisplay;
