import { Document, FilterQuery, Query } from "mongoose";

import { Paginate } from "../interfaces/paginate.interface";
import { QueryString } from "../interfaces/queryString";

export class APIFeature<T extends Document> {
    private queryString: QueryString
    private mongooseQuery: Query<T[], T>
    private paginationResult: Paginate

    constructor(mongooseQuery: Query<T[], T>, queryString: QueryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
        this.paginationResult = {
            limit: 0,
            currentPage: 0,
            countDocument: 0
        }
    }

    search(): this {
        if (this.queryString.keyword) {
            const filter: FilterQuery<T> = {
                $or: [
                    { firstName: { $regex: this.queryString.keyword, $options: "i" } },
                    { lastName: { $regex: this.queryString.keyword, $options: "i" } }
                ]
            };
            this.mongooseQuery = this.mongooseQuery.find(filter);
        }
        return this
    }

    pagination(countDocument: number): this {
        const skip = (this.queryString.page - 1) * this.queryString.limit;
        const endIndex: number = this.queryString.page * this.queryString.limit;
        this.paginationResult = {
            countDocument,
            currentPage: this.queryString.page,
            limit: this.queryString.limit
        };
        if (endIndex < countDocument)
            this.paginationResult.nextPage = this.queryString.page + 1
        if (skip > 0) this.paginationResult.previousPage = this.queryString.page - 1
        this.mongooseQuery = this.mongooseQuery.skip(skip);
        this.mongooseQuery = this.mongooseQuery.limit(this.queryString.limit);
        return this
    }

    async execute(modelName: string): Promise<{
        data: T[];
        paginationResult: Paginate
    }> {
        let query: Query<T[], T> = this.mongooseQuery.sort({ createdAt: -1 });

        if (modelName === "user") {
            query = query.select("name profileImage");
        } else if (modelName === "users") {
            query = query.select("name email profileImage");
        } else if (modelName === "posts") {
            query = query.populate("userId", "name profileImage");
        }

        const data: T[] = await query.exec();
        return { data, paginationResult: this.paginationResult };
    }

}