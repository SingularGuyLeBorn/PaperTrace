"use client";

import { useState, ReactNode } from "react";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-paper-200 rounded-lg my-4 overflow-hidden">
      <button
        className="w-full collapsible-trigger px-4 py-3 bg-paper-100 text-left text-sm font-medium"
        onClick={() => setOpen(!open)}
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▶
        </span>
        {title}
      </button>
      {open && <div className="px-4 py-4">{children}</div>}
    </div>
  );
}
