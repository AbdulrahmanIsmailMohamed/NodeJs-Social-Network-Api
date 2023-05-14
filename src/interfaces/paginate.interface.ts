export interface Paginate {
    limit: number | string,
    currentPage: string | number,
    numberOfPages: number,
    nextPage?: string | number,
    previousPage?: string | number,
}