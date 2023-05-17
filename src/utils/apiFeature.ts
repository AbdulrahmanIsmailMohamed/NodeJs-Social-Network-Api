import { Document, Query } from "mongoose";

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
            numberOfPages: 0,
            countDocument: 0
        }
    }

    search(): this {
        if (this.queryString.keyword) {
            let filter = {
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
            numberOfPages: Math.floor(this.queryString.limit / countDocument),
            countDocument,
            currentPage: this.queryString.page,
            limit: this.queryString.limit
        };
        if (endIndex < countDocument) this.paginationResult.nextPage = this.queryString.page + 1
        if (skip > 0) this.paginationResult.previousPage = this.queryString.page - 1
        this.mongooseQuery = this.mongooseQuery.skip(skip);
        this.mongooseQuery = this.mongooseQuery.limit(this.queryString.limit);
        return this
    }

    async exic(modelName: string = "user"): Promise<{
        users: T[];
        paginationResult: Paginate;
        posts?: undefined;
    } | {
        posts: T[];
        paginationResult: Paginate;
        users?: undefined;
    }> {
        if (modelName === 'user') {
            const users = await this.mongooseQuery
                .sort({ createdAt: -1 })
                .select("firstName lastName profileImage")
            return { users, paginationResult: this.paginationResult }
        }
        if (modelName === "posts") {
            const posts = await this.mongooseQuery
                .sort({ createdAt: -1 })
                .populate("userId", "firstName lastName profileImage");
            return { posts, paginationResult: this.paginationResult }
        }
        const posts = await this.mongooseQuery
            .sort({ createdAt: -1 })
        return { posts, paginationResult: this.paginationResult }
    }

}