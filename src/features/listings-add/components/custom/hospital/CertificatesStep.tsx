"use client";

import { useMemo } from "react";

import UploadCard from "./UploadCard";

type CertificateItem = {
  title: string;
  file?: File | null;
};

type CertificatesValue = {
  certificates: CertificateItem[];
};

interface CertificatesStepProps {
  value: CertificatesValue | undefined;
  onChange: (value: CertificatesValue) => void;
  error?: string;
  fieldErrors?: Record<string, unknown>;
}

const createDefaultValue = (): CertificatesValue => ({ certificates: [] });
const createEmptyItem = (): CertificateItem => ({ title: "", file: null });

const getError = (
  errors: Record<string, unknown> | undefined,
  path: string
) => {
  if (!errors) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors) as { message?: string } | undefined;
};

function CertificatesStep({
  value,
  onChange,
  error,
  fieldErrors,
}: CertificatesStepProps) {
  const data = useMemo(() => value ?? createDefaultValue(), [value]);

  const updateItem = (index: number, patch: Partial<CertificateItem>) => {
    const next = data.certificates.map((item, idx) =>
      idx === index ? { ...item, ...patch } : item
    );
    onChange({ ...data, certificates: next });
  };

  const removeItem = (index: number) => {
    const next = data.certificates.filter((_, idx) => idx !== index);
    onChange({ ...data, certificates: next });
  };

  const addItem = () => {
    onChange({
      ...data,
      certificates: [...data.certificates, createEmptyItem()],
    });
  };

  return (
    <div className="space-y-6">
      {data.certificates.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <svg
                className="w-4 h-4 text-gray-500"
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
              Certificate {index + 1}
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          <div>
            <label
              htmlFor={`certificate-${index}-title`}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              id={`certificate-${index}-title`}
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, { title: e.target.value })}
              placeholder="International Certifications"
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-gray-300 focus:outline-none"
            />
            {getError(fieldErrors, `${index}.title`)?.message && (
              <p className="mt-2 text-xs text-red-500">
                {getError(fieldErrors, `${index}.title`)?.message}
              </p>
            )}
          </div>
          <div className="mt-4">
            <UploadCard
              title="Upload Certificate"
              description="Add high-quality images that represent your property, service, or facility."
              accept="image/*"
              formatsText="JPG, PNG"
              maxSizeText="7 MB"
              value={item.file ?? null}
              onChange={(file) =>
                updateItem(index, { file: file as File | null })
              }
            />
          </div>
        </div>
      ))}

      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1f1f1f]"
        >
          <span className="text-lg leading-none">+</span>
          Add certificate
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default CertificatesStep;
