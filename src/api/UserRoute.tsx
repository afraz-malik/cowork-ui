import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { isAuthenticate } from './auth'

const UserRoute = () => {
  let auth = isAuthenticate()
  return auth.user?.role === 'user' ? <Outlet /> : <Navigate to='/' />
}

export default UserRoute
