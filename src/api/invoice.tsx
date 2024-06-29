import { get, post, put } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';
// invoice add
export const invoiceAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/invoiceCreate`, body);
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};

// invoice list
export const getInvoicesList = async (limit: number, page: number,status: string) => {
    return get(`/invoicesList?limit=${limit}&page=${page}&status=${status}`);
};
// single invoice
export const singleInvoice = async (id: string) => {
    return get(`/invoiceSingle/${id}`);
};

// invoice update
export const invoiceUpdate = async (body = {}) => {
    return post(`/invoicePayment`, body);
};

export const getLastInvoice = async () => {
    return get(`/getLastInvoice`);
};
export const updatePayment = async (id: string,body={}) => {
    return put(`/updatePayment/${id}`,body);
};
// void update
export const paymentVoid = async (id: string,body={}) => {
    return put(`/paymentVoid/${id}`,body);
};
// invoice view
export const invoicesView = async (id: string) => {
    return put(`/invoicesView/${id}`);
};

export const invoicesResource = async (id: string) => {
    return get(`/invoicesResource/${id}`);
};
