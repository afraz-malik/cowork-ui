import { del, get, post, put } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';
// task add
export const tourAdd = async (body = {}) => {
    return post(`/tourCreate`,body);
};
export const getTourList = async () => {
    return get(`/tourList`);
};
