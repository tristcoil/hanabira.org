'use client';

import { ReactNode } from "react";

// Define the props for the Tab component
interface TabProps {
  label: string;
  children: ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, children }) => {
  return <div>{children}</div>;
};

export default Tab;