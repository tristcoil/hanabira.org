"use client";

import React from "react";
import { ReactNode } from "react";
import { UserProvider } from "../context/UserContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <UserProvider>{children}</UserProvider>;
}
