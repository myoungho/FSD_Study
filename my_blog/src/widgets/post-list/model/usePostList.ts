// widgets/post-list/model/usePostList.ts
import { useState, useEffect } from 'react'
import { getPostList } from '../api/getPostList'
import type { PostListData, PostListFilters } from './types'

export function usePostList(initialPage: number = 1) {
  const [data, setData] = useState<PostListData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [filters, setFilters] = useState<PostListFilters>({})

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getPostList(page, filters)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : '포스트를 불러오지 못했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [page, filters])

  return {
    posts: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    setPage,
    filters,
    setFilters,
  }
}
