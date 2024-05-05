import { del, get, post, put } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';

// profile add
export const profileAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/profileCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};

// single profile
export const singleProfile = async () => {
    return get(`/profileSingle`);
};
// update profile
export const updateProfile = async (id:string,body = {}) => {
    try {
        const response = await axios.put(`${API}/updateProfile/${id}`, body,{headers: {
            'Content-Type': 'multipart/form-data',
          },});
        return response.data;
    } catch (error:any) {
        return error.response.data;
    }
};

// customization add
export const customizationAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/customCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};