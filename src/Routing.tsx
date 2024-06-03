import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Page/Login/Login';
import Member from './Page/Member/Member';
import Spaces from './Page/Spaces/Spaces';
import Announcement from './Page/Announcement/Announcement';
import Files from './Page/Files/Files';
import Chat from './Page/Chat/Chat';
import Messenger from './Page/Messenger/Messenger';
import Billing from './Page/Billing/Billing';
import CreateInvoice from './Page/CreateInvoice/CreateInvoice';
import InvoiceDetails from './Page/InvoiceDetails/InvoiceDetails';
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
import ViewSpaces from './Component/ViewSpaces/ViewSpaces';
import ViewMember from './Component/ViewMember/ViewMember';
import Calender from './Page/Calender/Calender';
import BookTour from './Page/BookTour/BookTour';
import BookList from './Page/BookList/BookList';
import Visitor from './Page/Visitor/Visitor';
import VisitorList from './Page/VisitorList/VisitorList';
import VisitorMember from './Component/ViewMember/VisitorMember';

const Routing = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>

                    <Route element={<PrivateRoute />}>
                        <Route path="/member" element={<Member />}></Route>
                        <Route path="/member/:id" element={<ViewMember />}></Route>
                        <Route path="/visitor/:id" element={<VisitorMember />}></Route>
                        <Route path="/assets" element={<Spaces />}></Route>
                        <Route path="/assets/:id" element={<ViewSpaces />}></Route>
                        <Route path="/feed" element={<Announcement />}></Route>
                        <Route path="/files" element={<Files />}></Route>
                        {/* <Route path="/tickets" element={<Ticket />}></Route> */}
                        <Route path="/chat" element={<Chat />}></Route>
                        <Route path="/messenger" element={<Messenger />}></Route>
                        <Route path="/billing" element={<Billing />}></Route>
                        {/* <Route path="/create-invoice" element={<CreateInvoice />}></Route> */}
                        <Route path="/invoice-details/:id" element={<InvoiceDetails />}></Route>
                        <Route path="/calender" element={<Calender />}></Route>
                        <Route path="/settings" element={<Settings />}></Route>
                        <Route path="/task" element={<Task />}></Route>
                        <Route path="/dashboard" element={<Dashboard />}></Route>
                        <Route path="/visitor-log" element={<VisitorList />}></Route>
                    </Route>

                    {/* login */}
                    <Route path="/" element={<Login />}></Route>
                    {/* book tour */}
                    <Route path="/book-a-tour" element={<BookTour />}></Route>
                    <Route path="/book-list" element={<BookList />}></Route>
                    <Route path="/visitor" element={<Visitor />}></Route>
                    {/* member */}
                    <Route element={<UserRoute />}>
                        <Route path="/my-messenger" element={<Messenger />}></Route>
                        <Route path="/my-feed" element={<Announcement />}></Route>
                        <Route path="/my-settings" element={<MySetting />}></Route>
                        <Route path="/my-invoice" element={<MyInvoice />}></Route>
                        <Route path="/my-files" element={<MyFiles />}></Route>
                        <Route path="/my-home" element={<MyHome />}></Route>
                        <Route path="/my-invoice-details/:id" element={<InvoiceDetails />}></Route>
                    </Route>
                    <Route path="/sign-up" element={<SignUp />}></Route>
                    <Route path="/create-invoice" element={<CreateInvoice />}></Route>
                    
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing