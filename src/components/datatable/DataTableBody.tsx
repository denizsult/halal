import React from "react";

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] ${className}`}
    >
      {children}
    </div>
  );
};
