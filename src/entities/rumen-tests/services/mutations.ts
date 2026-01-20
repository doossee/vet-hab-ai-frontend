import { UpdateBody, RumenTest } from "@/shared/types";
import { RumenTestSchema } from "@/features/rumen-tests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RumenTestQueryKeys } from "../utils/constants/query-keys";
import { createQueryData, removeQueryData, updateQueryData } from "@/shared/helpers/query-updater";
import { rumenTestsControllerCreate, rumenTestsControllerRemove, rumenTestsControllerUpdate } from "@/shared/api";

export function useCreateRumenTest() {
  const client = useQueryClient();

  return useMutation<any, any, RumenTestSchema>({
    mutationFn: rumenTestsControllerCreate,
    onSuccess: (data) => {
      createQueryData<RumenTest>(client, [RumenTestQueryKeys.RUMEN_TEST], data);
      client.invalidateQueries({
        queryKey: [RumenTestQueryKeys.RUMEN_TEST_SELECT],
      });
    },
  });
}

export function useUpdateRumenTest() {
  const client = useQueryClient();

  return useMutation<any, any, UpdateBody<RumenTestSchema>>({
    mutationFn: async ({ id, body }) => rumenTestsControllerUpdate(+id, body),
    onSuccess: (data) => {
      updateQueryData<RumenTest>(client, [RumenTestQueryKeys.RUMEN_TEST], data);
      client.invalidateQueries({
        queryKey: [RumenTestQueryKeys.RUMEN_TEST_SELECT],
      });
    },
  });
}

export function useDeleteRumenTest() {
  const client = useQueryClient();

  return useMutation<any, any, number | string>({
    mutationFn: rumenTestsControllerRemove,
    onSuccess: (data) => {
      removeQueryData<RumenTest>(client, [RumenTestQueryKeys.RUMEN_TEST], data.id);
      client.invalidateQueries({
        queryKey: [RumenTestQueryKeys.RUMEN_TEST_SELECT],
      });
    },
  });
}