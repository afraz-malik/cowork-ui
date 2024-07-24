import React from 'react'
import Routing from './Routing'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'react-datepicker/dist/react-datepicker.css'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <ToastContainer />
      <Routing />
    </>
  )
}

export default App
