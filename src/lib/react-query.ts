import {
  type DefaultOptions,
  QueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    Awaited<ReturnType<MutationFnType>>,
    Error,
    Parameters<MutationFnType>[0]
  > & {
    onSuccessMessage?: string;
    onErrorMessage?: string;
    refetchQueries?: QueryKey[];
  };
