import { get, post } from './base-api'
// task add
export const tourAdd = async (body = {}) => {
  return post(`/tourCreate`, body)
}
export const getTourList = async () => {
  return get(`/tourList`)
}
export const tourTime = async (body = {}) => {
  return get(`/tourTime?dueDate=${body}`)
}
