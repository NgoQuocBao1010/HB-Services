import type { Request as ExpressRequest } from "express";

interface PaginationRequestQuery {
    page?: string;
    perPage?: string;
}
