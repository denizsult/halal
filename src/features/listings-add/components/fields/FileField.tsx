"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller,useFormContext } from "react-hook-form";

interface FileFieldProps {
  name: string;
  label: string;
  required?: boolean;
  helpText?: string;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  existingKey?: string;
  existingLabel?: string;
}

type ExistingFile = {
  id?: number;
  file_url?: string;
  url?: string;
  file_name?: string;
  is_main?: boolean;
};

export function FileField({
  name,
  label,
  required,
  helpText,
  disabled,
  multiple = true,
  accept = "image/*",
  maxFiles = 20,
  existingKey,
  existingLabel,
}: FileFieldProps) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  const [previews, setPreviews] = useState<string[]>([]);

  const existingFiles = existingKey
    ? (watch(existingKey) as ExistingFile[] | undefined)
    : undefined;
  const resolvedExistingLabel =
    existingLabel ?? `${label} (Existing)`;
  const existingPreviews = useMemo(
    () =>
      (existingFiles ?? [])
        .map((file) => ({
          id: file.id ?? file.file_name ?? file.file_url ?? file.url ?? "",
          name: file.file_name ?? "Image",
          url: file.file_url ?? file.url ?? "",
          isMain: file.is_main ?? false,
        }))
        .filter((file) => Boolean(file.url)),
    [existingFiles]
  );

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFilesChange = useCallback(
    (
      files: File[],
      currentFiles: File[],
      onChange: (files: File[]) => void
    ) => {
      const newFiles = multiple
        ? [...currentFiles, ...files].slice(0, maxFiles)
        : files.slice(0, 1);

      // Revoke old URLs
      previews.forEach((url) => URL.revokeObjectURL(url));

      // Create new preview URLs
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);

      onChange(newFiles);
    },
    [multiple, maxFiles, previews]
  );

  const handleRemove = useCallback(
    (
      index: number,
      currentFiles: File[],
      onChange: (files: File[]) => void
    ) => {
      // Revoke the URL for the removed file
      URL.revokeObjectURL(previews[index]);

      const newFiles = currentFiles.filter((_, i) => i !== index);
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
      onChange(newFiles);
    },
    [previews]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {existingPreviews.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">{resolvedExistingLabel}</p>
          <div className="grid grid-cols-4 gap-3">
            {existingPreviews.map((preview) => (
              <div key={preview.id} className="relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {preview.isMain && (
                  <span className="absolute bottom-1 left-1 text-xs bg-teal-500 text-white px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          const files: File[] = field.value || [];

          return (
            <div className="space-y-4">
              {/* Upload Area */}
              <label
                className={`
                  flex flex-col items-center justify-center gap-2
                  w-full h-32 border-2 border-dashed rounded-xl
                  cursor-pointer transition-colors
                  ${
                    disabled
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-50 bg-white border-gray-300"
                  }
                `}
              >
                <input
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  disabled={disabled || files.length >= maxFiles}
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    handleFilesChange(selectedFiles, files, field.onChange);
                    e.target.value = ""; // Reset input
                  }}
                  className="hidden"
                />
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-500">
                  {files.length > 0
                    ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
                    : "Click to upload"}
                </span>
                {multiple && (
                  <span className="text-xs text-gray-400">
                    Max {maxFiles} files
                  </span>
                )}
              </label>

              {/* Preview Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {previews.map((preview, index) => (
                    <div key={preview} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(index, files, field.onChange)
                        }
                        className="
                          absolute -top-2 -right-2 w-6 h-6
                          bg-red-500 text-white rounded-full
                          flex items-center justify-center
                          opacity-0 group-hover:opacity-100 transition-opacity
                          hover:bg-red-600
                        "
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 text-xs bg-teal-500 text-white px-2 py-0.5 rounded">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
