import React from "react";
const configs = {
  default: {
    hover: "hover:text-yellow-500 hover:font-semibold hover:border-yellow-200 hover:bg-yellow-100",
  }
};
export default function Button({
  className,
  onClick,
  children,
}) {
  const selectedState = "default";
  const selectedHover = configs[selectedState].hover;
  return (
    <button
      className={`
        text-sm h-10 border text-neutral-1000 inline-flex items-center font-heading relative appearance-none rounded-lg px-2 focus:outline-none transition-colors duration-300 inline-flex items-center select-none overflow-hidden
        ${selectedHover}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  )
}