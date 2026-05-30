"use client";

import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={{
        "--normal-bg": "var(--color-popover)",
        "--normal-text": "var(--color-popover-foreground)",
        "--normal-border": "var(--color-border)",
      }}
      {...props}
    />
  );
};

export { Toaster };
