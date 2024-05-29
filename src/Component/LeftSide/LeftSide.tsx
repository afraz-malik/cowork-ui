import React, { useState, useEffect } from 'react';
import { Sidebar } from 'react-pro-sidebar';
import "./LeftSide.css";
import { Link, useLocation } from 'react-router-dom';
import adminIcon from "../../Assets/Images/icon/adminIcon.png";
import arrow from "../../Assets/Images/icon/arrow.png";
import { DESKIE_API as API } from '../../config';
// sidebar image
import dashboard from "../../Assets/Images/icon/dashboard.svg";
import message from "../../Assets/Images/icon/message-dots-circle.svg";
import calendar from "../../Assets/Images/icon/calendar.svg";
import layout from "../../Assets/Images/icon/layout-alt-01.svg";
import help from "../../Assets/Images/icon/life-buoy-01.svg";
import setting from "../../Assets/Images/icon/settings-01.svg";
import ticket from "../../Assets/Images/icon/ticket-02.svg";
import user from "../../Assets/Images/icon/user-01.svg";
import wallet02 from "../../Assets/Images/icon/wallet-02.svg";
import visitor from "../../Assets/Images/icon/user-check-02.png";
import { useNavigate } from 'react-router-dom';
import { singleProfile } from '../../api/settings';

interface CollapseProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}
const LeftSide = ({ collapsed, setCollapsed }: CollapseProps) => {
    const [companyName, setCompanyName] = useState("");
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const urlParams = pathArray[pathArray.length - 1];
    const storeUserAuth = localStorage.getItem('company');
    const userAuth = JSON.parse(storeUserAuth as string);
    const [companyAddress, setCompanyAddress] = useState("");
    const [darkIconImage, setDarkIconImage] = useState("");

    useEffect(() => {
        singleProfile().then((data) => {
            if (data.statusCode !== 200) {

            }
            else {
                setCompanyName(data.data.company_name);
                setDarkIconImage(data.data.company_logo_dark);
                setCompanyAddress(data.data.address);
            }
        })
    }, []);
    return (
        <div className='sideBar'>
            <Sidebar onBackdropClick={() => setCollapsed(false)} collapsed={collapsed} width="280px" collapsedWidth="0px">
                <div className="sidebarBox">
                    <div>
                        <div className="sidebarLogo"> 
                         {darkIconImage ? <img src={`${API}/${darkIconImage}`} alt="admin" /> 
                         : <img src={adminIcon} alt="admin" />}   
                        </div>
                        <div className="sidebarMenu" style={{ padding: "0px 15px" }}>
                            {userAuth && userAuth.user.role === "admin" ? <ul className="list-unstyled">
                            <li className={urlParams === "dashboard" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/dashboard"><img src={dashboard} alt="dashboard" />Dashboard</Link>
                                </li>
                                <li className={urlParams === "member" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/member"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21M16.5 7.5C16.5 9.98528 14.4853 12 12 12C9.51472 12 7.5 9.98528 7.5 7.5C7.5 5.01472 9.51472 3 12 3C14.4853 3 16.5 5.01472 16.5 7.5Z" stroke={urlParams === "member" ? "#FFFFFF" : "#98A2B3"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Members</Link>
                                </li>
                                <li className={urlParams === "assets" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/assets"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 9H21M9 9L9 21M7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3Z" stroke={urlParams === "assets" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Assets</Link>
                                </li>
                                <li className={urlParams === "task" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/task"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 10.9996L10.6422 15.8207C10.7734 15.8863 10.839 15.9191 10.9078 15.932C10.9687 15.9434 11.0313 15.9434 11.0922 15.932C11.161 15.9191 11.2266 15.8863 11.3578 15.8207L21 10.9996M1 15.9996L10.6422 20.8207C10.7734 20.8863 10.839 20.9191 10.9078 20.932C10.9687 20.9434 11.0313 20.9434 11.0922 20.932C11.161 20.9191 11.2266 20.8863 11.3578 20.8207L21 15.9996M1 5.99958L10.6422 1.17846C10.7734 1.11287 10.839 1.08008 10.9078 1.06717C10.9687 1.05574 11.0313 1.05574 11.0922 1.06717C11.161 1.08008 11.2266 1.11287 11.3578 1.17846L21 5.99958L11.3578 10.8207C11.2266 10.8863 11.161 10.9191 11.0922 10.932C11.0313 10.9434 10.9687 10.9434 10.9078 10.932C10.839 10.9191 10.7734 10.8863 10.6422 10.8207L1 5.99958Z" stroke={urlParams === "task" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Tasks</Link>
                                </li>
                                <li className={urlParams === "messenger" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/messenger"><img src={message} alt="dashboard" />Message Center</Link>
                                </li>
                                <li className={urlParams === "announcements" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/announcements"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 8V7M8 12.5V11.5M8 17V16M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" stroke={urlParams === "tickets" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Announcements</Link>
                                </li>

                                {/* <li className={urlParams === "tickets" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/tickets"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 8V7M8 12.5V11.5M8 17V16M6.8 20H17.2C18.8802 20 19.7202 20 20.362 19.673C20.9265 19.3854 21.3854 18.9265 21.673 18.362C22 17.7202 22 16.8802 22 15.2V8.8C22 7.11984 22 6.27976 21.673 5.63803C21.3854 5.07354 20.9265 4.6146 20.362 4.32698C19.7202 4 18.8802 4 17.2 4H6.8C5.11984 4 4.27976 4 3.63803 4.32698C3.07354 4.6146 2.6146 5.07354 2.32698 5.63803C2 6.27976 2 7.11984 2 8.8V15.2C2 16.8802 2 17.7202 2.32698 18.362C2.6146 18.9265 3.07354 19.3854 3.63803 19.673C4.27976 20 5.11984 20 6.8 20Z" stroke={urlParams === "tickets" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Ticket</Link>
                                </li> */}
                               <li className={urlParams === "calender" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/calender"><img src={calendar} alt="dashboard" />Calendar</Link>
                                </li> 
                                <li className={urlParams === "files" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/files"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke={urlParams === "files" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>Files</Link>
                                </li>
                                <li className={urlParams === "billing" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/billing"><img src={wallet02} alt="dashboard" />Finances</Link>
                                    {/* <button className={urlParams === "billing" ? "btn btn-toggle align-items-center rounded collapsed" : "btn btn-toggle align-items-center rounded collapsed"} data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="false">
                                        <img src={wallet02} alt="dashboard" />Finances
                                    </button>
                                    <div className={urlParams === "billing" ? "collapse show" : "collapse"} id="home-collapse">
                                        <ul className="btn-toggle-nav list-unstyled fw-normal small">
                                            <li className={urlParams === "billing" ? "activeDropdownMenu" : ""}><Link to="/billing">Billing</Link></li>
                                        </ul>
                                    </div> */}
                                </li>
                                <li className={urlParams === "visitor-log" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/visitor-log"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 15.5H7.5C6.10444 15.5 5.40665 15.5 4.83886 15.6722C3.56045 16.06 2.56004 17.0605 2.17224 18.3389C2 18.9067 2 19.6044 2 21M16 18L18 20L22 16M14.5 7.5C14.5 9.98528 12.4853 12 10 12C7.51472 12 5.5 9.98528 5.5 7.5C5.5 5.01472 7.51472 3 10 3C12.4853 3 14.5 5.01472 14.5 7.5Z" stroke={urlParams === "visitor-log" ? "#FFFFFF" : "#98A2B3"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Visitor Log</Link>
                            </li>
                                <li className={urlParams === "settings" ? "navLink activeMenu" : "navLink"}>
                                    <Link to="/settings"><img src={setting} alt="dashboard" />Settings</Link>
                                </li>
                            </ul>
                            :<ul className="list-unstyled">
                            <li className={urlParams === "my-home" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-home">
                                    <img src={dashboard} alt="dashboard" />Home</Link>
                            </li>
                            <li className={urlParams === "my-announcements" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-announcements">
                                    <img src={dashboard} alt="dashboard" />Announcements</Link>
                            </li>
                            <li className={urlParams === "my-messenger" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-messenger"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.9996L10.6422 15.8207C10.7734 15.8863 10.839 15.9191 10.9078 15.932C10.9687 15.9434 11.0313 15.9434 11.0922 15.932C11.161 15.9191 11.2266 15.8863 11.3578 15.8207L21 10.9996M1 15.9996L10.6422 20.8207C10.7734 20.8863 10.839 20.9191 10.9078 20.932C10.9687 20.9434 11.0313 20.9434 11.0922 20.932C11.161 20.9191 11.2266 20.8863 11.3578 20.8207L21 15.9996M1 5.99958L10.6422 1.17846C10.7734 1.11287 10.839 1.08008 10.9078 1.06717C10.9687 1.05574 11.0313 1.05574 11.0922 1.06717C11.161 1.08008 11.2266 1.11287 11.3578 1.17846L21 5.99958L11.3578 10.8207C11.2266 10.8863 11.161 10.9191 11.0922 10.932C11.0313 10.9434 10.9687 10.9434 10.9078 10.932C10.839 10.9191 10.7734 10.8863 10.6422 10.8207L1 5.99958Z" stroke={urlParams === "task" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>My Message</Link>
                            </li>
                            <li className={urlParams === "my-files" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-files"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke={urlParams === "files" ? "#FFFFFF" : "#98A2B3"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>My Files</Link>
                            </li>
                            <li className={urlParams === "my-invoice" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-invoice"><img src={wallet02} alt="dashboard" />My Billing</Link>
                            </li>
                            <li className={urlParams === "my-settings" ? "navLink activeMenu" : "navLink"}>
                                <Link to="/my-settings"><img src={setting} alt="dashboard" />Settings</Link>
                            </li>
                        </ul>}
                            
                        </div>
                    </div>
                    <div className="sidebarFooter">
                        <ul>
                            <li className="dropNavLink">
                                <button className="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#help-collapse" aria-expanded="false">
                                    <img src={help} alt="dashboard" /> HelpDesk
                                </button>
                                {/* <div className="collapse" id="help-collapse" >
                                    <ul className="btn-toggle-nav list-unstyled fw-normal small">
                                        <li><Link to="#"><img src={dashboard} alt="dashboard" /> Sub-menu</Link></li>
                                        <li><Link to="#"><img src={dashboard} alt="dashboard" /> Sub-menu</Link></li>
                                    </ul>
                                </div> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </Sidebar>
        </div>
    )
}

export default LeftSide