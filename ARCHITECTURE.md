# Frontend Architecture Documentation

Bu dokümantasyon, projenin dosya mimarisini, isimlendirme kurallarını ve kod organizasyonunu açıklar.

## 📁 Genel Dizin Yapısı

```
src/
├── api/                    # Global API hooks (legacy, kullanılmıyor)
├── assets/                 # Statik dosyalar
├── components/             # Paylaşılan/Global bileşenler
├── config/                 # Konfigürasyon dosyaları
├── features/               # Feature-based modüller (ANA YAPI)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility kütüphaneleri ve konfigürasyonlar
├── providers/             # React context providers
├── routes/                 # Routing yapılandırması
├── store/                  # Global state management (Valtio)
├── types/                  # TypeScript type tanımlamaları
└── utils/                  # Utility fonksiyonları
```

---

## 🎯 Features Yapısı (Feature-Based Architecture)

Her feature, kendi içinde bağımsız bir modül olarak organize edilmiştir.

### Feature Dizin Yapısı

```
features/
└── FeatureName/
    ├── api/                # API hooks (queries & mutations)
    │   ├── index.ts        # Tüm API hook'larını export eder
    │   ├── useGetX.ts      # Query hook'ları
    │   └── useCreateX.ts   # Mutation hook'ları
    ├── components/         # Feature'a özel bileşenler
    │   ├── index.ts        # Component export'ları
    │   ├── component-name.tsx
    │   └── partials/       # Alt bileşenler (opsiyonel)
    ├── store/              # Feature'a özel state (opsiyonel)
    │   └── index.ts        # Store export'ları
    └── index.tsx           # Ana feature component
```

### Örnek Feature: AnswerTemplates

```
AnswerTemplates/
├── api/
│   ├── index.ts
│   ├── useCreateAnswerTemplate.ts
│   ├── useDeleteAnswerTemplate.ts
│   ├── useGetAnswerTemplate.ts
│   ├── useGetAnswerTemplates.ts
│   ├── useGetSuggestedReplies.ts
│   ├── useRegenerateSuggestedReplies.ts
│   ├── useTranslateText.ts
│   └── useUpdateAnswerTemplate.ts
├── components/
│   ├── answer-template-card.tsx
│   ├── answer-template-drawer.tsx
│   ├── answer-template-skeleton.tsx
│   ├── suggested-replies.tsx
│   └── partials/
│       ├── index.ts
│       ├── schema.ts
│       ├── template-form-fields.tsx
│       ├── translation-item.tsx
│       ├── translation-list.tsx
│       └── use-translation-manager.ts
├── store/
│   └── index.ts
└── index.tsx
```

---

## 🔌 API Hooks (Queries & Mutations)

### Query Pattern (GET İşlemleri)

Query hook'ları `@tanstack/react-query` kullanır ve `useQuery` hook'unu kullanır.

**Dosya İsmi:** `useGet[EntityName].ts` veya `useGet[EntityName]s.ts` (çoğul)

**Yapı:**
```typescript
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type Payload = {
  // Query parametreleri
};

type Response = {
  status: "success" | "error";
  data: EntityType;
};

const getEntity = async (payload: Payload) => {
  const response = (
    await api.get("endpoint", {
      params: payload,
    })
  ).data;

  return response.data; // veya response (eğer pagination varsa)
};

export const useGetEntity = (payload: Payload, config = {}) => {
  return useQuery<Response["data"]>({
    queryKey: ["useGetEntity", payload],
    queryFn: () => getEntity(payload),
    ...config,
  });
};
```

**Örnek:**
```typescript
// useGetAnswerTemplates.ts
import { api } from "@/lib/axios";
import { AnswerTemplate, Platform } from "@/types";
import { useQuery } from "@tanstack/react-query";

type Payload = {
  id: number | string;
  platform?: Platform;
  language?: string;
  query?: string;
};

type Response = {
  status: "success" | "error";
  data: AnswerTemplate;
};

const getAnswerTemplate = async (payload: Payload) => {
  const response = (
    await api.get("answer-templates/" + payload.id, {
      params: payload,
    })
  ).data;

  return response.data;
};

export const useGetAnswerTemplate = (payload: Payload, config = {}) => {
  return useQuery<Response["data"]>({
    queryKey: ["useGetAnswerTemplate", payload],
    queryFn: () => getAnswerTemplate(payload),
    ...config,
  });
};
```

### Mutation Pattern (POST, PUT, DELETE İşlemleri)

Mutation hook'ları `useExtendedMutation` kullanır (varsa, yoksa `useMutation`).

**Dosya İsmi:** `use[Action][EntityName].ts` (örn: `useCreateAnswerTemplate.ts`, `useUpdateAnswerTemplate.ts`, `useDeleteAnswerTemplate.ts`)

**Yapı:**
```typescript
import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";

type Payload = {
  // Request body
};

export const actionEntity = async (payload: Payload) => {
  return api.post("/endpoint", payload);
  // veya api.put, api.delete, api.patch
};

export const useActionEntity = (
  config?: MutationConfig<typeof actionEntity>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: actionEntity,
  });
};
```

**Örnek:**
```typescript
// useCreateAnswerTemplate.ts
import { useExtendedMutation } from "@/hooks/use-extended-mutation";
import { api } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { AnswerTemplate } from "@/types";

type Payload = AnswerTemplate;

export const createAnswerTemplate = async (payload: Payload) => {
  return api.post("/answer-templates", payload);
};

export const useCreateAnswerTemplate = (
  config?: MutationConfig<typeof createAnswerTemplate>
) => {
  return useExtendedMutation({
    ...config,
    mutationFn: createAnswerTemplate,
  });
};
```

### API Index Export Pattern

Her feature'ın `api/index.ts` dosyası tüm API hook'larını export eder:

```typescript
// api/index.ts
export * from './useCreateAnswerTemplate'
export * from './useDeleteAnswerTemplate'
export * from './useGetAnswerTemplate'
export * from './useGetAnswerTemplates'
export * from './useUpdateAnswerTemplate'
export * from './useGetSuggestedReplies'
export * from './useRegenerateSuggestedReplies'
export * from './useTranslateText'
```

**Kullanım:**
```typescript
import { useGetAnswerTemplates, useCreateAnswerTemplate } from "./api";
```

---

## 🧩 Components Yapısı

### Global Components (`src/components/`)

Paylaşılan, genel kullanımlı bileşenler burada bulunur.

**Yapı:**
```
components/
├── component-name/
│   └── index.tsx
├── ui/                    # shadcn/ui bileşenleri
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
└── render-if/             # Conditional rendering component
    └── index.tsx
```

**İsimlendirme:**
- Kebab-case: `component-name/`
- Dosya: `index.tsx` veya `ComponentName.tsx`

### Feature Components (`features/[FeatureName]/components/`)

Feature'a özel bileşenler feature içinde bulunur.

**Yapı:**
```
components/
├── index.ts              # Export dosyası
├── component-name.tsx
├── component-skeleton.tsx
└── partials/             # Alt bileşenler (opsiyonel)
    ├── index.ts
    └── sub-component.tsx
```

**İsimlendirme:**
- Kebab-case: `component-name.tsx`
- Skeleton: `component-name-skeleton.tsx`
- Export dosyası: `index.ts`

**Örnek:**
```typescript
// components/index.ts
export * from './answer-template-card'
export * from './answer-template-drawer'
export * from './answer-template-skeleton'
```

### Component Export Pattern

```typescript
// components/index.ts
export * from './ai-summary'
export * from './empty-reviews'
export * from './review-filters'
export * from './review-skeleton'
```

---

## 🗄️ Store Yapısı (State Management)

State management için **Valtio** kullanılır.

### Global Store (`src/store/`)

Global state'ler burada tutulur.

**Yapı:**
```typescript
// store/store-name.store.ts
import { proxy, useSnapshot } from "valtio";

type State = {
  // State tanımlamaları
};

const state = proxy<State>({
  // Initial state
});

const actions = {
  // Action fonksiyonları
};

export const useStoreNameState = () => useSnapshot(state);
export const useStoreNameActions = () => actions;
```

**Örnek:**
```typescript
// store/reviews-filter.store.ts
import { App, Language, Preset } from "@/types";
import { proxy, useSnapshot } from "valtio";
import { DateRange } from "react-day-picker";
import dayjs from "dayjs";

type ReviewFilterState = {
  app?: App;
  filters: Preset["filters"];
};

const state = proxy<ReviewFilterState>({
  app: undefined,
  filters: {}
});

const actions = {
  setApp: (app: App) => {
    state.app = app;
    state.filters.app_id = app.app_id;
  },
  setVersion: (version: string | undefined) => {
    state.filters.version = version;
  },
  // ... diğer actions
};

export const useReviewFiltersState = () => useSnapshot(state);
export const useReviewFiltersActions = () => actions;
```

### Feature Store (`features/[FeatureName]/store/`)

Feature'a özel state'ler feature içinde bulunur.

**Yapı:**
```typescript
// store/index.ts
import { proxy, useSnapshot } from "valtio";

type State = {
  // State tanımlamaları
};

const state = proxy<State>({
  // Initial state
});

const actions = {
  // Action fonksiyonları
};

// Pattern 1: Ayrı export
export const useFeatureStoreState = () => useSnapshot(state);
export const useFeatureStoreActions = () => actions;

// Pattern 2: Birleşik export
export const useFeatureStore = () => {
  return { ...useSnapshot(state), ...actions };
};
```

**Örnek:**
```typescript
// features/AnswerTemplates/store/index.ts
import { AnswerTemplate } from "@/types";
import { proxy, useSnapshot } from "valtio";

type State = {
  isOpen: boolean;
  isEditing: boolean;
  template?: AnswerTemplate;
};

const state = proxy<State>({
  isOpen: false,
  isEditing: false,
  template: undefined,
});

const actions = {
  open: () => {
    state.isOpen = true;
  },
  close: () => {
    state.isOpen = false;
    state.isEditing = false;
    state.template = undefined;
  },
  openEdit: (template: AnswerTemplate) => {
    state.isEditing = true;
    state.template = template;
    state.isOpen = true;
  },
};

export const useAnswerTemplatesDrawerStore = () => {
  return { ...useSnapshot(state), ...actions };
};
```

---

## 📝 İsimlendirme Kuralları

### Dosya İsimlendirme

1. **Components:**
   - Kebab-case: `component-name.tsx`
   - Skeleton: `component-name-skeleton.tsx`
   - Index: `index.tsx` veya `index.ts`

2. **API Hooks:**
   - Query: `useGet[EntityName].ts` veya `useGet[EntityName]s.ts`
   - Mutation: `use[Action][EntityName].ts`
     - `useCreateAnswerTemplate.ts`
     - `useUpdateAnswerTemplate.ts`
     - `useDeleteAnswerTemplate.ts`
     - `useReplyReview.ts`

3. **Store:**
   - Global: `store-name.store.ts`
   - Feature: `store/index.ts`

4. **Features:**
   - PascalCase: `FeatureName/`
   - Ana dosya: `index.tsx`

### Fonksiyon/Değişken İsimlendirme

1. **API Fonksiyonları:**
   - camelCase: `getEntity`, `createEntity`, `updateEntity`, `deleteEntity`

2. **Hooks:**
   - `use` prefix: `useGetEntity`, `useCreateEntity`

3. **Store Actions:**
   - camelCase: `setApp`, `setVersion`, `open`, `close`, `resetFilters`

4. **Component İsimleri:**
   - PascalCase: `AnswerTemplateCard`, `ReviewFilters`

### Type İsimlendirme

1. **Payload/Request Types:**
   - `Payload`, `Request`, veya `[Action]Payload`

2. **Response Types:**
   - `Response`, `[Entity]Response`

3. **State Types:**
   - `State`, `[Feature]State`

---

## 🔧 Utility & Configuration

### Axios Configuration

```typescript
// lib/axios.ts
import axios from "axios";
import { env } from "./utils";

const HOST = env('VITE_API_BASE_URL') || 'https://api.applens.co';

export const api = axios.create({
  baseURL: `${HOST}/api/`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  },
});
```

### React Query Configuration

```typescript
// lib/react-query.ts
import { QueryClient, DefaultOptions } from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// Custom types
export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<...> & CustomMutationParameters;
```

### Extended Mutation Hook

```typescript
// hooks/use-extended-mutation.tsx
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export const useExtendedMutation = <MutationFnType extends (...args: any) => any>(
  config?: MutationConfig<MutationFnType>
) => {
  const mutation = useMutation({
    ...config,
  });

  useEffect(() => {
    if (mutation.data && config?.refetchQueries?.length) {
      config.refetchQueries.forEach((query) => {
        queryClient.refetchQueries({
          queryKey: [query],
        });
      });
    }
  }, [mutation.data]);

  return mutation;
};
```

---

## 🎨 Component Kullanım Örnekleri

### Feature Component Örneği

```typescript
// features/AnswerTemplates/index.tsx
import PageLayout from "@/components/page-layout";
import { useGetAnswerTemplates } from "./api";
import { AnswerTemplateCard } from "./components/answer-template-card";
import { Button } from "@/components/ui/button";
import { useAnswerTemplatesDrawerStore } from "./store";
import { RenderIf } from "@/components/render-if";

export const AnswerTemplates = () => {
  const { data, isLoading } = useGetAnswerTemplates({
    language: lang,
    platform,
  });
  const { open } = useAnswerTemplatesDrawerStore();

  return (
    <PageLayout title="Answer Templates">
      <RenderIf condition={!isLoading}>
        {/* Component içeriği */}
      </RenderIf>
    </PageLayout>
  );
};
```

### Conditional Rendering

**Kural:** `RenderIf` component'i kullanılmalı (React'ın native conditional rendering yerine).

```typescript
import { RenderIf } from "@/components/render-if";

<RenderIf condition={!isLoading}>
  <Component />
</RenderIf>

<RenderIf
  condition={!!data?.length}
  fallback={<EmptyState />}
>
  <DataList data={data} />
</RenderIf>
```

---

## 📋 Özet: Yeni Feature Oluşturma Adımları

1. **Feature Dizini Oluştur:**
   ```
   features/NewFeature/
   ├── api/
   ├── components/
   ├── store/ (opsiyonel)
   └── index.tsx
   ```

2. **API Hook'ları Oluştur:**
   - Query: `api/useGetNewFeature.ts`
   - Mutation: `api/useCreateNewFeature.ts`
   - Export: `api/index.ts`

3. **Component'leri Oluştur:**
   - `components/new-feature-card.tsx`
   - `components/index.ts` (export)

4. **Store Oluştur (gerekirse):**
   - `store/index.ts`

5. **Ana Component:**
   - `index.tsx` - Feature'ın ana component'i

6. **Routing'e Ekle:**
   - `routes/index.ts` dosyasına route ekle

---

## 🔍 Önemli Notlar

1. **Mutation Hook Seçimi:**
   - `useExtendedMutation` varsa kullan (refetchQueries desteği için)
   - Yoksa `useMutation` kullan

2. **Conditional Rendering:**
   - Her zaman `RenderIf` component'i kullan
   - Native `{condition && <Component />}` kullanma

3. **Export Pattern:**
   - Her alt dizinde `index.ts` ile export yap
   - Barrel export pattern kullan

4. **State Management:**
   - Global state: `src/store/`
   - Feature state: `features/[FeatureName]/store/`
   - Valtio kullan

5. **Type Safety:**
   - Tüm API hook'larında type tanımlamaları yap
   - `Payload`, `Response` type'ları kullan

---

Bu dokümantasyon, projenin mimarisini yeniden oluşturabilmek için gerekli tüm bilgileri içermektedir.
