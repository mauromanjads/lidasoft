import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="flex flex-col mb-2">
        {label && (
          <label className="text-sm font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          {...props}
          className={`border p-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 border-gray-400 ${
            className || ""
          }`}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
