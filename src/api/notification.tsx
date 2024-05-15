import { get, getJwt } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';

// single profile
export const notificationsList = async () => {
    return get(`/invoiceNotification`);
};