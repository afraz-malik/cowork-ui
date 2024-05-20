import { del, get, post } from "./base-api";
// task add
export const visitorAdd = async (body = {}) => {
    return post(`/visitorCreate`,body);
};
export const getVisitorList = async (limit: number, page: number) => {
    return get(`/visitorList?limit=${limit}&&page=${page}`);
};
export const visitorDelete = async (id: string) => {
    return del(`/visitorDelete/${id}`);
};

