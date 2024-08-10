import { IPaginationOptions } from '@/utils/types/pagination-options'

interface IData<T> {
  data: T[]
  count: number
}

export interface IPaginationResult<T> {
  data: T[]
  meta: {
    currentPage: number
    itemsPerPage: number
    totalItems: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export function infinityPagination<T>(
  { data, count }: IData<T>,
  { page, limit }: IPaginationOptions
): IPaginationResult<T> {
  const totalPages = Math.max(1, Math.ceil(count / limit))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  return {
    data,
    meta: {
      currentPage,
      itemsPerPage: limit,
      totalItems: count,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  }
}
