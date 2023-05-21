export interface Paginate {
    limit: number | string,
    currentPage: string | number,
    countDocument: number,
    nextPage?: string | number,
    previousPage?: string | number,
}