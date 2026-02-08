"use client";

import type { ReactNode } from "react";

interface CollapsibleCardProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  children: ReactNode;
}

function CollapsibleCard({
  title,
  isOpen,
  onToggle,
  onRemove,
  removeLabel = "Remove",
  children,
}: CollapsibleCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 text-sm font-semibold text-gray-900"
        >
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M6 8L10 4L14 8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {title}
        </button>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
          >
            {removeLabel}
          </button>
        )}
      </div>
      {isOpen && <div>{children}</div>}
    </div>
  );
}

export default CollapsibleCard;
