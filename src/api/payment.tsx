import { get, getJwt, post, put } from './base-api'
import axios from 'axios'
import { DESKIE_API as API } from '../config'

// member list
export const paymentProcess = async (body = {}) => {
  return post(`/paymentProcess`, body)
}

export const paymentHook = async (body = {}) => {
  return post(`/paymentHook`, body)
}
