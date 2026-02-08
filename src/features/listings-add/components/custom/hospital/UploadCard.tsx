"use client";

import { useEffect, useId, useMemo, useRef } from "react";

type UploadCardProps = {
  title: string;
  description: string;
  accept: string;
  maxSizeText: string;
  formatsText?: string;
  value?: File | File[] | null;
  multiple?: boolean;
  onChange: (files: File[] | File | null) => void;
};

export default function UploadCard({
  title,
  description,
  accept,
  maxSizeText,
  formatsText,
  value,
  multiple,
  onChange,
}: UploadCardProps) {
  const inputId = useId();
  const files = Array.isArray(value) ? value : value ? [value] : [];
  const previewUrlsRef = useRef<string[]>([]);
  const readableFormats = useMemo(() => {
    if (formatsText) return formatsText;
    const parts = accept
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const labels: string[] = [];
    parts.forEach((part) => {
      if (part === "image/*") {
        labels.push("JPG", "PNG");
        return;
      }
      if (part === "application/pdf") {
        labels.push("PDF");
        return;
      }
      if (part.startsWith(".")) {
        labels.push(part.slice(1).toUpperCase());
        return;
      }
      if (part.includes("/")) {
        const ext = part.split("/")[1];
        if (ext) {
          labels.push(ext.toUpperCase());
        }
      }
    });
    return labels.length ? Array.from(new Set(labels)).join(", ") : "N/A";
  }, [accept, formatsText]);

  const previews = useMemo(
    () =>
      files
        .filter(
          (file) =>
            typeof file.type === "string" && file.type.startsWith("image/")
        )
        .map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewUrlsRef.current = previews;
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewUrlsRef.current = [];
    };
  }, [previews]);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-6 text-center">
      <div className="mx-auto mb-2 w-8 h-8 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-700">
          <path
            d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <p className="text-xs text-gray-500 mt-1">
        {description}
        <br />
        Accepted formats: {readableFormats} — Max size: {maxSizeText}
      </p>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        aria-label={title}
        className="hidden"
        onChange={(event) => {
          const nextFiles = Array.from(event.target.files ?? []);
          if (!nextFiles.length) {
            onChange(null);
            return;
          }
          onChange(multiple ? nextFiles : nextFiles[0]);
        }}
      />
      <label
        htmlFor={inputId}
        className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 cursor-pointer"
      >
        {files.length > 0
          ? multiple
            ? "Change files"
            : "Change file"
          : multiple
            ? "Choose files"
            : "Choose file"}
      </label>
      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((src, index) => (
            <img
              key={`${inputId}-preview-${index}`}
              src={src}
              alt={`${title} preview ${index + 1}`}
              className="h-24 w-full rounded-lg object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}
      {files.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {files.map((file) => file.name).join(", ")}
        </p>
      )}
    </div>
  );
}
