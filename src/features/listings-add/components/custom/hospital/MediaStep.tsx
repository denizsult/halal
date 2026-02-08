"use client";

import UploadCard from "./UploadCard";

interface MediaStepProps {
  value: { photos?: File[] | null } | undefined;
  onChange: (value: { photos?: File[] | null }) => void;
  error?: string;
  fieldErrors?: Record<string, { message?: string }>;
}

function MediaStep({ value, onChange, error, fieldErrors }: MediaStepProps) {
  const media = value ?? { photos: [] };
  const photosError = fieldErrors?.photos?.message;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900">
          What does your hospital look like?
        </h3>
        <p className="text-sm text-gray-600 mt-2">
          Upload photos of your hospital’s interior and exterior to give
          patients a visual impression.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4">
        <p className="text-sm text-gray-600">
          Upload at least 5 photos of your hospital. The more you upload, the
          more likely you are to get bookings. You can add more later.
        </p>
        <div className="mt-4">
          <UploadCard
            title="Upload Photos"
            description="Add high-quality images that represent your property, service, or facility."
            accept="image/*"
            formatsText="JPG, PNG"
            maxSizeText="7 MB"
            value={media.photos ?? []}
            multiple
            onChange={(files) =>
              onChange({ ...media, photos: files as File[] })
            }
          />
        </div>
      </div>

      {(photosError || error) && (
        <p className="text-sm text-red-500">{photosError ?? error}</p>
      )}
    </div>
  );
}

export default MediaStep;
