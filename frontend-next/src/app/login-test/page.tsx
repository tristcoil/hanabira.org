'use client';

import React from "react";
import LoginButton from "@/components/LoginButton";
import UserDisplay from "@/components/UserDisplay";

import { useUser } from "@/context/UserContext";

const HomePage: React.FC = () => {
  // Access user context
  const { userId, loggedIn } = useUser();

  return (
    <>
      <LoginButton />
      <UserDisplay />
      <div className="mt-4 text-center">
        {loggedIn ? (
          <p className="text-lg font-semibold text-green-500">
            User ID: {userId}
          </p>
        ) : (
          <p className="text-lg font-semibold text-red-500">
            No User ID Available
          </p>
        )}
      </div>
    </>
  );
};

export default HomePage;
