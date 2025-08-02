"use client";

import React, { Children } from "react";

type ButtonDefaultProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  color?: "green" | "blue" | "red" | "transparent" | "gray" | "neutral" | 'yellow';
  textColor?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
};

const colorClasses: Record<string, string> = {
  green: "bg-green-400 hover:bg-green-600",
  blue: "bg-blue-400 hover:bg-blue-600",
  red: "bg-red-400 hover:bg-red-600",
  gray: "bg-gray-400 cursor-not-allowed",
  neutral: "bg-neutral-400 hover:bg-neutral-600",
  transparent: "bg-transparent hover:bg-gray-200",
  yellow: "bg-yellow-400 hover:bg-yellow-600",
};

const ButtonDefault: React.FC<ButtonDefaultProps> = ({
  label = "",
  onClick = undefined,
  className = "",
  color = "blue",
  textColor = "white",
  disabled = false,
  children = null,
  type = "button",
}) => {
  const colorClass = !disabled ? colorClasses[color] : colorClasses.gray;

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      className={`px-4 py-2 rounded-lg text-${textColor} transition cursor-pointer ${colorClass} ${className}`}
      disabled={disabled}
      type={type}
    >
      {label}
      {children}
    </button>
  );
};

export default ButtonDefault;