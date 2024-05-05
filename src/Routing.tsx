import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Page/Login/Login';
import Member from './Page/Member/Member';
import Spaces from './Page/Spaces/Spaces';
import Announcement from './Page/Announcement/Announcement';
import Files from './Page/Files/Files';
import Ticket from './Page/Ticket/Ticket';
import Chat from './Page/Chat/Chat';
import Messenger from './Page/Messenger/Messenger';
import Billing from './Page/Billing/Billing';
import CreateInvoice from './Page/CreateInvoice/CreateInvoice';
import InvoiceDetails from './Page/InvoiceDetails/InvoiceDetails';
import Calender from './Page/Calender/Calender';
import Settings from './Page/Settings/Settings';
import Task from './Page/Task/Task';
import Dashboard from './Page/Dashboard/Dashboard';
import SignUp from './Page/SignUp/SignUp';
import PrivateRoute from './api/PrivateRoute';
import UserRoute from './api/UserRoute';
import MySetting from './Page/User/MySetting/MySetting';
import MyInvoice from './Page/User/MyInvoice/MyInvoice';
import MyFiles from './Page/User/MyFiles/MyFiles';
import MyHome from './Page/User/MyHome/MyHome';

const Routing = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>

                    <Route element={<PrivateRoute />}>
                        <Route path="/member" element={<Member />}></Route>
                        <Route path="/assets" element={<Spaces />}></Route>
                        <Route path="/announcements" element={<Announcement />}></Route>
                        <Route path="/files" element={<Files />}></Route>
                        {/* <Route path="/tickets" element={<Ticket />}></Route> */}
                        <Route path="/chat" element={<Chat />}></Route>
                        <Route path="/messenger" element={<Messenger />}></Route>
                        <Route path="/billing" element={<Billing />}></Route>
                        {/* <Route path="/create-invoice" element={<CreateInvoice />}></Route> */}
                        <Route path="/invoice-details/:id" element={<InvoiceDetails />}></Route>
                        {/* <Route path="/calender" element={<Calender />}></Route> */}
                        <Route path="/settings" element={<Settings />}></Route>
                        <Route path="/task" element={<Task />}></Route>
                        <Route path="/dashboard" element={<Dashboard />}></Route>
                    </Route>

                    {/* login */}
                    <Route path="/" element={<Login />}></Route>

                    {/* member */}
                    <Route element={<UserRoute />}>
                        <Route path="/my-messenger" element={<Messenger />}></Route>
                        <Route path="/my-announcements" element={<Announcement />}></Route>
                        <Route path="/my-settings" element={<MySetting />}></Route>
                        <Route path="/my-invoice" element={<MyInvoice />}></Route>
                        <Route path="/my-files" element={<MyFiles />}></Route>
                        <Route path="/my-home" element={<MyHome />}></Route>
                    </Route>
                    <Route path="/sign-up" element={<SignUp />}></Route>
                    <Route path="/create-invoice" element={<CreateInvoice />}></Route>

                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing