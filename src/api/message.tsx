import axios from 'axios'
import { DESKIE_API as API } from '../config'
import { get } from './base-api'

/*
 * @des Get the chat message
 * @param sender & receiver
 * @return
 */

// chat
export const getChatHistory = async (body = {}) => {
  try {
    const response = await axios.post(`${API}/chatHistory`, body)
    return response.data
  } catch (error: any) {
    return error.response?.data
  }
}

/*
 * @des Get the chatters
 * @param sender email
 * @return
 */

// chatter list
export const getChatters = async (email: string) => {
  return get(`/chatters/${email}`)
}
