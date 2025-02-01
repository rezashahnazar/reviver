import React from "react";
import "../styles.css";

interface ReviverTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function ReviverTextArea({
  label,
  className,
  disabled,
  ...props
}: ReviverTextAreaProps) {
  return (
    <div className="reviver-base">
      {label && <label className="reviver-label">{label}</label>}
      <textarea
        className={`reviver-textarea ${disabled ? "reviver-disabled" : ""} ${
          className || ""
        }`}
        disabled={disabled}
        {...props}
      />
    </div>
  );
}
