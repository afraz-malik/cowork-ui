import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { isAuthenticate } from './auth'
import Layout from '../Component/Layout/Layout'

const PrivateRoute = () => {
  let auth = isAuthenticate()
  return auth.user?.role === 'admin' ? <Layout /> : <Navigate to='/' />
}

export default PrivateRoute
