
import { del, get, put } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';
// task add
export const taskAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/taskCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        return error.response.data;
    }
};

// task list
export const getTaskList = async (status: string) => {
    return get(`/taskList/${status}`);
};
// task status update
export const updateStatus = async (id: string, body = {}) => {
    return put(`/taskStatus/${id}`,body);
};
// task delete
export const deleteTask = async (id: string) => {
    return del(`/taskDelete/${id}`);
};
// single task
export const getSingleTask = async (id: string) => {
    return get(`/singleTask/${id}`);
};

export const taskUpdate = async (id: string,body = {}) => {
    try {
        const response = await axios.put(`${API}/taskUpdate/${id}`, body,{headers: {
            'Content-Type': 'multipart/form-data',
          },});
        return response.data;
    } catch (error:any) {
        return error.response.data;
    }
};

