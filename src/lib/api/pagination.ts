import type { PaginationQuery } from "./types";

export function toBackendPagination(params?: PaginationQuery) {
  if (!params) return undefined;
  return {
    Page: params.pageNumber ?? 1,
    PageSize: params.pageSize ?? 10,
    SortBy: params.sortBy,
  };
}
