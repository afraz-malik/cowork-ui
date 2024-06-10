
import axios from 'axios';
import { DESKIE_API as API } from '../config';
import { get, post, put } from "./base-api";
// admin login
export const loginAdmin = async (body = {}) => {
    return post(`/adminLogin`, body);
};

// admin login
export const memberPassword = async (body = {}) => {
    return put(`/memberPassword`, body);
};

export const getUsers = async () => {
    return get("/users")
}
export const adminList = async () => {
    return get("/adminList")
}
// admin check

export const adminCheck = async (id: string) => {
    return get(`/adminCheck/${id}`)
}

// export const updateAdmin = async (email:string,body = {}) => {
//     return put(`/adminUpdate/${email}`,body)
// }

export const updateAdmin = async (email:string,body = {}) => {
    try {
        const response = await axios.put(`${API}/adminUpdate/${email}`, body,{headers: {
            'Content-Type': 'multipart/form-data',
          },});
        return response.data;
    } catch (error:any) {
        return error.response.data;
    }
};