import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-muted-foreground font-body"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "mystic-input font-body",
            error && "border-red-700 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400 font-body">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm text-muted-foreground font-body"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={cn(
            "mystic-input font-body resize-none",
            error && "border-red-700 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400 font-body">{error}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
