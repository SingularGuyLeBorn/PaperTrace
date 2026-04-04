"use client";

import { ReactNode } from "react";

interface WidgetProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Widget({ title, description, children }: WidgetProps) {
  return (
    <div className="widget-container">
      <div className="widget-header">
        <span className="text-blue-600">&#9881;</span>
        <span>{title}</span>
        {description && (
          <span className="text-paper-800/40 font-normal ml-2">
            — {description}
          </span>
        )}
      </div>
      <div className="widget-body">{children}</div>
    </div>
  );
}
