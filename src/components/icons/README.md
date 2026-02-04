# SVG Icons Usage with SVGR

SVGR is now configured! You can import SVG files as React components in two ways:

## Method 1: Import as React Component (Recommended)

```tsx
import { ReactComponent as PlusIcon } from "./plus.svg";

// Usage
<PlusIcon className="w-5 h-5" />;
```

## Method 2: Import with ?react query parameter

```tsx
import PlusIcon from "./plus.svg?react";

// Usage
<PlusIcon className="w-5 h-5" />;
```

## Method 3: Import as URL (for img src)

```tsx
import plusIconUrl from "./plus.svg";

// Usage
<img src={plusIconUrl} alt="Plus" />;
```

## Example Component

```tsx
import { ReactComponent as CheckIcon } from "@/components/icons/check.svg";
import { ReactComponent as CloseIcon } from "@/components/icons/close.svg";

function MyComponent() {
  return (
    <div>
      <CheckIcon className="w-6 h-6 text-green-500" />
      <CloseIcon className="w-6 h-6 text-red-500" />
    </div>
  );
}
```
