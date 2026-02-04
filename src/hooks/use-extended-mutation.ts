import {
  type QueryKey,
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

type ExtendedMutationOptions<TData, TError, TVariables, TContext> =
  UseMutationOptions<TData, TError, TVariables, TContext> & {
    onSuccessMessage?: string;
    onErrorMessage?: string;
    refetchQueries?: QueryKey[];
  };

export const useExtendedMutation = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: ExtendedMutationOptions<TData, TError, TVariables, TContext>
) => {
  const queryClient = useQueryClient();
  const {
    onSuccessMessage,
    onErrorMessage,
    refetchQueries,
    onSuccess,
    onError,
    ...rest
  } = options;

  return useMutation({
    ...rest,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (onSuccessMessage) {
        toast.success(onSuccessMessage);
      }

      if (refetchQueries?.length) {
        refetchQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      if (onErrorMessage) {
        toast.error(onErrorMessage);
      }

      onError?.(error, variables, onMutateResult, context);
    },
  });
};
