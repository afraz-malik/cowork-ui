import { del, get, post } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';
// task add
export const resourceAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/resourceCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
};

// resource list
export const resourceList = async (limit: number, page: number, sort: string) => {
    return get(`/resourceList?limit=${limit}&page=${page}&type=${sort}`);
};

// single resource
export const singleResource = async (id: string) => {
    return get(`/singleResource/${id}`);
};
// resourceBooking
export const resourceBooking = async (body={}) => {
    return post(`/resourceBooking`,body);
};

// admin resource list
export const adminResourceList = async () => {
    return get(`/adminResourceList`);
};
// single resource
export const resourceBook = async (id: string) => {
    return get(`/resourceBook/${id}`);
};

// resource update
export const resourceUpdate = async (id: string,body = {}) => {
    try {
        const response = await axios.put(`${API}/resourceUpdate/${id}`, body,{headers: {
            'Content-Type': 'multipart/form-data',
          },});
        return response.data;
    } catch (error:any) {
        return error.response.data;
    }
};