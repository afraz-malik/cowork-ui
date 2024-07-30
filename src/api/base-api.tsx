import { DESKIE_API as API } from '../config'
import { logout } from './auth';

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    await logout();
    window.location.href = '/'; 
  }
  return response.json();
};

export const post = (url: string, body: any = {}) => {
  const jwttoken = JSON.parse(localStorage.getItem('company') || '{}')
  const { token } = jwttoken
  return fetch(`${API}${url}`, {
    method: 'POST',
    headers: {  
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}

// GET request
export const get = (url: string) => {
  const jwttoken = JSON.parse(localStorage.getItem('company') || '{}')
  const { token } = jwttoken
  return fetch(`${API}${url}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}

// PUT request
export const put = (url: string, body: any = {}) => {
  const jwttoken = JSON.parse(localStorage.getItem('company') || '{}')
  const { token } = jwttoken
  return fetch(`${API}${url}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}

// PATCH request
export const patch = (url: string, body: any = {}) => {
  const jwttoken = JSON.parse(localStorage.getItem('company') || '{}')
  const { token } = jwttoken
  return fetch(`${API}${url}`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}

// DELETE request
export const del = (url: string, body: any = {}) => {
  const jwttoken = JSON.parse(localStorage.getItem('company') || '{}')
  const { token } = jwttoken
  return fetch(`${API}${url}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
    body: JSON.stringify(body),
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}

// GET JWT request
export const getJwt = (url: string, token: string) => {
  return fetch(`${API}${url}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token.toString()}` : '',
    },
  })
    .then(handleResponse)
    .catch((err) => {
      return err
    })
}
