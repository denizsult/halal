"use client";

interface MediaStepProps {
  value: { logo?: File | null; cover?: File | null } | undefined;
  onChange: (value: { logo?: File | null; cover?: File | null }) => void;
  error?: string;
}

function MediaStep({ value, onChange, error }: MediaStepProps) {
  const media = value ?? { logo: null, cover: null };

  const handleFileChange = (type: "logo" | "cover", file: File | null) => {
    onChange({ ...media, [type]: file });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Media Assets
        </h3>
        <p className="text-sm text-gray-600">
          Add your hospital&apos;s logo and cover image to make your listing
          stand out.
        </p>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hospital Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {media.logo ? (
              <img
                src={URL.createObjectURL(media.logo)}
                alt="Logo preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                className="w-10 h-10 text-gray-400"
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
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange("logo", e.target.files?.[0] ?? null)
              }
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {media.logo ? "Change Logo" : "Upload Logo"}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 200x200px, PNG or JPG
            </p>
          </div>
        </div>
      </div>

      {/* Cover Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cover Image
        </label>
        <div className="relative">
          <div className="w-full h-48 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {media.cover ? (
              <img
                src={URL.createObjectURL(media.cover)}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto"
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
                <p className="text-sm text-gray-500 mt-2">No cover image</p>
              </div>
            )}
          </div>
          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleFileChange("cover", e.target.files?.[0] ?? null)
              }
              className="hidden"
              id="cover-upload"
            />
            <label
              htmlFor="cover-upload"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {media.cover ? "Change Cover" : "Upload Cover"}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Recommended: 1200x400px, PNG or JPG
            </p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default MediaStep;
