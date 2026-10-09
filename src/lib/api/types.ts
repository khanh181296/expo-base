/** Page-number pagination contract shared by list endpoints */
export type Paginated<T> = {
  items: T[]
  page: number
  nextPage: number | null
  total: number
}
