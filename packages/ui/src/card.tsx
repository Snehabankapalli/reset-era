import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.03] p-5 ${className}`}>
      {children}
    </div>
  );
}
