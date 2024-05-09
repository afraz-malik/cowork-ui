import React, { useEffect, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bell from "../../Assets/Images/icon/bell-01.png";
import circle from "../../Assets/Images/icon/info-circle.png";
import avatar from "../../Assets/Images/icon/Avatar.png";
import arrow from "../../Assets/Images/icon/downIcon.png";
import userIcon from "../../Assets/Images/icon/assign.png";
import logout from "../../Assets/Images/icon/logout.png";
import { Dropdown } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { singleJwtMember } from '../../api/member';
import { isAuthenticate } from '../../api/auth';
import { DESKIE_API as API } from '../../config';
import { Link } from 'react-router-dom';
import memberIcon from '../../Assets/Images/icon/memberAvatar.png';

const Header = ({ onValueChange }: any) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = React.useState(false);
    const [userImage, setUserImage] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userRole, setUserRole] = useState("");
    const handleClick = () => {
        setCollapsed(!collapsed)
        onValueChange(collapsed);
    };
    const location = useLocation();
    const pathArray = location.pathname.split('/');
    const urlParams = pathArray[pathArray.length - 1];


    const logoutUser = () => {
        localStorage.removeItem("company");
        return navigate(`/`);
    }
    let auth = isAuthenticate();

    useEffect(() => {
        singleJwtMember(auth.token).then((data) => {
            if (data.statusCode === 200) {
                if (data.data.data.member_image) {
                    setUserImage(data.data.data.member_image);
                }
                else {
                    setUserImage(data.data.data.avatar);
                }
                setFirstName(data.data.data.first_name);
                setLastName(data.data.data.last_name);
                setUserRole(data.data.data.role);
            }
        })
    }, []);


    return (
        <>
            <div className='topNavbar'>
                <div className='contentHeading'>
                    <button className="sb-button" onClick={handleClick}><FontAwesomeIcon icon={faBars} /></button>
                    {urlParams === "member" ? <p>Members</p> : ""}
                    {urlParams === "assets" ? <p>Assets</p> : ""}
                    {urlParams === "files" ? <p>Files</p> : ""}
                    {urlParams === "tickets" ? <p>Ticket</p> : ""}
                    {urlParams === "task" ? <p>Tasks</p> : ""}
                    {urlParams === "dashboard" ? <p>Dashboard</p> : ""}
                    {urlParams === "messenger" ? <p>Messenger</p> : ""}
                    {urlParams === "announcements" ? <p>Announcements</p> : ""}
                    {urlParams === "settings" ? <p>Settings</p> : ""}
                </div>
                <div className='rightNavbar'>
                    <button><img src={circle} alt="circle" /></button>
                    <button><img src={bell} alt="bell" /></button>
                    <button className='memberImg'>
                        {userImage && userImage.length ? <img src={`${API}/${userImage}`} style={{ objectFit: "cover" }} alt="logo" />
                            : <img src={memberIcon} alt="bell" style={{ objectFit: "cover" }} />
                        }
                    </button>
                    <Dropdown>
                        <Dropdown.Toggle>
                            {firstName && firstName} <img src={arrow} alt="arrow" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <div className="navProfile">
                                {userImage && userImage.length ? <img className='logo' src={`${API}/${userImage}`} style={{ objectFit: "cover" }} alt="logo" />
                                    : <img className='logo' src={memberIcon} alt="bell" style={{ objectFit: "cover" }} />
                                }
                                <h6>{firstName && firstName} {lastName && lastName}</h6>
                                <p>{userRole && userRole === "admin" ? "Admin" : "Member"}</p>
                                {userRole === 'admin' ?  <Link to="/settings"><img src={userIcon} alt="admin" /> Profile</Link>
                                : <Link to="/my-settings"><img src={userIcon} alt="admin" /> Profile</Link>}
                                <Link to="/"><img src={logout} alt="admin" /> Logout</Link> 
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        </>
    )
}

export default Header