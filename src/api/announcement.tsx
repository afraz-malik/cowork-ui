
import { get, post, put } from "./base-api";
import axios from 'axios';
import { DESKIE_API as API } from '../config';
// admin login
export const postAdd = async (body = {}) => {
    try {
        const response = await axios.post(`${API}/postCreate`, body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error: any) {
        return error.response?.data;
    }
};
// post list
export const getPostList = async (userId:string) => {
    return get(`/postList/${userId}`);
};
// comment
export const postComment = async (data={}) => {
    return post(`/postComment`,data);
};

export const getPostComment = async (id: string) => {
    return get(`/getComment/${id}`);
};

export const replyComment = async (data={}) => {
    return post(`/commentReply`,data);
};
export const commentCommentReply = async (data={}) => {
    return post(`/commentCommentReply`,data);
};
// post likes
export const likesPost = async (data={}) => {
    return post(`/postLike`,data);
};
// post likes update
export const likesPostEdit = async (data={}) => {
    return put(`/postLikeUpdate`,data);
};

// comment likes
export const commentLike = async (data={}) => {
    return post(`/commentLike`,data);
};
// comment likes update
export const commentLikeUpdate = async (data={}) => {
    return put(`/commentLikeUpdate`,data);
};

// comment reply likes
export const commentReplyLike = async (data={}) => {
    return post(`/commentReplyLike`,data);
};
// comment reply likes update
export const commentReplyLikeUpdate = async (data={}) => {
    return put(`/commentReplyLikeUpdate`,data);
};
