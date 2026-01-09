import { useMutation } from 'convex/react';
import { FunctionReference, FunctionReturnType } from 'convex/server';
import { useState } from 'react';
import { toast } from 'sonner';

export const useConvexMutation = <
  Mutation extends FunctionReference<'mutation'>,
>(
  mutation: Mutation
) => {
  const convexMutation = useMutation(mutation);
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    payload: Mutation['_args'],
    {
      onSuccess,
      onError,
      successMessage,
      errorMessage,
    }: {
      onSuccess?: (data: FunctionReturnType<Mutation>) => void;
      onError?: (error: Error) => void;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ) => {
    try {
      setIsLoading(true);
      const data = await convexMutation(payload);
      if (successMessage) {
        toast.success(successMessage);
      }
      onSuccess?.(data);
      return data;
    } catch (error) {
      if (errorMessage) {
        toast.error(errorMessage, {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};
