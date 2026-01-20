import { rumenTestsControllerFindAll } from "@/shared/api";
import { RumenTest, PaginatedEntity } from "@/shared/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { paramsToQueryKeys } from "@/shared/helpers/params-to-keys";
import { RumenTestQueryKeys } from "../utils/constants/query-keys";

export function useGetRumenTests(params: Record<string, unknown>, enabled?: boolean) {
  return useQuery<PaginatedEntity<RumenTest>, Error>({
    queryKey: [RumenTestQueryKeys.RUMEN_TEST, ...paramsToQueryKeys(params)],
    queryFn: async () => rumenTestsControllerFindAll(params) as Promise<PaginatedEntity<RumenTest>>,
    enabled,
  });
}

export function useGetRumenTestsInfinite(search?: string) {
  return useInfiniteQuery({
    queryKey: [RumenTestQueryKeys.RUMEN_TEST_SELECT, search],
    queryFn: (params) => rumenTestsControllerFindAll(params.pageParam) as Promise<PaginatedEntity<RumenTest>>,
    initialPageParam: { page: 1, perPage: 20, ...(search && { search }) },
    getNextPageParam: (lastPage) => {
      const nextPage = (lastPage?.meta?.currentPage ?? 0) + 1;
      const isLast = lastPage?.meta?.currentPage === lastPage?.meta?.lastPage;

      return !isLast && lastPage?.meta?.total
        ? {
            page: nextPage,
            perPage: 20,
            ...(search && { search }),
          }
        : null;
    },
  });
}

export function useGetLastRumenTest(animalId: number | string, enabled?: boolean) {
  return useQuery<RumenTest|null>({
    queryKey: [RumenTestQueryKeys.RUMEN_TEST, 'last', animalId],
    queryFn: async () => {
      const { data } = await rumenTestsControllerFindAll({
        page: 1,
        perPage: 1,
        byCreatedDate: "desc",
        animalId
      })

      return data?.[0] ?? null
    },
    enabled,
  });
}