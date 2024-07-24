import { get, post } from './base-api'
import axios from 'axios'
import { DESKIE_API as API } from '../config'
// admin login
export const spacesAdd = async (body = {}) => {
  try {
    const response = await axios.post(`${API}/spacesCreate`, body)
    return response.data
  } catch (error: any) {
    return error.response?.data
  }
}
// spaces list
export const getSpacesList = async (
  limit: number,
  page: number,
  keywords?: string
) => {
  return get(`/spacesList?limit=${limit}&&page=${page}&&keyword=${keywords}`)
}
// single spaces
export const singleSpaces = async (id: string) => {
  return get(`/spacesSingle/${id}`)
}
// update spaces info
export const updateSpaces = async (id: string, body = {}) => {
  try {
    const response = await axios.put(`${API}/editSpaces/${id}`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

// update spaces member add
export const memberAddSpaces = async (body = {}) => {
  return post(`/addMemberToSpace`, body)
}
