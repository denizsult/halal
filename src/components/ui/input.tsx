import * as React from "react";

import { EyeCloseIcon, EyeIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const iconSlotClass =
  "pointer-events-none flex shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4";

export interface InputProps extends React.ComponentProps<"input"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function Input({ className, type, leftIcon, rightIcon, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === "password";
  const hasRight = isPassword || !!rightIcon;

  return (
    <div className="relative w-full">
      {leftIcon && (
        <span
          className={cn(
            iconSlotClass,
            "absolute left-3 top-1/2 -translate-y-1/2 z-10"
          )}
        >
          {leftIcon}
        </span>
      )}

      <input
        type={isPassword ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          leftIcon && "pl-10",
          hasRight && "pr-10",
          className
        )}
        {...props}
      />

      {hasRight && (
        <span
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 z-10",
            isPassword ? "cursor-pointer" : iconSlotClass
          )}
          onClick={isPassword ? () => setShowPassword((v) => !v) : undefined}
          onKeyDown={
            isPassword
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowPassword((v) => !v);
                  }
                }
              : undefined
          }
          role={isPassword ? "button" : undefined}
          tabIndex={isPassword ? 0 : undefined}
          aria-label={
            isPassword
              ? showPassword
                ? "Hide password"
                : "Show password"
              : undefined
          }
        >
          {isPassword ? (
            showPassword ? (
              <EyeIcon className="fill-muted-foreground" />
            ) : (
              <EyeCloseIcon className="fill-muted-foreground" />
            )
          ) : (
            rightIcon
          )}
        </span>
      )}
    </div>
  );
}

export { Input };
